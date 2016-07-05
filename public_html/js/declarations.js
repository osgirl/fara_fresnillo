/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/JS
	File Name:			declarations.js
=============================================================*/

//	Global Variables to store the url that communicates with the API.
//	These will be sent to the Web Console through cookies so they can be reused.
//	These need to be updated when accessing API's on different servers.

//var ruIP		= "https://dev.misom.com";
//var ruPort	= ":443/";

var ruIP		= "http://localhost";
var ruPort		= ":8080/";

var listsDB		= "misom_lists/";
var listEN		= "prod/";

var planningDB	= "misom_planning/";
var planningEN	= "prod/";

//	This get called as soon as the initial login page has finished loading.
$(document).ready(function () {
	
	//	We need to make sure that any cookies that are used throughout the web console
	//		are cleared out in order to prevent cross web page errors.
	
	EraseCookies();
	
	//	This will load the eula into the modal that displays it as a new user attempts to log-in.
	//	A call back is used to make sure all of the elements have been loaded before we attempt to access them.
	$("#modal-agreement .modal-content").load("./eula_spanish.html", function() {
		SetIndexLanguage();
	});
	
	$("#username").val(getQueryVariable("username"));
	$("#password").val(getQueryVariable("password"));
	$("#environment").material_select();
});

//	Is used from the browser page to enable MISOM users to automatically log-in.
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");

	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");

		if(pair[0] == variable){
			return pair[1];
		}
	}
	return("");
}

//	Sets the values of certain elements based on the language pack selected.
function SetIndexLanguage() {
	$(".lang-index.username").html(languagePack.index.username);
	$(".lang-index.password").html(languagePack.index.password);
	$(".lang-index.environment").html(languagePack.index.env);
	$(".lang-index.login").val(languagePack.index.login);
	$(".lang-index.version").html(languagePack.index.version);
	$(".lang-index.title").html(languagePack.index.title);
	$(".lang-index.okay").html(languagePack.index.okay);
	$(".lang-index.accept").html(languagePack.index.accept);
	$(".lang-index.contin").html(languagePack.index.contin);
}

function EraseCookies() {
	var cookies = document.cookie.split(";");
	
	for(var key in cookies) {
		SetCookieExpiration(cookies[key].split("=")[0], "", -1);
	}
}

function SetCookieExpiration(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";	
}









