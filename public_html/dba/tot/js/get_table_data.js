/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			get_table_data.js
=============================================================*/

var MatchupTablesArray			= [];
var MatchupTableElementsArray	= [];
var matchupTableGUID			= 0;
var ListOfListsArray			= [];
var tableGroupsArray			= [];

function LoadMatchupTables(selectedIndex) {

	MatchupTablesArray	= [];
	tableGroupsArray	= [];

	var jqxhrMatchupTableListArr = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"IsActive = '1' AND IsList = '0' AND SiteGUID = '"+ UserData[0].SiteGUID +"' ORDER BY IsSystemTable DESC, IsLocked ASC, MatchupTableName ASC\"", function() {			
		MatchupTablesArray = jQuery.parseJSON(jqxhrMatchupTableListArr.responseText);
		
		var jqxhrTableGroups = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_TableGroups", function() {			
			tableGroupsArray = jQuery.parseJSON(jqxhrTableGroups.responseText);
		
			LoadMatchupTablesListBox(selectedIndex);
		});
	});
}

function LoadMatchupTableElements() {

	MatchupTableElementsArray = [];

	var jqxhrMatchupTableElementsArr = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"IsActive = '1' AND List_GUID = '"+ matchupTableGUID + "'ORDER BY Ordinal ASC\"", function() {
			
		var matchupTableElementsData = jQuery.parseJSON(jqxhrMatchupTableElementsArr.responseText);
		
		for(var key in matchupTableElementsData) {
			var formTypeObj = {};
			formTypeObj.label = matchupTableElementsData[key].ListElementData;
			formTypeObj.value = matchupTableElementsData[key].ListElement_GUID;
			MatchupTableElementsArray.push(formTypeObj);
		}		
		LoadMatchupTableElementsListBox();
	});
}

$(document).ready(function(){
	ListOfListsArray = [];
	
	var jqxhrListsOfListsArr = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"IsActive = '1' AND IsList = '1' AND SiteGUID = '"+ UserData[0].SiteGUID +"' ORDER BY IsSystemTable DESC, IsLocked ASC, MatchupTableName ASC\"", function() {
			
		var listsOfListsData = jQuery.parseJSON(jqxhrListsOfListsArr.responseText);
		
		for(var key in listsOfListsData) {
			var formTypeObj = {};
			formTypeObj.label = listsOfListsData[key].MatchupTableName;
			formTypeObj.value = listsOfListsData[key].MatchupTableGUID;
			ListOfListsArray.push(formTypeObj);
		}
	});
	
});