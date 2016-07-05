/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/MENU/SITES_JS
	File Name:			generateNewSite.js
=============================================================*/


var defaultSiteGUID;
var nameOfSite;
var nameOfFirst;
var nameOfLast;
var emailAddress;
var generatedPassword	= "";
var ExistingTables		= [];
var DefaultMatchUps		= [];
var newSiteGUID			= "";
var loadingValue		= 1;

//Step 1. The function that triggers it all.
function createSite(siteName, firstName, lastName, email) {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;
	
	nameOfSite		= siteName;
	nameOfFirst		= firstName;
	nameOfLast		= lastName;
	emailAddress	= email;
	newSiteGUID		= CreateGUID();
	getDefaultSiteGUID();
}


//Step 2. We start by getting the default SiteGUID on this current server.
function getDefaultSiteGUID() {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;

	//This grabs your JSON object of people.
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/org/Sites?where=\"SiteName='Default'\"", function( data ) {
		if($("#select-site :selected").val() == "null"){
			defaultSiteGUID = data[0].SiteGUID;
		}
		else{
			defaultSiteGUID = $("#select-site :selected").val();
		}
		
		getTablesAndLists();
	});
	
}

//Step 3. Return a list of tables and lists from the default site. 
function getTablesAndLists() {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;

	//This grabs your JSON object of people.
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"SiteGUID = '"+ defaultSiteGUID +"'\"", function( data ) {
		var length     = data.length;
		
		
		for(var key in data) {
			var currentObject = {};
			currentObject.dataTable           = data[key];
			currentObject.tableStructureArray = [];
			currentObject.oldGUID             = ""; 
			currentObject.oldValues           = [];
			ExistingTables.push(currentObject);
		}
		
		insertTableAndStructure(ExistingTables[0].dataTable, 1, length);

	});
}

function getTablesAndLists2(){
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;
				
	insertTableAndStructure(ExistingTables[0].dataTable, 1, length);
}

//Step 4. The process of getting the tables, and getting the list structures, then turning around and inserting them. -- Recursive
function insertTableAndStructure(table, tableNumber, length) {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;

	//Based on the tables we get back, we need to also grab the structure for each.
	
	getTableStructure(table.MatchupTableGUID, tableNumber, length);
}

function getTableStructure(tableGUID, tableNumber, length) {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;

	//This grabs your JSON object of people.
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"MatchupTableGUID='"+ tableGUID +"' AND SiteGUID = '"+ defaultSiteGUID +"'\"", function( data ) 	{
		var nextTableNumber = tableNumber + 1;
		var currentIndex    = tableNumber - 1;
		var currentObject   = ExistingTables[currentIndex];
		currentObject.tableStructureArray = data;
		
		if(nextTableNumber <= length) {
			var nextIndex       = tableNumber;
			var nextTableObject = ExistingTables[nextIndex].dataTable;
			insertTableAndStructure(nextTableObject, nextTableNumber, length);
		}
		else {
			//Here we have constructed our Tables and Structures. Now we need to 
			constructNewTablesAndTableElements();
		}
	});
}

function constructNewTablesAndTableElements() {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;
	
	//Here we are going to construct a brand new tables array and a brand new table elements array
	for(var key in ExistingTables) {
		var newGUID                       = CreateGUID();
		var currentDataTable              = ExistingTables[key].dataTable;
		var currentElementArray           = ExistingTables[key].tableStructureArray;
		var oldGUID                       = currentDataTable.MatchupTableGUID;
		currentDataTable.MatchupTableGUID = newGUID;
		currentDataTable.SiteGUID         = newSiteGUID;
		currentDataTable.Created          = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		currentDataTable.Modified         = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		ExistingTables[key].oldGUID       = oldGUID;
		
		//Let's loop through the structure and give them the new table GUID's.
		for(var val in currentElementArray) {
			currentElement                         = currentElementArray[val];
			currentElement.MatchupTableGUID        = newGUID;
			currentElement.MatchupTableElementGUID = CreateGUID();
			currentElement.SiteGUID                = newSiteGUID;  
			currentElement.Created                 = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			currentElement.Modified                = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		}
	}
	
	//Now that we have established a new set of tables and table elements, let's go ahead and 
	//update the relationships of all drop down lists.
	updateRelationships();
}

function updateRelationships() {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;
	
	for(var key in ExistingTables) {
		//Here we're only going to update a relationship that contains a type of "DDL" as an element.
		var currentElementArray           = ExistingTables[key].tableStructureArray;
		
		for(var val in currentElementArray) {
			var currentElement            = currentElementArray[val];
			(currentElement.ElementControlType == "ddl") ? UpdateRelationshipForElement(currentElement) : false;
		}
	}
	
	var tableName   = ExistingTables[0].dataTable.MatchupTableName;
	var tableNumber = 1;
	var length      = ExistingTables.length;
	 
	grabValues(tableName, tableNumber, length);
}

function grabValues(tableName, tableNumber, length) {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;
	
	//This grabs your JSON object of people.
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + defaultSiteGUID + "/" + tableName, function( data ) {
		var nextTableNumber = tableNumber + 1;
		var currentIndex    = tableNumber - 1;
		ExistingTables[currentIndex].oldValues = data;
		
		if(nextTableNumber <= length) {
			var nextIndex       = tableNumber;
			var nextTableName   = ExistingTables[nextIndex].dataTable.MatchupTableName;
			grabValues(nextTableName, nextTableNumber, length);
		}
		else {
			//Here we have constructed our Tables and Structures. Now we need to 
			insertSite();
		}
	});
}

function insertSite() {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;

	fields   = {};
	mainDict = {};
	
	mainDict.SiteGUID    = newSiteGUID;
	mainDict.SiteName    = nameOfSite;
	mainDict.TimezoneId  = 1;
	mainDict.DisplayName = nameOfSite;
	mainDict.IsActive    = 1;
	mainDict.Created     = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	mainDict.Modified    = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	mainDict.ProcessFlag = false;
	
	fields.fields = mainDict;
	
	$.ajax ({
        headers: {
             "Content-Type": "application/json"
        },
        url: ruIP + ruPort + listsDB + listEN + "create/org/Sites",
        type: "POST",
        data: JSON.stringify(fields),
        success: function(){
            insertTables();
        }
	 });
}

function insertTables() {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;

	var fields      = {};
	var fieldsArray = [];
	
	for(var key in ExistingTables) {
		var mainDict     = {};
		var currentTable = ExistingTables[key].dataTable; 
		
		mainDict.SiteGUID			= currentTable.SiteGUID;
		mainDict.MatchupTableName	= currentTable.MatchupTableName;
		mainDict.MatchupTableGUID	= currentTable.MatchupTableGUID;
		mainDict.TableGroup			= currentTable.TableGroup;
		mainDict.IsSystemTable		= currentTable.IsSystemTable;
		mainDict.IsLocked			= currentTable.IsLocked;
		mainDict.IsList				= currentTable.IsList;
		mainDict.IsActive			= currentTable.IsActive; 
		mainDict.Icon				= currentTable.Icon;
		mainDict.Created			= currentTable.Created;
		mainDict.Modified			= currentTable.Modified;
		mainDict.Obsolete			= currentTable.Obsolete;
		
		fieldsArray.push(mainDict);
	}
	
	fields.fields = fieldsArray;
	
	$.ajax ({
			headers: {
						"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "create/bulk/dbo/MatchupTables",
			type: "POST",
			data: JSON.stringify(fields),
			success: function(){
				insertElements();
			},
			error: function(){
				DisplayAlert(languagePack.message.alert,languagePack.message.cantCreateTables);
			}
	 });
}

function insertElements() {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;
	
	var fields      = {};
	var fieldsArray = [];
	
	for(var key in ExistingTables) {
		
		var currentElements = ExistingTables[key].tableStructureArray; 
		
		for(var val in currentElements) {
			currentElement                   = currentElements[val];
			
			var mainDict                     = {};
			
			mainDict.ControlVariable1        = currentElement.ControlVariable1;
			mainDict.ControlVariable2        = currentElement.ControlVariable2;
			mainDict.ControlVariable3        = currentElement.ControlVariable3;
			mainDict.ControlVariable4        = currentElement.ControlVariable4;
			mainDict.ControlVariable5        = currentElement.ControlVariable5;
			mainDict.ControlVariable6        = currentElement.ControlVariable6;
			mainDict.ElementControlType      = currentElement.ElementControlType;
			mainDict.ElementDataType         = currentElement.ElementDataType;
			mainDict.MatchupTableElementGUID = currentElement.MatchupTableElementGUID;
			mainDict.MatchupTableElementName = currentElement.MatchupTableElementName;
			mainDict.MatchupTableGUID        = currentElement.MatchupTableGUID;
			mainDict.Ordinal                 = currentElement.Ordinal;
			mainDict.SiteGUID                = currentElement.SiteGUID;
			mainDict.IsActive                = currentElement.IsActive; 
			mainDict.Created                 = currentElement.Created; 
			mainDict.Modified                = currentElement.Modified; 

			
			fieldsArray.push(mainDict);
		}
	}
	
	fields.fields = fieldsArray;
	
	$.ajax ({
			headers: {
						"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "create/bulk/dbo/MatchupTableElements",
			type: "POST",
			data: JSON.stringify(fields),
			success: function(){
				var tableName   = ExistingTables[0].dataTable.MatchupTableName;
				var tableNumber = 1;
				var length      = ExistingTables.length;
				insertValues(tableName, tableNumber, length);
			},
			error: function(){
				DisplayAlert(languagePack.message.alert,languagePack.message.cantCreateTableElem);
			}
	 });
}

function insertValues(tableName, tableNumber, length) {

	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;
		
	UpdateProgressBar(tableName, tableNumber, length);
	var nextTableNumber = tableNumber + 1;
	var currentIndex    = tableNumber - 1;
	
	if($.inArray(tableName, ExistingTables2) == -1)
	{
		if(nextTableNumber <= length) {
			var nextIndex       = tableNumber;
			var nextTableName   = ExistingTables[nextIndex].dataTable.MatchupTableName;
			insertValues(nextTableName, nextTableNumber, length);
		}
		else {
			updateTableGroup();
		}
	}
	else
	{
		var fields      = {};
		var fieldsArray = [];
		
		var currentValues = ExistingTables[currentIndex].oldValues; 
		
		for(var val in currentValues) {
			var record                   = currentValues[val];
			
			delete record.TableRecordGUID;
			
			fieldsArray.push(record);
		}
			
		fields.fields = fieldsArray;
		
		$.ajax ({
			headers: {
				 "Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "create/bulk/virtual/" + newSiteGUID + "/" + tableName,
			type: "POST",
			data: JSON.stringify(fields),
			success: function(){
				if(nextTableNumber <= length) {
					var nextIndex       = tableNumber;
					var nextTableName   = ExistingTables[nextIndex].dataTable.MatchupTableName;
					insertValues(nextTableName, nextTableNumber, length);
				}
				else {
					updateTableGroup();
					/*
					DisplayAlert(languagePack.message.alert,languagePack.message.newSiteSuccesful1 + " " + emailAddress + " " +languagePack.message.newSiteSuccesful2);
					createDefaultUser();*/
				}
			},
			error: function(){
				 DisplayAlert(languagePack.message.alert,languagePack.message.cantCreateTableElem);
			}
		});
	}
}

function updateTableGroup(){
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + defaultSiteGUID + "/SYS_TableGroups", function( olddata ) {
		$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + newSiteGUID + "/SYS_TableGroups", function( newdata ) {
			var arrObj = [];
			
			for(var key in olddata){
				for(var key2 in newdata){
					if(olddata[key]["SYS_TableGroups"] == newdata[key2]["SYS_TableGroups"]){
						var obj = {};
						obj.oldGUID = olddata[key]["TableRecordGUID"];
						obj.newGUID = newdata[key2]["TableRecordGUID"];
						
						arrObj.push(obj);
					}
				}
			}
			
			$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"SiteGUID = '"+ newSiteGUID +"'\"", function( data3 ) {
				var updatedArr = [];
				
				for(var key in data3){
					var dataRowObj	= {};
					var apiKeyObj	= {};
					var tg = "";
					
					for(var key2 in arrObj){
						if(data3[key]["TableGroup"] == arrObj[key2]["oldGUID"]){
							tg	= arrObj[key2]["newGUID"];
						}
					}
										
					apiKeyObj.MatchupTableGUID	= data3[key].MatchupTableGUID;
					dataRowObj.APIKEY					= apiKeyObj;
					dataRowObj.TableGroup			= tg;
					updatedArr.push(dataRowObj);
				}
				
				var jsonData = {
			 		"fields": updatedArr
				};
				
				$.ajax ({
					headers: {
						"Content-Type": "application/json"
					},
					url: ruIP + ruPort + listsDB + listEN + "update/bulk/dbo/MatchupTables",
					type: "POST",
					data: JSON.stringify(jsonData),
					success: function(){
						DisplayAlert(languagePack.message.alert,languagePack.message.newSiteSuccesful1 + " " + emailAddress + " " +languagePack.message.newSiteSuccesful2);
						createDefaultUser();
					},
					error: function(){
						DisplayAlert(languagePack.message.error,languagePack.message.recordsNotUpdated);
					}
				});
			});
		});
	});
}

function createDefaultUser() {
	DisplayPreloader("Creating User Account", loadingValue);
	loadingValue++;
	
	generatedPassword = GeneratePassword();

	fields   = {};
	mainDict = {};
	
	mainDict.SiteGUID			= newSiteGUID;
	mainDict.PersonGUID			= CreateGUID();
	mainDict.RoleGUID			= 'A11B7AA8-A71A-44FA-A871-DF0EE8989A2A';
	mainDict.Firstname			= nameOfFirst;
	mainDict.LastName			= nameOfLast;
	mainDict.DisplayName		= nameOfFirst + " " + nameOfLast;
	mainDict.AppUserName		= emailAddress;
	mainDict.Email				= emailAddress;
	mainDict.AppPassword		= generatedPassword;
	mainDict.IsLDAPUser			= false;
	mainDict.WebUser			= true;
	mainDict.iOSUser			= true;
	mainDict.IsLicenseAccepted	= false;
	mainDict.IsActive			= true;
	mainDict.Created			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	mainDict.Modified			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	mainDict.Obsolete			= moment().format("9999-12-31T00:00:00.000z");
	mainDict.ProcessFlag		= false;
	
	fields.fields = mainDict;
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/cfg/Person",
		type: "POST",
		data: JSON.stringify(fields),
		success: function(){
			DisplayPreloader("Creating User Account", 100);
			LoadSites();
		},
		error: function(){
			ClosePreloader();
			DisplayAlert(languagePack.message.alert,languagePack.message.newUserFailed + " " + languagePack.message.consultAdmin);
		}
	});
}

function confirmSiteDelete(siteGUID, siteName){
	DisplayConfirm("Confirm Delete", "Are you sure you want to <b>DELETE</b> the site: "+siteName+"?",
		function() {
			DeleteSite(siteGUID);
		}
	);
}

function DeleteSite(SiteGUID) {
	LockForService("Deleting...");
	
	var inputParams  = [];
	LineupPlanDetail = [];
	
	var param1 = {"paramName":"SiteGUID", "paramType":"varchar", "paramValue":SiteGUID};
	
	inputParams.push(param1);
	
	var inputParamsContainer         = {};
	inputParamsContainer.inputParams = inputParams;
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + 'exec/procedure/dbo.Delete_Site',
		type: "POST",
		data: JSON.stringify(inputParamsContainer),
		success: function(data){
			Materialize.toast('Site deleted', 4000);
			LoadSites();
		}
	});	
}


//Utility
function UpdateRelationshipForElement(element) {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;
	
	var oldGUIDtoSearch = element.ControlVariable1;
	
	for(var key in ExistingTables) {
		var currentObject = ExistingTables[key];
		(currentObject.oldGUID == oldGUIDtoSearch) ? element.ControlVariable1 = currentObject.dataTable.MatchupTableGUID : false;
	}
}

//Utility
function GeneratePassword() {
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;
	
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var string_length = 24;
	var randomString = '';
	
	for(var i = 0; i < string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomString += chars.substring(rnum, rnum+1);
	}
	return randomString;
}





