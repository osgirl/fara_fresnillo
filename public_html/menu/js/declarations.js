/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/HOME/JS
	File Name:			declarations.js
=============================================================*/

var ruIP;
var ruPort;
var listsDB;
var listEN;
var planningDB;
var planningEN;

//	This get called as soon as the current page has finished loading.
$(document).ready(function () {
	ruIP		= GetCookieValue("ruIP",	"string");
	ruPort		= GetCookieValue("ruPort",	"string");
	listsDB		= GetCookieValue("listsDB",	"string");
	listEN		= GetCookieValue("listEN",	"string");
	planningDB	= GetCookieValue("planningDB",	"string");
	planningEN	= GetCookieValue("planningEN",	"string");
	$("#modal_language_filter").material_select();

	//document.cookie = "planning_initialFilters=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
	
	//	Loads the language pack that is selected and stores the value in a cookie.
	if(GetCookieValue("webLanguage", "string") == "spanish") {
		moment.locale('es');
		loadjscssfile("../required_files/scripts/language_pack_spanish.js", "js");
		$("#language_filter").val(2);
		language_GF = "Spanish";
	}
	else if(GetCookieValue("webLanguage", "string") == "english") {
		moment.locale('en');
		loadjscssfile("../required_files/scripts/language_pack_english.js", "js");	
		$("#language_filter").val(1);
		language_GF = "English";
	}
	else if(GetCookieValue("webLanguage", "string") == 0){
		moment.locale('en');
		loadjscssfile("../required_files/scripts/language_pack_english.js", "js");	
		$("#language_filter").val(1);
		language_GF = "English";
	}
	
	setTimeout(function() {
		SetMenuIndexLanguage();
	}, 1500);
});

//	Sets the values of certain elements based on the language pack selected
function SetMenuIndexLanguage() {
	$(".lang-menu-index.title").html(languagePack.menu_index.title);
	$(".lang-menu-index.globalFilters").html(languagePack.menu_index.globalFilters);
	$(".lang-menu-index.beginDate").html(languagePack.menu_index.beginDate);
	$(".lang-menu-index.endDate").html(languagePack.menu_index.endDate);
	$(".lang-menu-index.area").html(languagePack.menu_index.area);
	$(".lang-menu-index.zone").html(languagePack.menu_index.zone);
	$(".lang-menu-index.applyFilters").html(languagePack.menu_index.applyFilters);
	$(".lang-menu-index.okay").html(languagePack.menu_index.okay);
	$(".lang-menu-index.yes").html(languagePack.menu_index.yes);
	$(".lang-menu-index.no").html(languagePack.menu_index.no);
	$(".lang-menu-index.displayName").html(languagePack.menu_index.displayName);
	$(".lang-menu-index.oldPass").html(languagePack.menu_index.oldPass);
	$(".lang-menu-index.newPass").html(languagePack.menu_index.newPass);
	$(".lang-menu-index.language").html(languagePack.menu_index.language);
	$(".lang-menu-index.listsConfig").html(languagePack.menu_index.listsConfig);
	$(".lang-menu-index.addList").html(languagePack.menu_index.addList);
	$(".lang-menu-index.lockList").html(languagePack.menu_index.lockList);
	$(".lang-menu-index.removeList").html(languagePack.menu_index.removeList);
	$(".lang-menu-index.addListItem").html(languagePack.menu_index.addListItem);
	$(".lang-menu-index.removeListItem").html(languagePack.menu_index.removeListItem);
	$(".lang-menu-index.loadingSystemTables").html(languagePack.menu_index.loadingSystemTables);
	$(".lang-menu-index.sitesConfig").html(languagePack.menu_index.sitesConfig);
	$(".lang-menu-index.createSite").html(languagePack.menu_index.createSite);
	$(".lang-menu-index.siteName").html(languagePack.menu_index.siteName);
	$(".lang-menu-index.firstName").html(languagePack.menu_index.firstName);
	$(".lang-menu-index.lastName").html(languagePack.menu_index.lastName);
	$(".lang-menu-index.email").html(languagePack.menu_index.email);
	$(".lang-menu-index.createdSiteDesc").html(languagePack.menu_index.createdSiteDesc);
	$(".lang-menu-index.addSite").html(languagePack.menu_index.addSite);
	
	$(".lang-common.configuration").html(languagePack.common.configuration);
	$(".lang-common.selectOption").html(languagePack.common.selectOption);
	$(".lang-common.updateButton").html(languagePack.common.update);	

	(document.cookie == "") ? LogOut() : LoadUserInfo(GetCookieValue("PersonGUID",	"string"));
}









