/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			ZAC CARTER & AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/FORMS/JS
	File Name:			extract_inject.js
=============================================================*/

/*=======================================================================================
									GLOBAL SETTINGS
=======================================================================================*/

var appURL					= "";
var FormGUID				= "";
var _SiteGUID				= "";
var DocumentName			= "";
var DisplayName				= "";
var UserNameTS				= "";
var SubjectName				= "";
var ManagerName				= "";
var URL_Alias				= "";
var currentField			= "";
var waitForFinalLoadCount	= 0;
var finalLoadData			= [];
var initialLoadComplete     = false;
var finalLoadCalled			= false;
var imageAttachments		= [];
var imageAttachmentCount	= 0;
var signatureShowing		= 0;
var currentSignatureData	= {};
var callEnvironment			= "desktop";
var TabletUUID				= ""
var canDisableElements		= false;
var elementsDisabled		= false;
var desktopBtnDisplayClass	= "icon-visible";
var iosBtnDisplayClass		= "icon-hidden";


//App / Site META Data
var managerMetaData		= {};
var peopleMetaData		= {};
var mainOperator		= "";
var metaDataReceived	= false;

//URL DATA
var rootURL = "";

if(typeof ruIP === "undefined" || typeof ruPort === "undefined" || typeof listsDB === "undefined" || typeof listEN === "undefined") {
	
	if(typeof GetCookieValue == 'function') {
		rootURL = GetCookieValue("ruIP", "string") + GetCookieValue("ruPort", "string") + GetCookieValue("listsDB", "string") + GetCookieValue("listEN", "string");
	}
}
else {
	rootURL = ruIP + ruPort + listsDB + listEN;
}

//User Data
var userFirstName	= "";
var userLastName	= "";
var userSiteGUID	= "";
var userPersonGUID	= "";

if(typeof UserData === "undefined") {
	if(typeof GetCookieValue == 'function') {
		userFirstName	= GetCookieValue("userFirstName", "string");
		userLastName	= GetCookieValue("userLastName", "string");
		userSiteGUID	= GetCookieValue("userSiteGUID", "string");
		userPersonGUID	= GetCookieValue("userPersonGUID", "string");
	}
}
else {
	userFirstName	= UserData[0].Firstname;
	userLastName	= UserData[0].LastName;
	userSiteGUID	= UserData[0].SiteGUID;
	userPersonGUID	= UserData[0].PersonGUID;
}

//======================= END GLOBAL SETTINGS =========================



/*=======================================================================================
									DOCUMENT READY
=======================================================================================*/

$(document).ready(function() {
	
	$("[isSubject]").each(function() {
		$(this).val(SubjectName);
	});
});

//================================ END DOCUMENT READY ==================================



/*=======================================================================================
									EXTRACTOR
=======================================================================================*/

function extractData(documentGUID, creatorGUID, nickname, created, saved, locked, synced, islocked) {

	$.fn.hasAttr = function(attributeName) { 
		var attribVal = this.attr(attributeName); 
		return (attribVal !== undefined) && (attribVal !== false); 
	};
	
	//This is going to extract all of our data (also known as the Extractor)
	var extractedValues = [];
	
	var metaDataObj	= {};
	
	metaDataObj.DocumentGUID	= documentGUID;
	metaDataObj.CreatorGUID		= creatorGUID;
	metaDataObj.Nickname		= nickname;
	metaDataObj.CreatedDate		= created;
	metaDataObj.SavedDate		= saved;
	metaDataObj.LockedDate		= locked;
	metaDataObj.SyncedDate		= synced;
	metaDataObj.IsLocked		= islocked;
	metaDataObj.TabletUUID		= TabletUUID;
	
	extractedValues.push(metaDataObj);
	
	$("[elementType]").each(function() {
	
		//Textareas
		if($(this).attr("elementType") == "textarea") {
			var extractObject            = {};
			extractObject.type           = $(this).attr("elementType");
			extractObject.databaseColumn = $(this).attr("databaseColumn");
			extractObject.value          = $(this).val();
			extractObject.loadLast       = ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Textboxes
		if($(this).attr("elementType") == "textbox") {
			var extractObject				= {};
		    extractObject.type				= $(this).attr("elementType");
			extractObject.databaseColumn	= $(this).attr("databaseColumn");
			extractObject.value				= $(this).val();
			extractObject.executeFunction	= ($(this).hasAttr("executeFunction")) ? $(this).attr("executeFunction") : "";
			extractObject.loadLast			= ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Checkboxes
		if($(this).attr("elementType") == "checkbox") {
			var extractObject				= {};
		    extractObject.type				= $(this).attr("elementType");
			extractObject.databaseColumn	= $(this).attr("databaseColumn");
			extractObject.value				= $(this).is(":checked");
			extractObject.executeFunction	= ($(this).hasAttr("executeFunction")) ? $(this).attr("executeFunction") : "";
			extractObject.loadLast			= ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Date -- i.e. 12/20/1995 - Standard Date, no Time
		if($(this).attr("elementType") == "date") {
			var extractObject				= {};
		    extractObject._class			= $(this).attr("class");
		    extractObject.type				= $(this).attr("elementType");
			extractObject.databaseColumn	= $(this).attr("databaseColumn");
			extractObject.value				= $(this).val();
			extractObject.executeFunction	= ($(this).hasAttr("executeFunction")) ? $(this).attr("executeFunction") : "";
			extractObject.loadLast			= ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Radio Button Group
		if($(this).attr("elementType") == "radiogroup") {
			var extractObject				= {};
			extractObject.type				= $(this).attr("elementType");
			extractObject.databaseColumn	= $(this).attr("databaseColumn");
			extractObject.value				= $(this).val();
			extractObject.group				= $(this).attr("name");
			extractObject.uniqueRadioId		= $(this).attr("uniqueRadioId");
			extractObject.selected			= $(this).is(":checked");
			extractObject.executeFunction	= ($(this).hasAttr("executeFunction")) ? $(this).attr("executeFunction") : "";
			extractObject.loadLast			= ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Select Fields
		if($(this).attr("elementType") == "select") {
			var extractObject				= {};
			extractObject.type				= $(this).attr("elementType");
			extractObject.databaseColumn	= $(this).attr("databaseColumn");
			extractObject.txtvalue			= $(this).find("option:selected").text();
			extractObject.value				= $(this).val();
			extractObject.id				= $(this).attr("id");
			extractObject.executeFunction	= ($(this).hasAttr("executeFunction")) ? $(this).attr("executeFunction") : "";
			extractObject.loadLast			= ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//MultiSelect Fields
		if($(this).attr("elementType") == "multiSelectOption") {
			if($(this).attr("isselected") == "true") {
				var extractObject              = {};
				extractObject.type             = $(this).attr("elementType");
				extractObject.databaseColumn   = $(this).attr("databaseColumn");
				extractObject.multiSelectGroup = $(this).attr("multiSelectGroup");
				extractObject.value            = $(this).val();
				extractObject.loadLast         = ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
				
				extractedValues.push(extractObject);
			}			
		}
		//Span Fields
		if($(this).attr("elementType") == "span") {
			var extractObject            = {};
			
			extractObject.type				= $(this).attr("elementType");
			extractObject.databaseColumn	= $(this).attr("databaseColumn");
			extractObject.value				= $(this).html();
			extractObject.executeFunction	= ($(this).hasAttr("executeFunction")) ? $(this).attr("executeFunction") : "";
			extractObject.loadLast			= ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Labels
		if($(this).attr("elementType") == "label") {
			var extractObject            = {};
			
			extractObject.type				= $(this).attr("elementType");
			extractObject.databaseColumn	= $(this).attr("databaseColumn");
			extractObject.value				= $(this).html();
			extractObject.executeFunction	= ($(this).hasAttr("executeFunction")) ? $(this).attr("executeFunction") : "";
			extractObject.loadLast			= ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Gauges
		if($(this).attr("elementType") == "gauge") {
			var extractObject            = {};
			
			extractObject.type				= $(this).attr("elementType");
			extractObject.databaseColumn	= $(this).attr("databaseColumn");
			extractObject.value				= $(this).val();
			extractObject.loadLast			= ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
		//Sliders
		if($(this).attr("elementType") == "slider") {
			var extractObject            = {};
			
			extractObject.type				= $(this).attr("elementType");
			extractObject.databaseColumn	= $(this).attr("databaseColumn");
			extractObject.value				= $(this).val();
			extractObject.loadLast			= ($(this).hasAttr("loadLast")) ? $(this).attr("loadLast") : "false";
			
			extractedValues.push(extractObject);
		}
	});
	
	if(imageAttachmentCount > 0) {
		var imagesObject    = {};
		imagesObject.type   = "images";
		imagesObject.images = imageAttachments;
		extractedValues.push(imagesObject);
	}
	
	if(signatureShowing == 1) {
		var signatureObject           = {};
		signatureObject.type          = "signature";
		signatureObject.signatureData = currentSignatureData;
		extractedValues.push(signatureObject);
	}
	
	//We need to extract the subject and the manager
	//Ideally, this will only loop once, as we should only have one in each form, however if there are more, the last in putted will take precedence.
	$("[isSubject]").each(function() { SubjectName = $(this).val(); });
	
	$("[isManager]").each(function() { ManagerName = $(this).val(); });

	return JSON.stringify(extractedValues, null, 2);
}

//================================= END EXTRACTOR =======================================



/*=======================================================================================
									INJECTOR
=======================================================================================*/

function injectData(dataArr,sequence) {
	
	$.fn.hasAttr = function(attributeName) {
		var attribVal = this.attr(attributeName); 
		return (attribVal !== undefined) && (attribVal !== false); 
	};
	
	dataArr = decodeURIComponent(dataArr);
	dataArr = atob(dataArr);
	dataArr = JSON.parse(dataArr);

	var secondDataArr = new Array();
	
	(sequence != "final") ? waitForFinalLoadCount = 0 : false;

	for(var i = 0; i<dataArr.length; i++) {
		
		//Attachments
		if(dataArr[i].type == "images") {
			var formImages = dataArr[i].images;
			
			for(var key in formImages) {
				var constructObject        = {};
				
				var currentObject          = formImages[key];
				constructObject.User       = currentObject.User;
				constructObject.Lat        = currentObject.Lat;
				constructObject.Lon        = currentObject.Lon;
				constructObject.Field      = currentObject.Field;
				constructObject.Comment    = currentObject.Comment;
				constructObject.GUID       = currentObject.GUID;
				
				var ImageData              = currentObject.Image;
				
				attachPicture(encodeURIComponent(btoa(JSON.stringify(constructObject))), ImageData);				
			}
			
		}
		//Signature
		if(dataArr[i].type == "signature") {
			for(var key in dataArr[i].signatureData) {
				var currentSignature = dataArr[i].signatureData[key];
				attachSignature(key, currentSignature);
			}
		}
		
		//Textareas
		if(dataArr[i].type == "textarea") {
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			$(grabber).val(value);
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); } 
		}
		//Textboxes
		else if(dataArr[i].type == "textbox") {
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			$(grabber).val(value);

			//We need to check for custom functions.
			if(dataArr[i].executeFunction != "" && dataArr[i].executeFunction != undefined && sequence != "final") {
				
				var functionString = dataArr[i].executeFunction.split("(")[0];
				var functionVariable = dataArr[i].executeFunction.split("'")[1];

				(functionVariable) ? window[functionString](functionVariable) : window[functionString];
				
				waitForFinalLoadCount++;		

			}
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); }
		}
		//Checkboxes
		else if(dataArr[i].type == "checkbox") {
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			$(grabber).prop('checked', value);

			//We need to check for custom functions.
		    if(dataArr[i].executeFunction != "" && value && sequence != "final") {
				var functionString = dataArr[i].executeFunction;
				window[functionString]($(grabber));
			}
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); }
		}
		//Date -- i.e. 12/20/1995 - Standard Date, no Time
		else if(dataArr[i].type == "date") {
			//We need to check for custom functions.
		    if(dataArr[i].executeFunction != "" && value && sequence != "final") {
				var functionString = dataArr[i].executeFunction;
				window[functionString]($(grabber));
			}
			
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			$(grabber).val(value);
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); }
		}
		//Group of radio buttons
		else if(dataArr[i].type == "radiogroup") {
			var grabber  = "[uniqueRadioId=" + dataArr[i].uniqueRadioId + "]";
			var selected = dataArr[i].selected;
			$(grabber).prop('checked', selected);
			
			//We need to check for custom functions.
			if(dataArr[i].executeFunction != "" && selected && sequence != "final") {
				var functionString = dataArr[i].executeFunction;
				window[functionString]($(grabber));
			}
			
			(dataArr[i].loadLast == "true") ? secondDataArr.push(dataArr[i]) : false;
		}
		//Selects
		else if(dataArr[i].type == "select") {

			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;

			//We need to check for custom functions.
		    if(value && sequence != "final") {
				if(dataArr[i].executeFunction != "") {
					var functionString = dataArr[i].executeFunction.split("(")[0];
					var functionVariable = dataArr[i].executeFunction.split("'")[1];

					(functionVariable) ? window[functionString](functionVariable) : window[functionString];
					waitForFinalLoadCount++;
				}
			}
			
			if(sequence == "final" && dataArr[i].loadLast == "true") {
				$(grabber).val(value);
				
				($(grabber).val() == null) ? $(grabber).find("option:contains("+value+")").attr("selected","selected") : false;
			}
			else {
				$(grabber).val(value);
			}
			
			//$(grabber).material_select();
			
			(dataArr[i].loadLast == "true") ? secondDataArr.push(dataArr[i]) : false;
			
		}
		//Multi Selects
		else if(dataArr[i].type == "multiSelectOption") {
			var grabber = "[id=" + dataArr[i].multiSelectGroup + "]";
			var values = [];
			var keyArray = $(grabber).val();
			
			if($(grabber).val() != null) {
				for(var key in keyArray) {
					values.push(keyArray[key])
				}
				values.push($(grabber).val());
			}
			
			values.push(dataArr[i].value);
			$(grabber).val(values).trigger('chosen:updated');
			
			(dataArr[i].loadLast == "true") ? secondDataArr.push(dataArr[i]) : false;
		}
		//Span
		else if(dataArr[i].type == "span") {
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			
			//We need to check for custom functions.
		    if(dataArr[i].executeFunction != "" && value && sequence != "final") {
				var functionString = dataArr[i].executeFunction;
				window[functionString]($(grabber));
			}
			
			$(grabber).html(value);
			
			if(dataArr[i].loadLast == "true") { secondDataArr.push(dataArr[i]); }
		}
		//Label
		else if(dataArr[i].type == "label") {
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			
			//We need to check for custom functions.
		    if(dataArr[i].executeFunction != "" && value && sequence != "final") {
				var functionString = dataArr[i].executeFunction;
				window[functionString]($(grabber));
			}
			
			$(grabber).val(value);
			
			(dataArr[i].loadLast == "true") ? secondDataArr.push(dataArr[i]) : false;
		}
		//Gauge
		else if(dataArr[i].type == "gauge") {
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			$(grabber).val(value);
			
			(dataArr[i].loadLast == "true") ? secondDataArr.push(dataArr[i]) : false;
		}
		//Slider
		else if(dataArr[i].type == "gauge") {
			//Get the instance of the object so we can set a value.
			var grabber = "[databaseColumn=" + dataArr[i].databaseColumn + "]";
			var value   = dataArr[i].value;
			$(grabber).val(value);
			
			(dataArr[i].loadLast == "true") ? secondDataArr.push(dataArr[i]) : false;
		}
	}

	if(metaDataReceived && sequence != 'final') {//Pre-set drop down lists via meta data
		$("[populatePeople]").each(function() {
			waitForFinalLoadCount--;
			CheckLoadCount();
		});
	}
	
	secondDataArr = JSON.stringify(secondDataArr, null, 2);	
	finalLoadData = secondDataArr;
		
	$(".input-field input").each(function() {
		var element = $(this);
		(element.val()) ? element.next().addClass("active") : false;
	});
	
	$(".input-field select").each(function() {
		var element = $(this);
		(element.val()) ? element.next().addClass("active") : false;
	});
	
	$(".input-field textarea").each(function() {
		var element = $(this);
		(element.val()) ? element.next().addClass("active") : false;
	});

	if(sequence == "final") {
		finalLoadData		= [];
		initialLoadComplete = false;
		finalLoadCalled		= false;
		
		(callEnvironment == 'desktop') ? ServiceComplete() : false;
		(canDisableElements) ? disableElements() : false;
	}
	else if(initialLoadComplete == false){
		initialLoadComplete = true;
		CheckLoadCount();
	}
}

function CheckLoadCount() {
	if(initialLoadComplete) {
		if(!finalLoadCalled) {
			if(waitForFinalLoadCount <= 0) {
				finalLoadCalled = true;
				injectData(btoa(finalLoadData),"final");
			}
		}
	}
	else {
		(callEnvironment == 'desktop') ? ServiceComplete() : false;
	}
}

//================================= END INJECTOR =======================================



/*=======================================================================================
									UTILITIES
=======================================================================================*/

$(window).resize(function() {
    $("#form_container").css({
		"width": "100%"
    });
});
	 
$(window).resize();

var globalEval = function globalEval(src, element) {
	if (window.execScript) {
		window.execScript(src);
		return;
	}
	var fn = function(element) {
		window.eval.call(window,src);
	};
	fn(element);
};

function loadDefaultFields() {

	$(".autoDate").val(moment().format("YYYY-MM-DD"));
	$(".autoDate-edit").val(moment().format("YYYY-MM-DD"));
	
	$("#geoSpanCell").html('<span executeFunction="UpdateGeoCell" id="geo_location" databaseColumn="geoLocation" elementType="span"></span>');
	$("#signatureBox").html('Signatures need to be completed from an iOS device');

	if(callEnvironment == "desktop") {
		var callsMade = 0;
		
		$(".isUser").val(userFirstName + " " + userLastName);
		$(".isUser").attr("PersonGUID", userPersonGUID);
		
		if(typeof GetCookieValue == 'function') {
			var docGuid = GetCookieValue("documentGUID","string");
			getDocumentJSONData(docGuid);
		}
	
		$("[DropDownList]").each(function() {
			var element = $(this);
			var listName	= element.attr("DropDownList");
			var elementId	= element.attr("id");
			
			PopulateDropDownList(listName, elementId);
			callsMade++;
		});
	
		$("[VirtualList]").each(function() {
			var element = $(this);
			var listName	= element.attr("VirtualList");
			var elementId	= element.attr("id");
			
			PopulateVirtualList(listName, elementId);
			callsMade++;
		});
	
		$("[VirtualTable]").each(function() {
			var element		= $(this);
			var listName	= element.attr("VirtualTable").split(",")[0].trim();
			var columnName	= element.attr("VirtualTable").split(",")[1].trim();
			var elementId	= element.attr("id");

			PopulateVirtualList(listName, elementId, columnName);
			callsMade++;
		});
		
		(callsMade <= 0) ? ServiceComplete() : false;
	}
	else {
		$("[VirtualList]").each(function() {
			var objectToSend = {};
			
			objectToSend.Type = "Request";
			objectToSend.RequestType = "Virtual";
			
			var element		= $(this);

			var listName	= element.attr("VirtualList");
			var elementId	= element.attr("id");
			
			objectToSend.Data = { "list": listName, "elementID":elementId, "columnName":"NA", "filteredByColumn":"NA", "filterValue":"NA" };
			globalBridge.send(objectToSend);
		});
		
		$("[VirtualTable]").each(function() {
			var objectToSend = {};
			
			objectToSend.Type = "Request";
			objectToSend.RequestType = "Virtual";
			
			var element		= $(this);

			var listName	= element.attr("VirtualTable").split(",")[0].trim();
			var columnName	= element.attr("VirtualTable").split(",")[1].trim();
			var elementId	= element.attr("id");
			
			objectToSend.Data = { "list": listName, "elementID":elementId, "columnName":columnName, "filteredByColumn":"NA", "filterValue":"NA" };
			globalBridge.send(objectToSend);
		});
	}
	
	UpdateEnvironmentDefaults(callEnvironment);
}

function UpdateEnvironmentDefaults(env) {
	if(env == 'desktop') {
		desktopDisplayClass	= 'icon-visible';
		iosDisplayClass		= 'icon-hidden';
		
		$(".material-icons").removeClass("icon-hidden");
		$(".material-icons").addClass("icon-visible");
		$(".mobile-icons").removeClass("icon-visible");
		$(".mobile-icons").addClass("icon-hidden");
		
		$(".signatureBox").each(function() {
			var element = $(this);
			
			if(!(element.attr("sigLoaded"))) {
				element.html("Signatures need to be completed from an iOS device.");
			}
		});
	}
	if(env == 'ios') {
		desktopDisplayClass	= 'icon-hidden';
		iosDisplayClass		= 'icon-visible';
		
		$(".material-icons").removeClass("icon-visible");
		$(".material-icons").addClass("icon-hidden");
		$(".mobile-icons").removeClass("icon-hidden");
		$(".mobile-icons").addClass("icon-visible");
		
		$(".signatureBox").each(function() {
			var element = $(this);
			
			(!(element.attr("sigLoaded"))) ? element.html("Tap to sign.") : false;
		});
		
		$(".500023seal.desktop").hide();
		$(".500023seal.ios").show();
	}
}

function receivePostInformation(url, siteGUID, formGUID, displayname, username, url_alias, callEnv, tabletUUID) {
	appURL            = url;
	FormGUID          = formGUID;
	_SiteGUID         = siteGUID;
	DisplayName       = displayname;
	UserNameTS        = username;
	URL_Alias         = url_alias;
	callEnvironment   = callEnv;
	TabletUUID        = tabletUUID;
}

function receiveMetaData(metaDataObject) {
	metaDataObject		= decodeURIComponent(metaDataObject);
	metaDataObject		= atob(metaDataObject);
	metaDataObject		= JSON.parse(metaDataObject);
	metaDataReceived	= true;
	
    for(var key in metaDataObject) {
		if(key == "managers") {
			managerMetaData	= metaDataObject[key];
			peopleMetaData	= metaDataObject[key];
		}
		if(key == "operator") {
			mainOperator      = metaDataObject[key];
		}	 
    }
	 
	 //Pre-set drop down lists via meta data
	$("[populatePeople]").each(function() {
		var element = $(this);
		
		if(peopleMetaData.length > 0) {
			$(this).html('<option value="default">-- Choose --</option>');
		}
		for(var val in peopleMetaData) {
			var employeeName = peopleMetaData[val].employeeName + " " + peopleMetaData[val].employeeLastName;
			$(this).append(new Option(employeeName, peopleMetaData[val].id));
		}
		
		//element.material_select();
	});
	
	$("[isSubject]").each(function() {
		$(this).val(mainOperator);		
	});
	
	window.location = "ilod://true";
	
	//Get's called to handle any changes to the Form GUI based on the environment.
	//Will either be ios or desktop
	UpdateEnvironmentDefaults(callEnvironment);	
}

function clearAutoDate() {
	$('.autoDate').val("");
	$('.autoDate-edit').val("");
}

function resetElements() {
	$('input:radio[class*="formElement"]').prop('checked', false);
	
	$('input[class*="formElement"]').each(function() {	
		if($(this).attr("type") != "button" && $(this).attr("type") != "submit") {
			$(this).val("");
		}
	});
	
	(typeof RemoveAllRows == 'function') ? RemoveAllRows() : false;
	
	(typeof RemoveAllRowsFromTaskList == 'function') ? RemoveAllRowsFromTaskList() : false;
	
	$('textarea[class*="formElement"]').each(function() { $(this).val(""); });
	
	$('input:checkbox[class*="formElement"]').prop('checked', false);
	
	$('select[class*="formElement"]').val(0);
	$("button span").html("Select");
	
	$("[removeOnReset]").each(function() { $(this).remove(""); });
	
	$("[clearOnReset]").each(function() { $(this).html(""); });
	
	$("[isSubject]").each(function() { $(this).val(SubjectName); });
	
	$("#signature_container").html("");
	signatureShowing = 0;
	
	$("#picture_container").html("");
	imageAttachmentCount = 0;
	imageAttachments     = [];
	
	loadDefaultFields();
}

function enableElements() {
	elementsDisabled = false;
	$('.formElement').attr('disabled', false);
	$(".chosen").attr('disabled', false).trigger("chosen:updated");
	$(".autoDate").attr('disabled', true);
	$(".formButton").css({"display":"initial"});
	
	$(".signatureBox").each(function() {
		var element = $(this);
		element.attr("onclick",element.attr("cantclick"));
		element.removeAttr("cantclick");
		element.css({"cursor":"pointer", "position":"initial"});
		element.find(".sigCover").remove();
	});
	
	$(".initialsBox").each(function() {
		var element = $(this);
		element.attr("onclick",element.attr("cantclick"));
		element.removeAttr("cantclick");
		element.css({"cursor":"pointer", "position":"initial"});
		element.find(".sigCover").remove();
	});
}

function disableElements() {
	elementsDisabled = true;
	$('.formElement').attr('disabled', true);
	$('.activeButton').attr('disabled', false);
	$(".chosen").attr('disabled', true).trigger("chosen:updated");
	$(".formButton").css({"display":"none"});
	
	$(".signatureBox").each(function() {
		var element = $(this);
		element.attr("cantclick",element.attr("onclick"));
		element.removeAttr("onclick");
		element.css({"cursor":"default", "position":"relative"});
		element.append('<div class="sigCover" style="position:absolute; top:0px; left:0px; height:100%; width:100%; background-color:rgba(255,255,255,.5)"></div>');
	});

	$(".initialsBox").each(function() {
		var element = $(this);
		element.attr("cantclick",element.attr("onclick"));
		element.removeAttr("onclick");
		element.css({"cursor":"default", "position":"relative"});
		element.append('<div class="sigCover" style="position:absolute; top:0px; left:0px; height:100%; width:100%; background:none !important;"></div>');
	});
}

function SaveForm(creatorGUID, nickName, isLocked) {
	documentGuid = CreateGUID();
	postToDb(documentGuid, creatorGUID, nickName, isLocked);
}

function UpdateForm(docGUID, creatorGUID, nickn, isLocked) {
	documentGuid = docGUID;
	updateDb(documentGuid, creatorGUID, nickn, moment().format("YYYY-MM-DDTHH:mm:ss.000z"), isLocked);
}

function FriendlyPrintView(elementId) {
	
	$(".hideForPrint").each(function() {
		var element = $(this);
		
		element.hide();
	});
	
	$(".formElement").each(function() {
		var element		= $(this);
		var dontHide	= element.hasClass("dontHide");
		var dontPrint	= element.hasClass("dontPrint");
		var addHow		= "after";
		
		var elementMaskHtml = '';
		var elementValue;
		
		if(element.attr("elementType") == "textarea" && !dontPrint) {
			elementValue = element.val();
			elementMaskHtml += '<span>'+elementValue+'</span>';
		}
		
		//Textboxes
		if(element.attr("elementType") == "textbox" && !dontPrint) {
			elementValue = element.val();
			elementMaskHtml += '<span>'+elementValue+'</span>';
			
			(element.next().is('label')) ? element.next().addClass("active") : false;
		}
		
		//Checkboxes
		if(element.attr("elementType") == "checkbox" && !dontPrint) {
			var isChecked = element.is(":Checked");
			
			if(isChecked) {
				elementValue = "&#9745";
			}
			else {
				elementValue = "&#9744";
			}
			
			elementMaskHtml += '<span>'+elementValue+'</span>';		
		}
		
		//Date -- i.e. 12/20/1995 - Standard Date, no Time
		if(element.attr("elementType") == "date" && !dontPrint) {
			elementValue = element.val();
			elementMaskHtml += '<span>'+elementValue+'</span>';
		}
		
		//Radio Button Group
		if(element.attr("elementType") == "radiogroup" && !dontPrint) {
			var isChecked = element.is(":Checked");
			
			if(isChecked) {
				elementValue = "&#9899";
			}
			else {
				elementValue = "&#9898";
			}
			
			elementMaskHtml += '<span>'+elementValue+'</span>';
		}
		
		//Select Fields
		if(element.attr("elementType") == "select" && !dontPrint) {
			//elementValue = element.children("option:selected").text();
			//elementMaskHtml += '<span>'+elementValue+'</span>';
			//element.material_select('destory');
		}
		
		//Signatures
		if(element.attr("type") == "signature" && !dontPrint) {
			elementValue = $(this).html().split('<div')[0];
			elementMaskHtml += '<div>'+elementValue+'</div>';
		}
		
		//Initials
		if(element.find('div').attr('type') == "initials" && !dontPrint) {
			var img = $(this).find('img').attr('src');
			var src = "";

			if(img) {
				src += 'src="'+img+'"';
			}
			
			var width = $(this).find('img').attr('width');
			var height = $(this).find('img').attr('height');

			elementMaskHtml += '<div><img '+src+' width="'+width+'" height="'+height+'"></div>';
			addHow = "replace";
		}
		
		if(addHow == "after") {
			element.after(elementMaskHtml);
		}
		else if(addHow == "replace") {
			element.html(elementMaskHtml);
		}
		
		if(!dontHide) {
			element.hide();
		}
	});
	
	printData(elementId);
}

function printData(elementId) {
	var divToPrint = document.getElementById(elementId);
	newWin = window.open("");
	
	if(formForPrint == "500023") {
		newWin.document.write('<link href="../forms/css/print_500023.css" rel="stylesheet"/>');
	}
	else {
		newWin.document.write('<link href="../required_files/materialize/css/materialize.min.css" rel="stylesheet"/>');
		newWin.document.write('<script type="text/javascript" src="../required_files/materialize/js/materialize.min.js"></script>');		
	}
	newWin.document.write('<link href="../forms/css/main.css" rel="stylesheet"/>');
	
	newWin.document.write(divToPrint.outerHTML);
	
 	setTimeout(function() {
		newWin.print();
		newWin.close();
		CloseForm();
	}, 50);
}

//================================= END UTILITIES =======================================



/*=======================================================================================
									CRUD OPERATIONS
=======================================================================================*/

function postToDb(documentGUID, creatorGUID, nickname, lock) {
 
    try {	
		var urlConstruct3  = appURL + "read/forms/FormData?where=\"DocumentGUID = '"+ documentGUID +"'\"";
			
		$.getJSON( urlConstruct3, function( data ) {
			
			if(data.length <= 0) {
				created		= (created !=null)	? created	: created;
				saved		= (saved !=null)	? saved		: saved;
				locked		= (locked !=null)	? locked	: locked;
				synced		= (synced !=null)	? synced	: synced;
				
				var islocked	= (lock == "yes") ? true : false;
				
				var created	= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				var saved	= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				var locked	= null;
				var synced	= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				if(islocked) {
					locked = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				}
				
				var jsonData	= {};
				var formValues	= extractData(documentGUID, creatorGUID, nickname, created, saved, locked, synced, islocked);
				
				jsonData.fields   = {"DocumentGUID":documentGUID, "SiteGUID":_SiteGUID, "DocumentJSON":btoa(formValues), "FormGUID":FormGUID, "CreatorGUID":creatorGUID, "Desktop_URL_Alias":URL_Alias, "IsLocked":(islocked == "yes") ? "1" : "0", "Nickname":nickname, "TabletUUID":TabletUUID, "DateCreated":created, "DateSaved":saved, "DateLocked":locked, "DateSynced":synced };

				var urlConstruct = appURL + "create/forms/FormData";
				
				$.ajax({
					url : urlConstruct,
					type: "POST",
					data : JSON.stringify(jsonData),
					contentType: "application/json",
					success: function(data, textStatus, jqXHR) {
						DisplayAlert("Success!","Form Successfully Saved");
						(callEnvironment == "ios") ? window.location = "isyn://yes" : false;
					},
					error: function (jqXHR, textStatus, errorThrown) {
						(callEnvironment == "ios") ? window.location = "isyn://no" : false;
						DisplayAlert("Success!","Form has been saved locally.");
					}
				});
			}
			else {
				DisplayAlert("Error","Duplicate forms exist. Please contact support with reference x219");
			}		
		});	
	}
	catch(err) {
		DisplayAlert("Error",err);
	}
}

function updateDb(documentGUID, creatorGUID, nickname, lock) {
	
	/*
		The API currently does not allow submitting updated records without the RecordGroupGUID. We
		can get this by grabbing the DocumentGUID. If we get more than one object back, we will send an alert,
		saying duplicate documents were sent in, and a new one needs to be created and MISOM Technical Support
		needs to be contacted. Ideally, this will never happen, but I suppose it's a one in a million trillion billion quadrillion chance.
	*/
	
	try {		
		var urlConstruct  = appURL + "read/forms/FormData?where=\"DocumentGUID = '"+ documentGUID +"'\"";
		
		$.getJSON( urlConstruct, function( data ) {
			
			if(data.length > 0) {
				var returnedObject	= data[0];
				var TableRecordGUID	= returnedObject.TableRecordGUID;
				var isLocked		= (lock == "yes") ? true : false;
				
				var created	= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				var saved	= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				var locked	= null;
				var synced	= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				
				if(data[0].DateCreated) {
					created = moment(data[0].DateCreated).format("YYYY-MM-DDTHH:mm:ss.000z");
				}
				
				if(isLocked) {
					locked = moment(data[0].DateLocked).format("YYYY-MM-DDTHH:mm:ss.000z");
				}
				
				var jsonData	= {};
				var formValues	= extractData(documentGUID, creatorGUID, nickname, created, saved, locked, synced, lock, tabletUUID);
				
				jsonData.key      = {"DocumentGUID":documentGUID};
				jsonData.fields   = {"IsLocked": isLocked, "DocumentJSON":btoa(formValues), "DateSaved": saved, "DateLocked": locked, "DateSynced": synced };
				var urlConstruct3 = appURL + "update/forms/FormData";
				
				$.ajax({
					url : urlConstruct3,
					type: "POST",
					data : JSON.stringify(jsonData),
					contentType: "application/json",
					success: function(data, textStatus, jqXHR) {
						if(lock == "yes")
							DisplayAlert("Success!","Form Successfully Submitted & Locked");
						else
							DisplayAlert("Success!","Form Successfully Saved");
						
						if(callEnvironment == "ios" && lock == "yes")
							window.location = "lwss://yes"; //lwss - Lock was sent successfully
					},
					error: function (jqXHR, textStatus, errorThrown) {
						DisplayAlert("Success!","Form has been saved locally.");
						if(callEnvironment == "ios" && lock == "yes")
							window.location = "lwss://no"; 
					}
				});
			}
			else {
				postToDb(documentGUID, creatorGUID, nickname, lock);
			}			
		});
	}
	catch(err) {
		DisplayAlert("Error!","This document cannot be submitted. Please contact support. Reference: x492");
	}	
}

function getDocumentJSONData(docGuid) {
	var jqxhrDocumentData = $.getJSON(rootURL + "read/forms/FormData?where=\"DocumentGUID='" + docGuid + "'\"", function() {
		var documentData      = jQuery.parseJSON(jqxhrDocumentData.responseText);

		if(documentData.length > 0) {
			var jsonStringEncoded = documentData[0].DocumentJSON;
			var encodedData       = encodeURIComponent(jsonStringEncoded);
			
			setTimeout(function() {
				injectData(encodedData,"initial");
			}, 1500);
		}
	});
}

function PopulateVirtualList(listName, elementId, colName, filter) {
	
	var columnName			= listName;
	var filteredByColumn	= "";
	var parentElementId		= $("#"+elementId).attr("ParentId");
	var parentElement		= $("#"+parentElementId);
	var parentElementVal	= parentElement.find("option:selected").text();
	
	if(colName) {
		columnName = colName;
	}
	if(filter) {
		filteredByColumn = " AND " + filter + " = '"+parentElementVal+ "'";
	}
	
	var jqxhrListData = $.getJSON(rootURL + "read/virtual/"+ userSiteGUID +"/"+ listName + "?where=\"1 = 1 "+filteredByColumn+" ORDER BY '"+ columnName +"'\"", function() {
		var listData = jQuery.parseJSON(jqxhrListData.responseText);
		
		var elementSelect = document.getElementById(elementId);
		
		if(elementSelect) {
			//elementSelect.innerHTML  = "<option value='0'>-- Choose -- </option>";
			elementSelect.innerHTML  = "";

			for(var key in listData) {
				elementSelect.options[elementSelect.options.length] = new Option(listData[key][columnName], listData[key].TableRecordGUID);
			}
		}
		$("#"+elementId).val();
		//$("#"+elementId).material_select();
		
		waitForFinalLoadCount--;
		CheckLoadCount();
	});
}

function PopulateDropDownList(listName, elementId, colName, filter) {
	var columnName			= listName;
	var filteredByColumn	= "";
	var parentElementId		= $("#"+elementId).attr("ParentId");
	var parentElement		= $("#"+parentElementId);
	var parentElementVal	= parentElement.find("option:selected").text();
	if(colName) {
		columnName = colName;
	}
	if(filter && filter.toUpperCase() != 'NA') {
		filteredByColumn = " AND " + filter + " = '"+parentElementVal+ "'";
	}
	
	if(listName == "Person") {
		$.getJSON(rootURL + "read/cfg/Person?where=\"SiteGUID = '"+ userSiteGUID +"'"+filteredByColumn+" ORDER BY 'DisplayName'\"", function( data ) {
			
			var elementSelect = document.getElementById(elementId);
			
			if(elementSelect) {
				elementSelect.innerHTML  = "<option value='0'>-- Choose -- </option>";
				elementSelect.innerHTML  = "";

				for(var key in data) {
					elementSelect.options[elementSelect.options.length] = new Option(data[key].DisplayName, data[key].PersonGUID);
				}
			}
		
			//$("#"+elementId).material_select();
			
			waitForFinalLoadCount--;
			CheckLoadCount();
		});
	}	
}

function receiveVirtualTable(tableDataObj) {
	var listName		= tableDataObj.tableName;
	var elementId		= tableDataObj.elementID;
	var columnName		= listName;
	var elementSelect	= document.getElementById(elementId);
	
	if(tableDataObj.columnName) {
		columnName = tableDataObj.columnName
	}
	
	if(elementSelect) {

		elementSelect.innerHTML  = "<option value='0'>-- Choose -- </option>";

		for(var key in tableDataObj.dataSet) {
			elementSelect.options[elementSelect.options.length] = new Option(tableDataObj.dataSet[key][columnName], tableDataObj.dataSet[key].TableRecordGUID);
		}
	}

	//$("#"+elementId).material_select();

	waitForFinalLoadCount--;
	CheckLoadCount();
}

function receiveTable(tableDataObj) {
	var listName		= tableDataObj.tableName;
	var elementId		= tableDataObj.elementID;
	var elementSelect	= document.getElementById(elementId);
	 
	if(elementSelect) {

		elementSelect.innerHTML  = "<option value='0'>-- Choose -- </option>";

		if(lisName == "Person") {
			for(var key in tableDataObj.dataSet) {
				elementSelect.options[elementSelect.options.length] = new Option(tableDataObj.dataSet[key].DisplayName, tableDataObj.dataSet[key].PersonGUID);
			}
		}
	}
	
	//$("#"+elementId).material_select();
	
	waitForFinalLoadCount--;
	CheckLoadCount();
}

function SendDropDownInfo(listName, elementId, colName, filter) {
	
	var element				= $("#"+elementId);
	var columnName			= "NA";
	var filteredByColumn	= "NA";
	var parentElementId		= $("#"+elementId).attr("ParentId");
	var parentElement		= $("#"+parentElementId);
	var parentElementVal	= "NA";
	
	
	if(colName) {
		columnName = colName;
	}
	if(filter) {
		filteredByColumn	= filter;
		parentElementVal	= parentElement.find("option:selected").text();
	}
	
	if(callEnvironment == 'desktop') {
		if(columnName == "NA") {
			columnName = "";
		}
		if(filteredByColumn == "NA") {
			filteredByColumn	= "";
		}
		
		if(element.attr("VirtualList") || element.attr("VirtualTable")) {
			PopulateVirtualList(listName, elementId, columnName, filteredByColumn);
		}
		else if(element.attr("DropDownList")) {
			PopulateDropDownList(listName, elementId, columnName, filteredByColumn);
		}
	}
	else {
		var objectToSend = {};
		
		objectToSend.Type			= "Request";
		objectToSend.RequestType	= "Virtual";
		
		objectToSend.Data = { "list": listName, "elementID":elementId, "columnName":columnName, "filteredByColumn":filteredByColumn, "filterValue":parentElementVal };
		globalBridge.send(objectToSend);
	}
}

//============================== END CRUD OPERATIONS ====================================



/*=======================================================================================
									FORM ADD ONS
=======================================================================================*/

function attachSignature(databaseColumn, signatureData) {
	try {
		
		signatureData                        = decodeURIComponent(signatureData);
		currentSignatureData[databaseColumn] = signatureData;
		signatureShowing = 1;
		
		//We need to get the actual instance of the element via the databaseColumn.
		var key = "[databaseColumn=" + databaseColumn + "]";
		var dbColumnInstance;
		
		$(key).each(function() {
			dbColumnInstance = $(this);
		});
	
		$(dbColumnInstance).html("");
		
		var height   = $(dbColumnInstance).attr("picheight");
		var width    = $(dbColumnInstance).attr("picwidth");
		
		//var newImage = '<img src="data:image/png;base64,' + signatureData + '" id="' + 'img' + databaseColumn + '" width="'+width+'" height="'+height+'" style="margin-top:15px;" removeOnReset="true" />';
		
		var imageOffsetKey = "#img" + databaseColumn;
		
		$(dbColumnInstance).css("background","url(data:image/png;base64,"+signatureData+") no-repeat center");
		$(dbColumnInstance).css("background-size", "contain");
		$(dbColumnInstance).attr("sigLoaded", "true");
		$(dbColumnInstance).attr("removeOnReset", "true");
	}
	catch(err) { DisplayAlert("Error",err); }
}

function UpdateGeoLocation(location) {
	UpdateGeoLabel();
	UpdateGeoCell(location);
}

function UpdateGeoLabel() {	
	$("#geoLabelCell").html("");
	
	$("#geoLabelCell").append('<label databaseColumn="geoLocLabel" elementType="label" executeFunction="UpdateGeoLabel" id="geo_location_label" style="display:inline-block">GEO Location:</label>');
}

function UpdateGeoCell(location) {	
	$("#geo_location").html(location);
}

function ResetGeoLocation() {
	$("#geoLabelCell").html("");
	$("#geoSpanCell").html("");
}

function attachPicture(tagDetails, imageData) {
	try {
	tagDetails = decodeURIComponent(tagDetails);
	tagDetails = atob(tagDetails);
	tagDetails = JSON.parse(tagDetails);
	
	imageData  = decodeURIComponent(imageData);

	//Inject the first styling of the pictures
	if(imageAttachmentCount == 0) {
		var picContainer   = document.getElementById("picture_container");
		var pictureTitle   = document.createElement('div');
		pictureTitle.style.borderBottom = "2px solid #919191";
		pictureTitle.style.textAlign    = "left";
		pictureTitle.style.height       = "40px";
		pictureTitle.style.marginTop    = "10px";
		pictureTitle.style.fontsize     = "20px";
		pictureTitle.id                 = "pictitle";
		pictureTitle.style.fontweight   = "bold";
		pictureTitle.style.width        = "100%";
		pictureTitle.innerHTML = "Picture Attachments";
		picContainer.appendChild(pictureTitle);
	}
	
	var marginL	= (imageAttachments.length == 0) ? 0 : 15;

	//Add the attachment to the image attachment.
	var attachment	= {};
	
	var id               = tagDetails.GUID;
	attachment.ImageGUID = id;
	attachment.User      = tagDetails.User;
	attachment.Lat       = tagDetails.Lat;
	attachment.Lon       = tagDetails.Lon;
	attachment.Field     = currentField;
	attachment.Image     = imageData;
    attachment.Comment   = tagDetails.Comment;
	
	imageAttachments.push(attachment);	
	
	var currentLength = imageAttachments.length-1;
	
	var newImage = '<img src="data:image/png;base64,' + imageData + '" onclick="showImage(\'' + currentLength + '\')" id="pic_' + currentLength + '" width="150" style="border-radius:15px; margin-left:' + marginL + 'px; margin-top:15px;" />';
	$("#picture_container").append(newImage);
	
	imageAttachmentCount++;
	
	}
	catch(err) { DisplayAlert("Success!",err); }
}

function showImage(pictureID) {
	var imageContainer                   = document.createElement("div");
	imageContainer.style.width           = "100%";
	imageContainer.style.height          = "100%";
	imageContainer.style.position        = "fixed";
	imageContainer.id  				     = "pic_container";
	imageContainer.style.zIndex          = "500000";
	imageContainer.style.backgroundColor = "#000000";
	imageContainer.style.top             = "0";
	imageContainer.style.left            = "0";
	imageContainer.style.opacity         = "1.0";
	document.body.appendChild(imageContainer);
	
	//Let's grab the base 64 image data.
	var imageData = imageAttachments[pictureID].Image;
	var comments  = imageAttachments[pictureID].Comment;
	if(comments == "")
		comments = "No Comments Entered.";
	
	var newImage  = '<table align="center" border="0" cellspacing="2" width="95%" height="95%" style="box-shadow:none">' +
						'<tr height="70%">' +
							'<td align="center" width="100%" colspan="2" bgcolor="#000000">' +
								'<img src="data:image/png;base64,' + imageData + '" style="margin-top:45px; height:450px; width:450px;" />' +
							'</td>' +
						'</tr>' +
						'<tr height="20%">' +
							'<td align="right" width="25%" bgcolor="#000000"><font color="#FFFFFF" size="2" face="Arial">Comments:</font></td>' +
							'<td align="left" width="75%" bgcolor="#000000">&nbsp;&nbsp;<font color="#CCCCCC" size="2" face="Arial"> ' + comments + '</font></td>' + 
						'</tr>' + 
						'<tr height="10%">' +
							'<td align="center" colspan="2" width="100%" bgcolor="#000000">' +
								'<div style="width:45%; text-align:center; height:50px; line-height:50px; background-color:#fc9817; color:#FFFFFF; font-size:13px; float:left; margin-left:3%; margin-top:25px;" onclick="removePicture(\''+ pictureID +'\');">Remove</div>' +
								'<div style="line-height:50px; margin-top:25px; width:45%; margin-left:5%; text-align:center; height:50px; float:left; background-color:#fc9817; color:#FFFFFF; font-size:13px;" onclick="cancelPicture()">Done</div>' +
							'</td>' +
						'</tr>' +
					'</table>';
	
	$("#pic_container").append(newImage);
}

function removePicture(pictureID) {
	imageAttachmentCount--;
	
	var picID = "#pic_" + pictureID;
	$(picID).remove("");
	$("#pic_container").remove("");
	
	delete imageAttachments[pictureID];
	
	if(imageAttachmentCount == 0)
		$("#pictitle").remove("");
}

function cancelPicture() {
	$("#pic_container").remove("");
}

function callInitials(DatabaseColumn) {
	if(callEnvironment == "desktop") {
		DisplayAlert('Alert','Initials must be completed from an iOS device.');
	}
	else {
		window.location = "isig://" + DatabaseColumn; 
	}
}

function callSignature(DatabaseColumn) {
	if(callEnvironment == "desktop") {
		DisplayAlert('Alert','Signatures must be completed from an iOS device.');
	}
	else {
		window.location = "ssig://" + DatabaseColumn;
	}
}

//============================== END FORM ADD ONS ====================================

function ResetSelect() {
		
	$(".input-field select").each(function() {
		var element = $(this);
		//element.material_select();
	});
}

function ToggleTheme() {}















