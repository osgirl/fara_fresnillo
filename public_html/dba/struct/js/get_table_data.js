/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			get_table_data.js
=============================================================*/

var FormStructuresArray			= [];
var MatchupTableElementsArray	= [];
var matchupTableGUID			= 0;
var ListOfListsArray			= [];
var MatchupTablesArray			= [];
var tableGroupsArray			= [];
var systemEventTypes			= [];

function LoadMatchupTables(itemName) {

	FormStructuresArray	= [];
	tableGroupsArray	= [];

	var jqxhrMatchupTableListArr = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/FormStructures?where=\"1 = 1 ORDER BY FormStructureName ASC\"", function() {			
		FormStructuresArray = jQuery.parseJSON(jqxhrMatchupTableListArr.responseText);
		
		var jqxhrTableGroups = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_TableGroups", function() {			
			tableGroupsArray = jQuery.parseJSON(jqxhrTableGroups.responseText);
		
			LoadFormStrcuturesListBox(itemName);
		});
	});
}

function LoadMatchupTableElements() {

	var jqxhrMatchupTableElementsArr = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/FormStructureElements?where=\"FormStructureGUID = '"+ matchupTableGUID + "'ORDER BY Ordinal ASC\"", function() {
		MatchupTableElementsArray = jQuery.parseJSON(jqxhrMatchupTableElementsArr.responseText);
	});
}

$(document).ready(function(){
	ListOfListsArray	= [];
	MatchupTablesArray	= [];	
	systemEventTypes	= [];
	
	var jqxhrListsOfListsArr = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"IsActive = '1' AND IsList = '1' AND SiteGUID = '"+ UserData[0].SiteGUID +"' ORDER BY IsSystemTable DESC, IsLocked ASC, MatchupTableName ASC\"", function() {
			
		var listsOfListsData = jQuery.parseJSON(jqxhrListsOfListsArr.responseText);
		
		for(var key in listsOfListsData) {
			var formTypeObj = {};
			formTypeObj.label = listsOfListsData[key].MatchupTableName;
			formTypeObj.value = listsOfListsData[key].MatchupTableGUID;
			ListOfListsArray.push(formTypeObj);
		}
	});
	
	var jqxhrSystemEventTypes = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/SYS_EventTypes?where=\"1 = 1 ORDER BY SYS_EventTypes ASC\"", function() {
		systemEventTypes = jQuery.parseJSON(jqxhrSystemEventTypes.responseText);
	});
	
	var jqxhrMatchupTables = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"IsActive = '1' AND IsList = '0' AND SiteGUID = '"+ UserData[0].SiteGUID +"' ORDER BY MatchupTableName ASC\"", function() {
		MatchupTablesArray = jQuery.parseJSON(jqxhrMatchupTables.responseText);
	});
	
});