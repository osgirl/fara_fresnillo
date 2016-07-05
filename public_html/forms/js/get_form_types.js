/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/FORMS/JS
	File Name:			get_form_types.js
=============================================================*/

var currentFormStyle		= "";
var bottomSheetDisplayed	= false;

$(document).ready(function() {
	$('.tooltipped').tooltip({delay: 50});
	LoadFormTabs("newForm");
});


function LoadFormTabs(activeList) {
	var formTabsArray	= [];
	
	formTabsArray.push({ "label" : "New Form",			"value" : "newForm",		"link" : "FormListSelected(this,'newForm')",		"active" : (activeList == "newForm") ? "active" : "" });
	formTabsArray.push({ "label" : "Saved Forms",		"value" : "savedForms",		"link" : "FormListSelected(this,'savedForms')",		"active" : (activeList == "savedForms") ? "active" : "" });
	formTabsArray.push({ "label" : "Submitted Forms",	"value" : "submittedForms",	"link" : "FormListSelected(this,'submittedForms')",	"active" : (activeList == "submittedForms") ? "active" : "" });
	
	LoadBottomSheet("Select a Form", formTabsArray, activeList);
}

function LoadBottomSheet(title, tabs, listType) {
	
	$("#modal-table .modal-header").html(title);
	$("#modal-table .modal-subcontent").html("");
	
	if(tabs.length > 0) {
		var navBar	=	$('<nav>' +
							'<div class="nav-wrapper grey darken-4 white-text">' +
								'<ul id="nav-bottomsheet">' +
								'</ul>' +
							'</div>' +
						'</nav>');

		$("#modal-table .modal-subcontent").append(navBar);
	}
	
	for(var key in tabs) {
		$("#modal-table #nav-bottomsheet").append($('<li class="'+tabs[key].active+'"><a style="cursor:pointer" onclick="'+tabs[key].link+'">'+tabs[key].label+'</a></li>'));		
	}
	
	switch(listType) {
		case "newForm":
		default:
			LoadTypes();
		break;
		
		case "savedForms":
			LoadSavedGrid();
		break
		
		case "submittedForms":
			LoadSubmittedGrid();
		break;
	}
}

function LoadTypes() {

	var formTypesArray	= [];

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Forms", function( data ) {
		
		for(var key in data) {
			var formTypeObj		= {};
			formTypeObj.label	= data[key].DisplayName;
			formTypeObj.value	= data[key].Desktop_URL_Alias;
			formTypesArray.push(formTypeObj);
		}
	
		$("#modal-table .modal-subcontent").append($('<table class="hoverable bordered striped highlight"></table>'));
		$("#modal-table table").html("");
		
		(formTypesArray.length > 0) ? $("#modal-table table").append($('<tr></tr>')) : false;
		
		for(var key in formTypesArray) {
			$("#modal-table table tr:last-child").append('<td style="cursor:pointer" onclick="NewFormSelected(\''+formTypesArray[key].label+'\',\''+formTypesArray[key].value+'\')">'+formTypesArray[key].label+'</td>');		
			(parseInt(key) < formTypesArray.length - 1) ? $("#modal-table table").append($('<tr></tr>')) : false;
		}
		
		(!bottomSheetDisplayed) ? DisplayBottomSheet() : false;		
	});
}

function FormListSelected(element, list) {
	var itemActive = $(element).parent().hasClass("active");
	
	(!itemActive) ? LoadFormTabs(list) : false;
}

function NewFormSelected(label, value) {
	documentGuid = "";
	documentNickName = "";
	signatureShowing = 0;
	imageAttachmentCount = 0;
	imageAttachments = [];
	formLocked = false;
	$("#modal-table").closeModal();
	bottomSheetDisplayed = false;
	LockForService("Loading...");
	LoadForm(value, null);	
}

function DisplayBottomSheet() {
	bottomSheetDisplayed = true;
	
	$("#modal-table").openModal({
		dismissible:	true,
		height:			600,
		ready:			function() { ServiceComplete(); },
		complete:		function() { bottomSheetDisplayed = false; }
	});
}









