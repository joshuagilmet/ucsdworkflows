// CDW Version 2.3
// 
// Original Source
//
//  https://communities.cisco.com/docs/DOC-57405
//
// History
//    Rev 2.3 - 6/9/2016 - JMG - Added URL encoding for known characters
//    Rev 2.2 - 4/22/2016 - JMG - Having it hide the right value for the header in case it contains sensitive info
//    Rev 2.1 - 2/2/2016 - JMG - Fixed issue where it ignores ports passed to it
//    Rev 2.0 - 12/15/2015 - JMG - reworked for UCSD 5.4 as prior implementation worked only up to 5.3
//    Rev 1.1 - 8/24/2015 - JMG - Logs length of AUTH_USER & AUTH_PASSWORD
//    Rev 1 - 8/6/2015 - JMG
//
// Description:
//     You can use this to connect to a web service be it XML/SOAP or JSON
//     It supports sending a singular set of HTTP headers at the moment.

//----------------------------------------------------------------------------------------
//
//        Author: Russ Whitear (rwhitear@cisco.com)
//
// Workflow Task Name: HTTP_Function_v3_5.4.0.0
//
//            Version: 3.0
//
//            Updates: SSL Socket Factory modified for JDK8.
//
//      Modifications: Script now retrieves the network comment field from within the
//                     Infoblox token message response.
//
//             Inputs: none.
//
//            Outputs: none.
//
//----------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------
//                                 ### FUNCTIONS ###
//----------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------
//
//        Author: Russ Whitear (rwhitear@cisco.com)
//
// Function Name: httpRequest()
//
//       Version: 3.0
//
// Modifications: Added HTTP header Connection:close to execute method to overcome the
//                CLOSE_WAIT issue caused with releaseConnection().
//
//                Modified SSL socket factory code to work with UCS Director 5.4.0.0.
//
//   Description: HTTP Request function - httpRequest.
//
//                I have made the httpClient functionality more object like in order to
//                make cloupia scripts more readable when making many/multiple HTTP/HTTPS
//                requests within a single script.
//
//      Usage: 1. var request = new httpRequest();                   // Create new object.
//
//             2. request.setup("192.168.10.10","https","admin","cisco123");      // SSL.
//          or:   request.setup("192.168.10.10","http","admin","cisco123");       // HTTP.
//          or:   request.setup("192.168.10.10","https");           // SSL, no basicAuth.
//          or:   request.setup("192.168.10.10","http");            // HTTP, no basicAuth.
//
//             3. request.getRequest("/");                    // HTTP GET (URI).
//          or:   request.postRequest("/","some body text");  // HTTP POST (URI,BodyText).
//          or:   request.deleteRequest("/");                 // HTTP DELETE (URI).
//
//  (optional) 4. request.contentType("json");            // Add Content-Type HTTP header.
//          or:   request.contentType("xml");
//
//  (optional) 5. request.addHeader("X-Cloupia-Request-Key","1234567890");  // Any Header.
//
//             6. var statusCode = request.execute();                     // Send request.
//
//             7. var response = request.getResponse("asString");   // Response as string.
//          or:   var response = request.getResponse("asStream");   // Response as stream.
//
//             8. request.disconnect();                             // Release connection.
//
//
//          Note: Be sure to add these lines to the top of your script:
//
//          importPackage(java.util);
//          importPackage(com.cloupia.lib.util);
//          importPackage(org.apache.commons.httpclient);
//          importPackage(org.apache.commons.httpclient.cookie);
//          importPackage(org.apache.commons.httpclient.methods);
//          importPackage(org.apache.commons.httpclient.auth);
//          importPackage(org.apache.commons.httpclient.protocol);
//          importClass(org.apache.commons.httpclient.protocol.SecureProtocolSocketFactory);
//          importPackage(com.cloupia.lib.cIaaS.vcd.api);
//
//----------------------------------------------------------------------------------------

importPackage(java.util);
importPackage(com.cloupia.lib.util);
importPackage(org.apache.commons.httpclient);
importPackage(org.apache.commons.httpclient.cookie);
importPackage(org.apache.commons.httpclient.methods);
importPackage(org.apache.commons.httpclient.auth);
importPackage(org.apache.commons.httpclient.protocol);
importClass(org.apache.commons.httpclient.protocol.SecureProtocolSocketFactory);
importPackage(com.cloupia.lib.cIaaS.vcd.api);

var httpRequest = function () {};

httpRequest.prototype.setup = function(serverIp, serverPort, transport, username, password) {
        this.serverIp = serverIp;
        this.transport = transport;
        this.username = username;
        this.password = password;
        this.serverPort = serverPort;
        this.httpClient = new HttpClient();

        // Decide whether to create an HTTP or HTTPS connection based up 'transport'.
        if( this.transport == "https" ) {
                this.httpClient = CustomEasySSLSocketFactory.getIgnoreSSLClient(this.serverIp, this.serverPort);
                this.httpClient.getParams().setCookiePolicy("default");
        } else {
                // Create new HTTP connection.
                this.httpClient.getHostConfiguration().setHost(this.serverIp, this.serverPort, "http");
        }
        this.httpClient.getParams().setCookiePolicy("default");

        // If username and password supplied, then use basicAuth.
        if( this.username && this.password ) {
                this.httpClient.getParams().setAuthenticationPreemptive(true);
                this.defaultcreds = new UsernamePasswordCredentials(this.username, this.password);
                this.httpClient.getState().setCredentials(new AuthScope(this.serverIp, -1, null), this.defaultcreds);
        }
};

httpRequest.prototype.contentType = function(contentType) {
        this.contentType = contentType;
        this.contentTypes = [
                ["xml","application/xml"],
                ["json","application/json"]
        ];

        for( this.i=0; this.i<this.contentTypes.length; this.i++)
                if(this.contentTypes[this.i][0] == this.contentType)
                        this.httpMethod.addRequestHeader("Content-Type", this.contentTypes[this.i][1]);
};

httpRequest.prototype.addHeader = function(headerName,headerValue) {
        this.headerName = headerName;
        this.headerValue = headerValue;
        this.httpMethod.addRequestHeader(this.headerName, this.headerValue);
};

httpRequest.prototype.execute = function() {
        // Connection:close is hard coded here in order to ensure that the TCP connection
        // gets torn down immediately after the request. Comment this line out if you wish to
        // experiment with HTTP persistence.
        this.httpMethod.addRequestHeader("Connection", "close");
        this.httpClient.executeMethod(this.httpMethod);
        // Retrieve status code.
        this.statusCode = this.httpMethod.getStatusCode();
        return this.statusCode;
}

httpRequest.prototype.getRequest = function(uri) {
        this.uri = uri;
        // Get request.
        this.httpMethod = new GetMethod(this.uri);
};

httpRequest.prototype.postRequest = function(uri,bodytext) {
        this.uri = uri;
        this.bodytext = bodytext;
        // POST Request.
        this.httpMethod = new PostMethod(this.uri);
        this.httpMethod.setRequestEntity(new StringRequestEntity(this.bodytext));
};

httpRequest.prototype.getResponse = function(asType) {
        this.asType = asType;
        if( this.asType == "asStream" )
                return this.httpMethod.getResponseBodyAsStream();
        else
                return this.httpMethod.getResponseBodyAsString();
};

httpRequest.prototype.deleteRequest = function(uri) {
        this.uri = uri;
        // Get request.
        this.httpMethod = new DeleteMethod(this.uri);
};

httpRequest.prototype.disconnect = function() {
        // Release connection.
        this.httpMethod.releaseConnection();
};

// Main code begins here 

var debug=1;

var request = new httpRequest();

// Look for characters that need to be swapped out for
// proper URI encoding
function encodeUCSDUrl(url,encodeCharacters) {
	var newURL="";
	var singleCharacter="";
	for ( var urlLoop=0 ; urlLoop != url.length() ; urlLoop++) {
		singleCharacter=url.substring(urlLoop,(urlLoop+1));
		if ( isEncoded(singleCharacter,encodeCharacters) ) {
			singleCharacter=isEncoded(singleCharacter,encodeCharacters);
		}
		newURL=newURL + singleCharacter;
	}
	return newURL;
}

function isEncoded(needle,hayStack) {
	var encoding=needle.charCodeAt(0);
	var Result=hayStack[encoding];
	return Result;
}

//  These are charcters we have found UCS Director's Apache library need to have
//    encoded as it does not support doing it on their own
var charactersToBeEncoded= [ "{" , "}", " " ];
var encodeCharacters=[];
var encoding="";
var character="";

//  Build up the 'encodedCharacters' array to include those characters & codes
//    we reference that we need to switch out
for ( var characterLoop = 0 ; characterLoop != charactersToBeEncoded.length ; characterLoop++ ) {
	character=charactersToBeEncoded[characterLoop];
	encoding=character.charCodeAt(0);
	encodeCharacters[encoding]=encodeURIComponent(character);
}

var serverAddress = input.ServerAddress; 
var serverProtocol = input.ServerProtocol; 
var serverPort = input.ServerPort; 
var httpAuthUser = input.HTTPAuthUser; 
var httpAuthPass = input.HTTPAuthPass; 
var httpMethod = input.HTTPMethod; 
var httpURI = input.HTTPURI; 
httpURI=encodeUCSDUrl(httpURI,encodeCharacters);

var httpBodyRequestText = input.HTTPBodyRequestText; 
var httpContentType = input.HTTPContentType; 
var httpRequestHeaderLeft = input.HTTPRequestHeaderLeft; 
var httpRequestHeaderRight = input.HTTPRequestHeaderRight;

if ( debug == 1 ) {
	logger.addError("serverAddress:  " + serverAddress);
	logger.addError("serverProtocol:  " + serverProtocol);
	logger.addError("serverPort:  " + serverPort);
	logger.addError("httpAuthUser:  SKIPPED, length:  " + httpAuthUser.length());
	logger.addError("httpAuthPass:  SKIPPED, length:  " + httpAuthPass.length());
	logger.addError("httpMethod:  " + httpMethod );
	logger.addError("httpURI:  " + httpURI );
// may contain sensitive information, only uncomment if you are sure
//	logger.addError("httpBodyRequestText:  " + httpBodyRequestText );
	logger.addError("httpContentType:  " + httpContentType);
	logger.addError("httpRequestHeaderLeft:  " + httpRequestHeaderLeft);
//	logger.addError("httpRequestHeaderRight:  " + httpRequestHeaderRight);
}

if ( httpAuthUser.length() > 1 ) {
	request.setup(serverAddress,serverPort,serverProtocol,httpAuthUser,httpAuthPass);
} else {
	request.setup(serverAddress,serverPort,serverProtocol);
}

if ( httpMethod == "GET" ) {
	request.getRequest(httpURI);
} else {
	request.postRequest(httpURI,httpBodyRequestText);
}

if ( debug == 1 ) {
	var number=httpRequestHeaderLeft.length();
	logger.addError("number:  " + number + "\n");
	logger.addError("httpRequestHeaderLeft.length:  " + httpRequestHeaderLeft.length() + "\n"); 
} 

if ( httpRequestHeaderLeft.length() > 1 ) {
	request.addHeader(httpRequestHeaderLeft,httpRequestHeaderRight);
}

if ( httpContentType.length() > 1 ) {
	request.contentType(httpContentType);
}

//request.addHeader("X-Cloupia-Request-Key","1234567890");
var statusCode = request.execute();
logger.addInfo("Request 1 status code: " +statusCode);

var response = request.getResponse("asString");
if ( debug == 2 ) {
	logger.addInfo("Response: " + response);
}

output.HTTPResponse=response;
output.HTTPResponseCode=statusCode;
request.disconnect();
if ( debug ) {
	logger.addError("Response Length:  " + response.length());
}