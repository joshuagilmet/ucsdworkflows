// CDW Version 1.0
// 
// Original Source
//
//  CDW Original
//
// History
//    Rev 1.1 - 11/20-2015 - JMG Fied typo where we had LastVar instead of SecondVar.
//    Rev 1 - 8/6/2015 - JMG
//
// Description:
//
//This simple script can be used to join variables together like a hostname and domain
//The between character can be blank
//e.g. firstvar = abox, between = ".", lastvar = "adomain.com"
//  results in abox.adomain.com 

var separator = input.BetweenVar;

if ( separator.length() > 0 ) {
	output.JOINEDVAR = input.FirstVar + input.BetweenVar + input.SecondVar;
} else {
	output.JOINEDVAR = input.FirstVar + input.SecondVar;
}