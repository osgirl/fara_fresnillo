/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			generate_dynamic_table.js
 =============================================================*/

var loadedScripts	= 0;
var canUpload		= true;
var canReset		= true;
var canDelete		= true;
var globalBridge;
var formStructureGUIDGlobal = "";

//======================= WEB GAP =====================================

function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    }
    else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
                                  callback(WebViewJavascriptBridge)
                                  }, false)
    }
}

connectWebViewJavascriptBridge(function(bridge) {
                               
	bridge.init(function(message, responseCallback) {});

	globalBridge = bridge;

	bridge.registerHandler("receiveVirtualTable", function(data) {
		receiveVirtualTable(data);
	});

	bridge.registerHandler("displayForm", function(data) {
		displayForm(data);
	});

	bridge.registerHandler("populateForm", function(data) {
		populateForm(data);
	});

	bridge.registerHandler("populateDropDownControl", function(data) {
		var dataObj = data.dataSet;
		var column = data.columnName;

		populateDropDownControl(dataObj, column);
	});
});

//======================= END WEB GAP =====================================

function SendTestData() {
    var data = [{"TableRecordGUID":"02D161B4-9A69-4D6F-AC17-9251E6A690D9","ControlVariable1":"Header Text","ControlVariable2":null,"ControlVariable3":null,"CreatedByGUID":null,"ElementControlType":"header","FormStructureElementGUID":"3197DD38-BA3C-451F-B1BD-C775F53FC71F","FormStructureElementName":"Header5","FormStructureGUID":"20337641-DC8A-4FC9-B886-EB7E3623ABAB","Ordinal":"4"},{"TableRecordGUID":"19DAFCB2-2AE8-461F-A24C-37073B13E4CF","ControlVariable1":"What is your name?","ControlVariable2":null,"ControlVariable3":null,"CreatedByGUID":null,"ElementControlType":"textfield","FormStructureElementGUID":"6FB8F72F-F4AD-4207-86C1-37AF04D550DC","FormStructureElementName":"Question_2","FormStructureGUID":"00784521-4026-4D8D-BB04-1BCAA98D3D6F","Ordinal":"3"},{"TableRecordGUID":"2D270956-26F4-4BC3-845C-EE3AE24AC183","ControlVariable1":"00C7FE5B-F0BE-4318-A397-E68E0CE5AF15","ControlVariable2":null,"ControlVariable3":null,"CreatedByGUID":null,"ElementControlType":"ddl","FormStructureElementGUID":"9741A04B-F367-4608-885C-B01F95A22990","FormStructureElementName":"Column_3","FormStructureGUID":"20337641-DC8A-4FC9-B886-EB7E3623ABAB","Ordinal":"3"},{"TableRecordGUID":"67781727-FF71-457E-9948-3F8A4718B00B","ControlVariable1":"What is your favorite color?","ControlVariable2":null,"ControlVariable3":null,"CreatedByGUID":null,"ElementControlType":"textfield","FormStructureElementGUID":"ABA46B09-0F20-46A6-A54F-A5B6E9F38465","FormStructureElementName":"Question_1","FormStructureGUID":"00784521-4026-4D8D-BB04-1BCAA98D3D6F","Ordinal":"2"},{"TableRecordGUID":"70FD3E23-5B29-4B7C-8723-27E8605DB643","ControlVariable1":null,"ControlVariable2":null,"ControlVariable3":null,"CreatedByGUID":null,"ElementControlType":"textfield","FormStructureElementGUID":"6C14BFDF-9C99-4256-B072-DF799D5BCCF7","FormStructureElementName":"Question1","FormStructureGUID":"20337641-DC8A-4FC9-B886-EB7E3623ABAB","Ordinal":"1"},{"TableRecordGUID":"CA9950B6-7515-4BEE-BD56-16C149BFCB04","ControlVariable1":null,"ControlVariable2":null,"ControlVariable3":null,"CreatedByGUID":null,"ElementControlType":"textfield","FormStructureElementGUID":"2D4C599A-F87C-474B-B506-4B83494153FB","FormStructureElementName":"Question2","FormStructureGUID":"20337641-DC8A-4FC9-B886-EB7E3623ABAB","Ordinal":"2"},{"TableRecordGUID":"EFC4FBDA-14A6-4B3F-9D75-3AFE61E24B5A","ControlVariable1":"Form Number 1","ControlVariable2":null,"ControlVariable3":null,"CreatedByGUID":null,"ElementControlType":"header","FormStructureElementGUID":"2273078E-C043-49A0-97C0-7E66CEAA3E0D","FormStructureElementName":"Form1","FormStructureGUID":"00784521-4026-4D8D-BB04-1BCAA98D3D6F","Ordinal":"1"}];
    
    displayForm(data);
}

function displayForm(data) {
    
    var formHTML	= "";
    var columnArray = [];
    var tableArea	= $("#generated_form");
    
    tableArea.html("");
    formHTML		+= '<div class="row"><form class="col s12">';
    
    for(var key in data) {
        var currentObject		= data[key];
        var columnArrayInfo		= {};        
        var controlVariables	= [];
		
        controlVariables.push(currentObject.ControlVariable1);
        controlVariables.push(currentObject.ControlVariable2);
        controlVariables.push(currentObject.ControlVariable3);
        controlVariables.push(currentObject.ControlVariable4);
        controlVariables.push(currentObject.ControlVariable5);
        controlVariables.push(currentObject.ControlVariable6);
        
        formHTML += generateControl(currentObject.FormStructureElementName, currentObject.ElementControlType, controlVariables);
        
        formStructureGUIDGlobal     = currentObject.FormStructureGUID;
        
        columnArrayInfo.type		= currentObject.ElementControlType;
        columnArrayInfo.columnName	= currentObject.FormStructureElementName;
        columnArrayInfo.key			= currentObject.FormStructureElementName;
        columnArrayInfo.tblRecord	= currentObject.TableRecordGUID;
        
        if(controlVariables[0]) {
            columnArrayInfo.key = controlVariables[0];
        }
        
        columnArray.push(columnArrayInfo);
    }
    
    formHTML	+= '</form></div>';
    
    formHTML	+= '<div id="table_record_button_container" style="text-align:center">'
					+ '<div class=" waves-effect waves-light btn yellow darken-3 white-text center" id="table_record_add_button">Submit</div>'
				+ '</div>';
    
    tableArea.append(formHTML);
    
	$(".generatedSelect").each(function() {
		var element					= $(this);
		var matchupTableGuid		= element.attr("MatchupTableGUID");
		var matchupTableElementGuid	= element.attr("MatchupTableElementGUID");
		var columnName				= element.attr("id");
		element.material_select();
		
		if(matchupTableElementGuid) {
			SendDropDownInfo(matchupTableGuid, matchupTableElementGuid, columnName);
		}
		else {
			SendDropDownInfo(matchupTableGuid, columnName);
		}
	});

	$("#table_record_add_button").on('click', function() {
		if(canUpload) {
			SubmitRecord(columnArray);
		}
	});
}

function populateForm(data) {
	
	for(var key in data) {
		var el				= data[key].elementId;
		var element			= $(el);
		var elementName		= data[key].columnName;
		var elementControl	= data[key].columnType;
		var value			= data[key].value;
		
		if(elementControl == 'textfield' || elementControl == 'textarea' || elementControl == 'date' || elementControl == 'guid') {
			
			element.val(value);
			element.next().addClass("active");
		}
		else if(elementControl == 'ddl' || elementControl == 'table') {
			element.val(value);
			element.material_select('destroy');
			element.material_select();
		}
		else if(elementControl == 'checkbox' || elementControl == 'switch') {
			element.prop('checked', (value == 1));
		}
		else if(elementControl == 'datetime') {
			element.val(value);
		}
		else if(elementControl == 'date') {
		}
	}
}

function SubmitRecord(data) {
    var dataArray = [];
	
    for(var key in data) {
        var dataObj = {};
       
        var columnName		= data[key].columnName;
        var tableRecord		= data[key].tblRecord;
        var columnType		= data[key].type;
        var columnID		= "#" + data[key].columnName;
        
        dataObj.key			= tableRecord;
        dataObj.columnName	= columnName;
        dataObj.columnType	= columnType;
        dataObj.elementId	= columnID;
        dataObj.value		= getColumnValue(columnID, columnType);
        dataObj.FormStructureGUID = formStructureGUIDGlobal;
		
        if(columnType != "header") {
            dataArray.push(dataObj);
        }
    }
    
    SendFormData(dataArray);
}

function getColumnValue(columnID, columnType) {
    switch(columnType) {
        case 'checkbox':
        case 'switch':
            return $(columnID).is(":checked").toString();
           break;
            
        case 'ddl':
		case 'table':
            return $(columnID).find("option:selected").text();
           break;
            
        default:
            return ($(columnID).val() != "") ? $(columnID).val() : null;
    }
}

function generateControl(columnName, type, variables) {
	var displayText = columnName;

	if(variables[0]) {
		displayText = variables[0];
	}

	switch(type) {
		case "header":

			var headerHTML	= '<div class="row">'
								+ '<div class="col l12 s12">'
									+ '<h4 class="center-align white-text">'+displayText+'</h4>'
								+ '</div>'
							+ '</div>';

			return headerHTML;
			
		break;

		case 'ddl':

			var listOfListsGUID		= variables[0];

			var dropDownListHTML	= '<div class="input-field col l6 s12">'
										+ '<select MatchupTableGUID="'+listOfListsGUID+'" class="generatedSelect white-text" id="' + columnName + '"><option>Select an option</option></select>'
										+ '<label for="' + columnName + '">' + columnName + '</label>'
									+ '</div>';

			return dropDownListHTML;

		break;

		case 'table':

			var matchupTableGUID		= variables[0];
			var matchupTableElementGUID	= variables[1];

			var dropDownListHTML	= '<div class="input-field col l6 s12">'
										+ '<select MatchupTableGUID="'+matchupTableGUID+'" MatchupTableElementGUID="'+matchupTableElementGUID+'" class="generatedSelect white-text" id="' + columnName + '"><option>Select an option</option></select>'
										+ '<label for="' + columnName + '">' + columnName + '</label>'
									+ '</div>';

			return dropDownListHTML;

		break;

		case 'textarea':

			//A simple textarea does not have any variables at this time. So we are simply going generate the HTML for a new textarea.
			var textAreaHTML	= '<div class="input-field col l6 s12">'
			+ '<textarea class="materialize-textarea white-text" id="' + columnName + '"></textarea>'
			+ '<label class="active" for="' + columnName + '">' + displayText + '</label>'
			+ '</div>';

			return textAreaHTML;

		break;

		case 'textfield':

			//A simple textfield does not have any variables at this time. So we are simply going to generate the HTML for a new textField.
			var textFieldHTML	= '<div class="input-field col l6 s12">'
			+ '<input class="white-text" type="text" id="' + columnName + '">'
			+ '<label class="active" for="' + columnName + '">' + displayText + '</label>'
			+ '</div>';

			return textFieldHTML;

		break;

		case 'checkbox':
			//A checkbox does not have any variables either at this time. Let's generate the HTML for a simple checkbox.
			var checkboxHTML	= '<div class="input-field col l6 s12">'
			+ '<input class="white-text" type="checkbox" id="' + columnName + '">'
			+ '<label class="active" for="' + columnName + '">' + displayText + '</label>'
			+ '</div>';

			return checkboxHTML;

		break;

		case 'switch':
			//A checkbox does not have any variables either at this time. Let's generate the HTML for a simple checkbox.
			var switchHTML	= '<div>'
			+ '<label>'+columnName+'</label>'
			+ '<div class="switch" col l6 s12">'
			+ '<label>Off'
			+ '<input type="checkbox" id="' + columnName + '">'
			+ '<span class="lever"></span>'
			+ '<label>On</label>'
			+ '</div>'
			+ '</div>';

			return switchHTML;

		break;
				
	}

	return 'No Control Found for Type ' + type;
}

function SendFormData(dataArray) {
    var objectToSend = {};
    
    objectToSend.Type			= "Request";
    objectToSend.RequestType	= "SendPointDetails";
    
    objectToSend.Data = dataArray;
    globalBridge.send(objectToSend);
}

function SendDropDownInfo(matchupTableGuid, tableElement, columnName) {
    var objectToSend = {};
    
	if(tableElement) {
		objectToSend.Type			= "Request";
		objectToSend.RequestType	= "StructTable";
		
		objectToSend.Data = { "tableGUID": matchupTableGuid, "tableElement": tableElement, "columnName":columnName };
		globalBridge.send(objectToSend);
	}
	else {
		objectToSend.Type			= "Request";
		objectToSend.RequestType	= "StructList";
		
		objectToSend.Data = { "listGUID": matchupTableGuid, "columnName":columnName };
		globalBridge.send(objectToSend);		
	}
}


function populateDropDownControl(data, columnName) {
    
    $('#'+columnName).html("<option value='default'>-- Choose --</option>");
    var dropDownList = document.getElementById(columnName);
    
    for(var key in data) {
        dropDownList.options[dropDownList.options.length] = new Option(data[key].RecordValue, data[key].RecordGroupGUID);
    }
    
    $('#'+columnName).material_select();
}









