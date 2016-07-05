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
var ExistingTables2Bckup = [];

//Step 1. The function that triggers it all.
function createSite(siteGuid, siteName, firstName, lastName, email) {
	
	
	DisplayPreloader("Loading...", loadingValue);
	loadingValue++;
	
	nameOfSite		= siteName;
	nameOfFirst		= firstName;
	nameOfLast		= lastName;
	emailAddress	= email;
	newSiteGUID		= siteGuid;
	insertSite();
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
            createDefaultUser();
        }
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
			createGroupsTable();
		}
	});
}

function createGroupsTable() {
	var dataRowObj = {};
	var dataRowObj2 = {};

	dataRowObj.MatchupTableGUID = CreateGUID();
	dataRowObj.MatchupTableName	= 'SYS_TableGroups';
	dataRowObj.SiteGUID			= newSiteGUID;
	dataRowObj.IsActive			= 1;
	dataRowObj.IsList			= 1,
	dataRowObj.IsSystemTable	= 1;
	dataRowObj.AvoidSync		= 0;
	dataRowObj.Created			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	dataRowObj.CreatedByGUID	= UserData[0].PersonGUID;
	dataRowObj.Modified			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	dataRowObj.Obsolete			= moment().format("9999-12-31T00:00:00.000z");
	
	dataRowObj2.MatchupTableElementGUID = CreateGUID();
	dataRowObj2.MatchupTableGUID		= dataRowObj.MatchupTableGUID;
	dataRowObj2.SiteGUID				= newSiteGUID;
	dataRowObj2.MatchupTableElementName = 'SYS_TableGroups';
	dataRowObj2.Ordinal					= 1
	dataRowObj2.ElementControlType		= "textfield";
	dataRowObj2.ElementDataType			= "string";
	dataRowObj2.Created					= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	dataRowObj2.Modified				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	dataRowObj2.Obsolete				= moment().format("9999-12-31T00:00:00.000z");
	dataRowObj2.IsActive				= 1;
	

	var jsonData = {
		 "fields": dataRowObj
	};
	var jsonData2 = {
		"fields": dataRowObj2
	}
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/dbo/MatchupTables",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			
			$.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + listsDB + listEN + "create/dbo/MatchupTableElements",
				type: "POST",
				data: JSON.stringify(jsonData2),
				success: function(){
					ImportTableMerge();
				}
			});			
		}
	});
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





