/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/MENU/USERS_JS
	File Name:			toggle_user_config.js
=============================================================*/

//	Global object that allows quick access to the current users info.

var UserData = [];

//	Reads from cfg.Person and loads the logged in user's data into UserData.
function LoadUserInfo(person_guid) {
	var logged_in_user;

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/web/v_Person?where=\"PersonGUID = '"+ person_guid +"'\"", function( data ) {
		UserData = data;
		
		document.cookie = "PersonGUID=" + UserData[0].PersonGUID + "; path=/";
		
		(UserData.length != 1) ? SendToLogin("Invalid Credentials","There was an issue with the credentials that were entered.  Please contact your system administrator for more information.") : false;
	
		logged_in_user = languagePack.menu_index.welcome + " " + UserData[0].DisplayName + "!";
		$("#welcome_message").html(logged_in_user);
		GetMenuItems();
	});
}

function UpdateUserSettings() {
	var langValue = $("#modal_language_filter").val();
	var displayName = false;
	var oldPassword	= false;
	var newPassword	= false;
	var canProceed	= true;
	var functionCalled = false;
	
	($("#modal_display_name").val() != "")						? displayName = true : displayName = false;
	($("#modal_new_password").val() != "")						? newPassword = true : newPassword = false;
	($("#modal_old_password").val() == UserData[0].AppPassword)	? oldPassword = true : oldPassword = false;
	
	if(!displayName) {
		canProceed == false;
		DisplayAlert(languagePack.common.error, languagePack.message.displayName);	
	}
	console.log(oldPassword && newPassword);
	console.log($("#modal_new_password").val() == "" && $("#modal_old_password").val() == "");
	if(oldPassword && newPassword) {
		if(canProceed) {
			UpdateUserDetails();
			functionCalled = true;
		}
	}
	else if($("#modal_new_password").val() == "" && $("#modal_old_password").val() == "") {
		if(canProceed) {
			UpdateUserDisplayName();
			functionCalled = true;
		}
	}
	else {
		canProceed == false;
		DisplayAlert(languagePack.common.error, languagePack.message.oldPass);		
	}
	
	if(!functionCalled) {
		(canProceed ) ? UpdateLanguage(parseInt(langValue)) : false;
	}
}

function UpdateUserDetails() {
	var newDisplayName = $("#modal_display_name").val();
	var newPassword = $("#modal_new_password").val();

	var jsonData = {
		 "key": { "PersonGUID":UserData[0].PersonGUID },
		 "fields": { "AppPassword":newPassword, "DisplayName":newDisplayName, "Modified":moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + 'update/cfg/Person',
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function() {
			UpdateLanguage(parseInt($("#modal_language_filter").val()))
		}
	});
}

function UpdateUserDisplayName() {
	var newDisplayName = $("#modal_display_name").val();

	var jsonData2 = {
		 "key": { "PersonGUID":UserData[0].PersonGUID },
		 "fields": { "DisplayName":newDisplayName, "Modified":moment().format("YYYY-MM-DDTHH:mm:ss.000z") }
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + 'update/cfg/Person',
		type: "POST",
		data: JSON.stringify(jsonData2),
		success: function() {
			UpdateLanguage(parseInt($("#modal_language_filter").val()))
		}
	});
}

function UpdateLanguage(langValue) {
	switch(langValue) {
		case 1:
		default:
			document.cookie = "webLanguage=english; path=/";
		break;
			
		case 2:
			document.cookie = "webLanguage=spanish; path=/";
		break;
	}
	
	location.reload();
}









