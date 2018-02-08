importPackage(java.net);
importPackage(java.lang);
importPackage(java.util);
importPackage(java.io);
importPackage(com.cloupia.model.cEvent.notify);
importPackage(com.cloupia.model.cIM);
importPackage(com.cloupia.lib.util.mail);
importPackage(com.cloupia.fw.objstore);
importPackage(com.cloupia.lib.util.managedreports);
importPackage(com.cloupia.lib.util);

var uri="/app/api/rest?formatType=json&opName=userAPIGetTabularReport&opData=%7B%22param0%22%3A37%2C%22param1%22%3A%22UCSPE%22%2C%22param2%22%3A%22UCS-CHASSIS-T50%22%7D"

var callWebServiceCallTask = ctxt.createInnerTaskContext("custom_CDWWebServiceCall54");
callWebServiceCallTask.setInput("ServerAddress", "127.0.0.1");
callWebServiceCallTask.setInput("ServerProtocol", "https");
callWebServiceCallTask.setInput("HTTPAuthUser", "");
callWebServiceCallTask.setInput("HTTPAuthPass", "");
callWebServiceCallTask.setInput("HTTPMethod", "GET");
callWebServiceCallTask.setInput("HTTPURI", uri);
callWebServiceCallTask.setInput("HTTPBodyRequestText", "");
callWebServiceCallTask.setInput("HTTPContentType", "json");
callWebServiceCallTask.setInput("HTTPRequestHeaderLeft", "X-Cloupia-Request-Key");
callWebServiceCallTask.setInput("HTTPRequestHeaderRight", "6B0208A83CA449CEAB81BAEA4CD60590");
callWebServiceCallTask.setInput("ServerPort", "443");
callWebServiceCallTask.execute();

var output = callWebServiceCallTask.getOutput("HTTPResponse");
logger.addError("This is the output from the web service call: " + output);