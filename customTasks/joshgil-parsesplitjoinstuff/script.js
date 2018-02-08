//we will want to search this text
var textToParse="Now is the time for all good men to come to the aid of their country";

var searchText="to come to the";

// Use the .indexOf method to find the position in the string where the text
// we are searching for start
var startPosition=textToParse.indexOf(searchText);
var searchTextLengthPlusAFewWords=startPosition + searchText.length() + 6;

logger.addError("Searching for : " + searchText + " | is found at | " + startPosition);
logger.addError("Going to get the characters from position #" + startPosition + " to " + searchTextLengthPlusAFewWords);
logger.addError("Substring: " + textToParse.substring(startPosition,searchTextLengthPlusAFewWords));

//start with a blank word
var word="";
// walk backwards through the string, .ooking for spaces to indicate tehe end of word in the string
for ( stringPosition = textToParse.length() ; startPosition !== 0 ; stringPosition-- ) {
	if ( textToParse.substring((stringPosition=1),stringPosition) != " " ) {
		word=textToParse.substring((stringPosition=1),stringPosition) + word;
	}else{
		logger.addError(word);
		word="";
	}
}