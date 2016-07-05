var DocumentID = "";
var FormID     = 8; //The ID from the Forms DB.
var CreatorID  = 2; //Currently treated as "ClientID"
var DocName    = "Safety Contact";
var DisplayN   = "Safety Contact";

$(document).ready(function() {
	receivePostInformation(rootURL, FormID, CreatorID, DisplayN, DisplayName);
});