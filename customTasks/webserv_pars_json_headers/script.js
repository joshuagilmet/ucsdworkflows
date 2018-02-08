var jsonToParse = input.incomingText;
var hostObject = "NOT-SET";
var connectionObject = "NOT-SET";

//Print original JSON
logger.addError ("JSON to Parse: " + jsonToParse);

//Create JSON object to manipulate
var jsonObject = JSON.getJsonElement(jsonToParse,null);

hostObject = jsonObject.get('headers').get('Host').getAsString();
connectionObject = jsonObject.get('headers').get('Connection').getAsString();

logger.addError("Host: " + hostObject);
logger.addError("Connection: " + connectionObject);

output.hostObject = hostObject
output.connectionObject = connectionObject