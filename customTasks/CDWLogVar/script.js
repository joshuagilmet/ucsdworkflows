// CDW Version 1.0
//
// Original Source
//
//  CDW Original
//
// History
//    Rev 2.0 - 1/12/2017 - JMG
//    Rev 1 - 8/6/2015 - JMG
//
// Description:
//     Log Variables from UCS Director.  This makes it easier to debug.  Note that this function allows you to
//     log everything returned, or only the first 1k.  The limitation was introduced becuase in UCSD 6.0(1),
//     logging anything over 1k cause a overflow in Java and those logs would not appear.
//     This function should be backwards compatible with prior versions of CDWLogVar
//
importPackage(org.apache.log4j);
importPackage(java.io);
importPackage(java.io);
importPackage(java.lang);
importPackage(java.util);
importPackage(com.cloupia.model.cIM);
importPackage(com.cloupia.service.cIM.inframgr);

var logEverything = input.logEverything;
var chunksize = 1024;

function printVariable() {

    // Log to the workflow log
    try {
        var printVar = input.printVar;
        logger.addError("printVar Length:  " + printVar.length());
        if (printVar.length() < chunksize) {
            logger.addError("printVar:  " + printVar);
        } else {
            if (logEverything == "true") {
                logger.addError("printVar Length:  " + printVar.length());
                var printVarLoop = Math.ceil(printVar.length() / chunksize);
                for (var loop = 0; loop != printVarLoop; loop++) {
                    var start = (loop * chunksize);
                    var end = (loop * chunksize + chunksize);
                    logger.addError("printvar[" + loop + "]:  " + printVar.substring(start, end));
                }
            } else {
                logger.addError("printVar[First Chunk]:  " + printVar.substring(0, chunksize));
            }
        }
    } catch (e) {}

    try {
        var printVarClear = input.printVarClear;
        logger.addError("printVarClear Length:  " + printVarClear.length());
        if (printVarClear.length() < chunksize) {
            logger.addError("printVarClear:  " + printVarClear);
        } else {
            if (logEverything == "true") {
                var printVarClearLoop = Math.ceil(printVarClear.length() / chunksize);
                for (var loop = 0; loop != printVarClearLoop; loop++) {
                    var start = (loop * chunksize);
                    var end = (loop * chunksize + chunksize);
                    logger.addError("printVarClear[" + loop + "]:  " + printVarClear.substring(start, end));
                }
            } else {
                logger.addError("printVarClear[First Chunk]:  " + printVarClear.substring(0, chunksize));
            }
        }
    } catch (e) {}
}

printVariable();