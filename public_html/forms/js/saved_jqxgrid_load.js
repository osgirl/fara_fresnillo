/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/FORMS/JS
	File Name:			saved_jqxgrid_load.js
=============================================================*/

var documentGuid = "";
var documentNickName = "";
var currentDoc = [];

function LoadSavedGrid() {
	
	var dataFieldsArray = [];
	
	var jqxhrFormData = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/forms/FormData?where=\"IsLocked='0' AND SiteGUID = '"+UserData[0].SiteGUID+"' ORDER BY CreatorGUID, FormGUID, DateCreated DESC\"", function() {
		var formData = jQuery.parseJSON(jqxhrFormData.responseText);
		
		var jqxhrPersonData = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/cfg/Person?where=\"SiteGUID = '"+UserData[0].SiteGUID+"'\"", function() {
			var personData = jQuery.parseJSON(jqxhrPersonData.responseText);
			
			var jqxhrForms = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/Forms", function() {
				var forms = jQuery.parseJSON(jqxhrForms.responseText);
				
				for(var k1 in formData) {
					var docObj = {};
					
					docObj.DocumentGUID	= formData[k1].DocumentGUID;
					docObj.FormGUID		= formData[k1].FormGUID;
					docObj.CreatorGUID	= formData[k1].CreatorGUID;
					docObj.Nickname		= formData[k1].Nickname;
					docObj.DateCreated	= formData[k1].DateCreated;
					docObj.DateLocked	= formData[k1].DateLocked;
					docObj.DateSaved	= formData[k1].DateSaved;
					docObj.DateSynced	= formData[k1].DateSynced;
					
					for(var k2 in personData) {
						if(formData[k1].CreatorGUID == personData[k2].PersonGUID) {
							docObj.Creator = personData[k2].Firstname + " " + personData[k2].LastName;
						}
					}
					
					for(var k3 in forms) {
						if(formData[k1].FormGUID == forms[k3].FormGUID) {
							docObj.FormType = forms[k3].DisplayName;
						}
					}
					
					dataFieldsArray.push(docObj);
				}
				GenerateSavedGrid(dataFieldsArray);
			});
		});
	});
}

function GenerateSavedGrid(dataFieldsArray) {
	
	($("#saved_jqxgrid").length != 0)  ? $('#saved_jqxgrid').jqxGrid('destroy') : false;	
	$("#modal-table .modal-subcontent").append("<div id='saved_jqxgrid'></div>");
	
	var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
		var createdTime = new Date(value);
		var localTime   = createdTime.getTime();
		
		var localOffset = createdTime.getTimezoneOffset() * 60000;
		createdTime     = localTime + localOffset;
		createdTime     = new Date(createdTime);
		
		//Nov 21, 2014 15:34
		var month   = createdTime.getMonth();
		var day     = createdTime.getDate();
		var year    = createdTime.getFullYear();
		var hours   = createdTime.getHours();
		var minutes = createdTime.getMinutes();
		
		if(hours < 10)
			hours = "0" + hours;
		if(minutes < 10)
			minutes = "0" + minutes;
		
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		createdTime    =  "<div style='margin-top:5px'>&nbsp;" + monthNames[month] + " " + day + ", " + year + " " + hours + ":" + minutes + "</div>"; 
		
		return createdTime;
	}
	
	var source = {
		localdata: dataFieldsArray,
		datatype: "array",
		datafields:
		[
			{ name: 'DocumentGUID',			type: 'string' },
			{ name: 'FormGUID',				type: 'string' },
			{ name: 'CreatorGUID',			type: 'string' },
			{ name: 'Desktop_URL_Alias',	type: 'string' },
			{ name: "FormType",				type: "string" },
			{ name: "Nickname",				type: "string" },
			{ name: "Creator",				type: "string" },
			{ name: "DateCreated",			type: "string" },
			{ name: "DateSaved",			type: "string" },
			{ name: "DateSynced",			type: "string" },
			{ name: "IsLocked",				type: "bool" }
		]
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	var formatTime = function(row, columnfield, value, defaulthtml, columnproperties) {		
		if(value) {
			var tempDateTime = value.split(".")[0];
			var dateTimeArray = tempDateTime.split("T");
			
			var tempDate =  dateTimeArray[0];
			var tempTime =  dateTimeArray[1];
			
			var timeArray = tempTime.split(":");
			var tempHour = timeArray[0];
			var tempMinute = timeArray[1];
			
			var dateTimePeriod = "AM";
			
			if(tempHour == 0) {
				tempHour = 12;
				dateTimePeriod = "AM";			
			}		
			else if(tempHour > 12) {
				tempHour = tempHour - 12;
				
				if(tempHour < 10) {
					tempHour = "0" + tempHour;
				}
				dateTimePeriod = "PM";
			}
			else if(tempHour == 12) {
				dateTimePeriod = "PM";
			}
			
			var newDateTime = "  " + tempDate + " " + tempHour + ":" + tempMinute + " " + dateTimePeriod;
			
			var newHtml = defaulthtml.split(value);
			
			return newHtml[0] + newDateTime + newHtml[1];
		}
		else {
			return "";
		}
	}
	
	$("#saved_jqxgrid").jqxGrid({
		width: '100%',
		height: "374px",
		source: dataAdapter,
		filterable: true,
		sortable: true,
		autoshowfiltericon: true,
		columnsresize: true,
		columnsreorder: true,
		groupable: true,
		enabletooltips: true,
		columns: [
		  { text: 'DocumentGUID',		datafield: 'DocumentGUID',		hidden: true },
		  { text: 'FormGUID',			datafield: 'FormGUID',			hidden: true },
		  { text: 'CreatorGUID',		datafield: 'CreatorGUID',		hidden: true },
		  { text: 'Desktop_URL_Alias',	datafield: 'Desktop_URL_Alias',	hidden: true },
		  { text: 'FormType',			datafield: 'FormType',			hidden: false },
		  { text: 'Nickname',			datafield: 'Nickname',			hidden: false },
		  { text: 'Creator',			datafield: 'Creator',			hidden: false },
		  { text: 'DateCreated',		datafield: 'DateCreated',		hidden: false, cellsrenderer: formatTime },
		  { text: 'DateSaved',			datafield: 'DateSaved',			hidden: false, cellsrenderer: formatTime },
		  { text: 'DateSynced',			datafield: 'DateSynced',		hidden: false, cellsrenderer: formatTime },
		  { text: 'IsLocked',			datafield: 'IsLocked',			hidden: true }
		]
	});
				
	$('#saved_jqxgrid').on('rowselect', function (event) {
		// event arguments.
		var args = event.args;
		// row's bound index.
		var rowBoundIndex = args.rowindex;
		// row's data. The row's data object or null(when all rows are being selected or unselected with a single action). If you have a datafield called "firstName", to access the row's firstName, use var firstName = rowData.firstName;
		var rowData = args.row;
		resetElements();
		documentGuid = rowData.DocumentGUID;
		documentNickName = rowData.Nickname;
		
		formLocked = false;
		signatureShowing = 0;
		imageAttachmentCount = 0;
		imageAttachments = [];
		
		
		var jqxhrFormListData = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/forms/FormData?where=\"DocumentGUID='" + documentGuid + "'\"", function() {
			
			var savedFormData     = jQuery.parseJSON(jqxhrFormListData.responseText);			
			var jsonStringEncoded = savedFormData[0].DocumentJSON;
			var encodedData       = encodeURIComponent(jsonStringEncoded);
				
			var docObj = {};
			
			docObj.alias	= savedFormData[0].Desktop_URL_Alias;
			docObj.data		= encodedData;
			currentDoc.push(docObj);
			
			$("#modal-table").closeModal();
			
			bottomSheetDisplayed	= false;
			
			LockForService("Loading...");
			LoadForm(savedFormData[0].Desktop_URL_Alias, encodedData);
		});
	});
}