/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/JS
	File Name:			submit_login.js
=============================================================*/

//	We initially need to get a list of Users from the server so that we can validate the login credentials.
var personData;
var agreementAccepted;
var personGUID;

var jqxhrPerson = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/cfg/Person", function() {	  	
	personData = jQuery.parseJSON(jqxhrPerson.responseText);  		
});

//	This get called as soon as the initial login page has finished loading.
$(document).ready(function () {
	
	//	We check for the 'enter' key press to allow for easy login.
	$(document).keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);		
		(keycode == '13') ? $("#login-button").click(): false; 
	});
	
	
	$("#username").on("keypress", function() {
		$(this).removeClass('invalid');
		$("#password").removeClass('invalid');
	});
	
	$("#password").on("keypress", function() {
		$(this).removeClass('invalid');
		$("#username").removeClass('invalid');
	});
	
	
	//	Here we wil validate the login.
	//	On a succesful attempt, we check to see if the EULA has been accepted or not
	//		display it to the user if not, and then send them to the Web Console.
	$("#login-button").on("click", function() {
		if(ValidateLogin()) {
			(agreementAccepted == 0) ? DisplayUserAgreement() : EnterEnvironment();
		}
		else {
			$("#username").addClass('invalid');
			$("#password").addClass('invalid');
		}
	});
	
	//	We need to use a timeout in order to ensure that the EULA has loaded completely.
	setTimeout(function() {		
		$("#agreement-cb").on("change", function() {
			if($(this).prop('checked')) {
				$("#agreement-btn").addClass('modal-action modal-close waves-effect waves-green');
				$("#agreement-btn").removeClass('disabled');
			}
			else {
				$("#agreement-btn").removeClass('modal-action modal-close waves-effect waves-green');
				$("#agreement-btn").addClass('disabled');
			}
		});
		
		$("#agreement-btn").on("click", function() {
			PushLicenseAcceptance();
		});
		
		$("#cancel-btn").on("click", function() {
			$("#agreement-cb").prop('checked', false);
			$("#agreement-cb").change();
		});		
	}, 3000);	
});

//	Compares the users credentials with what is in the DB.
function ValidateLogin() {
	var userName = $("#username").val();
	var userPass = $("#password").val();
	var isValid = false;
	
	for(var key in personData) {
		if(userName == personData[key].AppUserName && userPass == personData[key].AppPassword) {
			isValid = true;
			agreementAccepted = personData[key].IsLicenseAccepted;
			personGUID = personData[key].PersonGUID;
		}
	}
	return isValid;
}

//	Updates a flag in the cfg.Person table when the user accepts the EULA.
function PushLicenseAcceptance() {
	var personObj = {};
	personObj["IsLicenseAccepted"] = 1;
	
	var jsonData = {
		"key": { "PersonGUID":personGUID },
		"fields": personObj
	};
	
	jQuery.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + 'update/cfg/Person',
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			EnterEnvironment();
		}
	});
}

//	Once all validations have passed, the user can now enter the Web Console.
//	At this time we set our cookie values to be used once the user has entered.
function EnterEnvironment() {
	
	var env = $("#environment").val();
	document.cookie = "PersonGUID="	+ personGUID + "; path=/";

	switch(env) {
		case "console":
		default:
			document.cookie = "ruIP="		+ ruIP			+ "; path=/";
			document.cookie = "ruPort="		+ ruPort		+ "; path=/";
			document.cookie = "listEN="		+ listEN		+ "; path=/";
			document.cookie = "listsDB="	+ listsDB		+ "; path=/";
			document.cookie = "planningEN=" + planningEN	+ "; path=/";
			document.cookie = "planningDB=" + planningDB	+ "; path=/";
			document.cookie = "currentPage=home; path=/";
			document.cookie = "planningCurrentPage=planning; path=/";
			document.cookie = "webLanguage=spanish; path=/";
			
			window.location.replace("./menu");
		break;
		
		case "planning":
			document.cookie = "ruIP="		+ ruIP			+ "; path=/";
			document.cookie = "ruPort="		+ ruPort		+ "; path=/";
			document.cookie = "listEN="		+ listEN		+ "; path=/";
			document.cookie = "listsDB="	+ listsDB		+ "; path=/";
			document.cookie = "planningEN=" + planningEN	+ "; path=/";
			document.cookie = "planningDB=" + planningDB	+ "; path=/";
			document.cookie = "currentPage=home; path=/";
			document.cookie = "planningCurrentPage=planning; path=/";			
			document.cookie = "webLanguage=spanish; path=/";
			
			window.location.replace(ruIP + ruPort + "planning/menu");
		break;
		
		case "bi":
			window.location.replace(ruIP + ruPort + "fresnillo_bi/");
		break;
	}
}









