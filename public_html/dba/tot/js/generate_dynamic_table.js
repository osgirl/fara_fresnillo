/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			generate_dynamic_table.js
=============================================================*/

var loadedScripts	= 0;
var canReset		= true;
var canDelete		= true;

function loadForm(siteId, tableName) {
	//Step 1: Grab the table GUID based on the table name.
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"SiteGUID = '" + siteId + "' AND MatchupTableName = '" + tableName + "' AND IsActive = '1'\"", function( data ) {
	     if(data.length < 1) {
	     	DisplayAlert("Alert!",'Unable to find table named: ' + tableName + '');
	     }
	     else {
	     	var tableGUID = data[0].MatchupTableGUID;
			
			if(data[0].IsReferenceTable) {
				canUpload		= false;
				canReset		= false;
				canDelete		= false;
			}
			else {
				canUpload		= true;
				canReset		= true;
				canDelete		= true;
			}
			
	     	loadSchema(siteId, tableGUID, tableName, data[0].IsReferenceTable, data[0].MustMaterialize, data[0].TargetSchema, data[0].TargetTable, data[0].TargetDB, data[0].MatchupTableGUID);
	     }	          
	});
}


function loadSchema(siteId, tableGUID, tableName, isRef, mustMaterialize, targetSchema, targetTable, targetDB, targetTableGUID) {

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"SiteGUID = '" + siteId + "' AND MatchupTableGUID = '" + tableGUID + "' AND IsActive = '1' ORDER BY Ordinal ASC\"", function( data ) {
	     if(data.length < 1) {
	     	DisplayAlert("Alert!",'Unable to find schema for table named: ' + tableName + '');
			$("#table_structure_header_tab1").click();
	     }
	     else {
	     	displayForm(data, tableName, siteId, isRef, mustMaterialize, targetSchema, targetTable, targetDB, targetTableGUID);
			GetTableStructure(isRef);
	     }	     
	});
}

function displayForm(data, tableName, siteId, isRef, mustMaterialize, targetSchema, targetTable, targetDB, targetTableGUID) {

	var formHTML	= "";
	var columnArray = [];
	var tableArea	= $("#generatedForm");
	
	tableArea.html("");
	formHTML		+= '<div class="row"><form class="col s12">';

	for(var key in data) {

		var currentObject	= data[key];
		var columnArrayInfo = {};
		
		var controlVariables = [];
		controlVariables.push(currentObject.ControlVariable1);
		controlVariables.push(currentObject.ControlVariable2);
		controlVariables.push(currentObject.ControlVariable3);
		controlVariables.push(currentObject.ControlVariable4);
		controlVariables.push(currentObject.ControlVariable5);
		controlVariables.push(currentObject.ControlVariable6);
		
		formHTML += generateControl(currentObject.MatchupTableElementName, currentObject.ElementControlType, controlVariables);
		
		if(currentObject.ElementControlType == "query") {
			formHTML += generateControl(currentObject.MatchupTableElementName, "writeTo", controlVariables);
		}
		
		columnArrayInfo.type				= currentObject.ElementControlType;
		columnArrayInfo.columnName			= currentObject.MatchupTableElementName;
		columnArray.push(columnArrayInfo);
	}
	
	formHTML += '</form></div>';
	
	if(isRef) {
		formHTML	+= '<div id="table_record_button_container" style="display:none">'
					+ '<div style="margin-right:8px" id="table_record_add_button" class="recordsBtn waves-effect waves-light btn indigo lighten-2"><i class="material-icons">backup</i></div>'
					+ '<div style="margin-right:8px" id="table_record_reset_button" class="recordsBtn waves-effect waves-light btn orange"><i class="material-icons">replay</i></div>'
					+ '<div style="margin-right:8px" id="table_record_remove_button" class="recordsBtn waves-effect waves-light btn red right"><i class="material-icons">delete</i></div>'
					+ '</div>';
	}
	else {
		formHTML	+= '<div id="table_record_button_container">'
					+ '<div style="margin-right:8px" id="table_record_add_button" class="recordsBtn waves-effect waves-light btn indigo lighten-2"><i class="material-icons">backup</i></div>'
					+ '<div style="margin-right:8px" id="table_record_reset_button" class="recordsBtn waves-effect waves-light btn orange"><i class="material-icons">replay</i></div>'
					+ '<div style="margin-right:8px" id="table_record_remove_button" class="recordsBtn waves-effect waves-light btn red right"><i class="material-icons">delete</i></div>'
					+ '</div>';
	}
	
	tableArea.append(formHTML);
	
	$(".generatedSelect").each(function() {
		var element			= $(this);
		var listOfListsGUID	= element.attr("MatchupTableGUID");
		var columnName		= element.attr("id");
		
		populateDropDownControl(listOfListsGUID, columnName);
	});
	
	$(".generatedRefSelect").each(function() {
		var element				= $(this);
		var matchupTableGUID	= element.attr("MatchupTableGUID");
		var columnName			= element.attr("id");
		
		populateRefDropDown(matchupTableGUID, columnName, controlVariables);
	});
	
	$("#table_record_add_button").on('click', function() {
		if(canUpload) {
			var autoColumns = "";
			
			$(".autoField").each(function(index) {
				autoColumns += "._." + $(this).attr("id");
				autoColumns += "..." + $(this).attr("Increment");
			});
			
			SubmitRecord(siteId, tableName, columnArray, autoColumns, controlVariables, mustMaterialize, targetSchema, targetTable, targetDB, targetTableGUID);
		}
	});
	
	$("#table_record_reset_button").on('click', function() {
		if(canReset) {
			$(".headerTitle").html("Create Record");
			$("#table_record_remove_button").addClass("disabled");
			ResetRecordForm(columnArray);
		}
	});
	
	$("#table_record_remove_button").on('click', function() {
		if(canDelete) {
			if($('#jqxgrid2').jqxGrid('getselectedrowindex') != -1) {
				RemoveRecord(siteId, tableName, columnArray);
			}
		}
	});
}

function SubmitRecord(siteId, tableName, data, autoColumns, controlVariables, mustMaterialize, targetSchema, targetTable, targetDB, targetTableGUID) {

 	var mainDictionary = {};
	var fieldsDictionary = {};
	var tblName = tableName;
	
	tblName += autoColumns;
	
	if(RecordGUID == "") {
		
		mainDictionary   = {};
		fieldsDictionary = {};
		
		//Now let's loop through all of the column names and grab the values and prepare a submit string to the database.
		for(var key in data) {
			var columnName               = data[key].columnName;
			var columnType               = data[key].type;
			var columnID                 = "#" + data[key].columnName;
			
			fieldsDictionary[columnName] = getColumnValue(columnName, columnType, controlVariables);
		}
		
		fieldsDictionary.IsActive = 1;
		fieldsDictionary.Created  = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		fieldsDictionary.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	 
		mainDictionary.fields = fieldsDictionary;

 		$.ajax({
		  type: "POST",
		  contentType: 'application/json',
		  url: ruIP + ruPort + listsDB + listEN + 'create/virtual/' + siteId + '/' + tblName,
		  data: JSON.stringify(mainDictionary),
		  complete: function(jqXHR, textStatus) {
				DisplayAlert("Alert!",'Record successfully entered');
				ResetRecordForm(data);
				LoadCreateRecordsHTML();
				(mustMaterialize) ? MaterializeTable(tableName, targetSchema, targetTable, targetDB, targetTableGUID) : false;
		  },
		  dataType: 'json'
		});
	}
	else {
		
		mainDictionary   = {};
		fieldsDictionary = {};
		
		//Now let's loop through all of the column names and grab the values and prepare a submit string to the database.
		for(var key in data) {
			var columnName               = data[key].columnName;
			var columnType               = data[key].type;
			var columnID                 = "#" + data[key].columnName;
			
			fieldsDictionary[columnName] = getColumnValue(columnName, columnType, controlVariables);
		}
		
		fieldsDictionary.Modified = moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	 
		mainDictionary.fields = fieldsDictionary;
		
		mainDictionary.key = {"TableRecordGUID":RecordGUID};
		
 		$.ajax({
		  type: "POST",
		  contentType: 'application/json',
		  url: ruIP + ruPort + listsDB + listEN + 'update/virtual/' + siteId + '/' + tblName,
		  data: JSON.stringify(mainDictionary),
		  complete: function(jqXHR, textStatus) {
			if(textStatus == "success")
				DisplayAlert("Alert!",'Record successfully updated');
			else
				DisplayAlert("Alert!",'Unable to insert record.');
			
			ResetRecordForm(data);
			(mustMaterialize) ? MaterializeTable(tableName, targetSchema, targetTable, targetDB, targetTableGUID) : false;
		  },
		  dataType: 'json'
		});	
	}
}

function MaterializeTable(tableName, targetSchema, targetTable, targetDB, targetTableGUID) {
	
	var inputParams  = [];
	
	var param1 = {"paramName":"TableGUID",			"paramType":"varchar", "paramValue":targetTableGUID};
	var param2 = {"paramName":"TargetTableName",	"paramType":"varchar", "paramValue":targetTable};
	var param3 = {"paramName":"TableSchema",		"paramType":"varchar", "paramValue":targetSchema};
	var param4 = {"paramName":"TargetDB",			"paramType":"varchar", "paramValue":targetDB};
	
	inputParams.push(param1);
	inputParams.push(param2);
	inputParams.push(param3);
	inputParams.push(param4);
	
	var inputParamsContainer         = {};
	inputParamsContainer.inputParams = inputParams;
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + 'exec/procedureold/dbo.TOT_DROP_CREATE_TARGET_DB',
		type: "POST",
		data: JSON.stringify(inputParamsContainer),
		success: function(data) {
		}
	});
}

function ResetRecordForm(data) {
	
	//Now let's loop through all of the column names and grab the values and prepare a submit string to the database.
	for(var key in data) {
		var columnName               = data[key].columnName;
		var columnType               = data[key].type;
		var columnID                 = "#" + data[key].columnName;
		
		if(columnType == 'textfield' || columnType == 'textarea' || columnType == 'date' || columnType == 'datetime' ) {
			$(columnID).val("");
		}
		if(columnType == 'auto') {
			$(columnID).val("");
		}
		if(columnType == 'guid') {
			$(columnID).val(CreateGUID());
		}
		if(columnType == 'checkbox') {
			$(columnID).prop('checked', false);
		}
		if(columnType == 'ddl') {
			$(columnID).val('null');
		}
		if(columnType == 'table' || columnType == 'ref') {
			var jqButton = columnID + "ddbutton";
			$(jqButton).find("#dropDownButtonContent" + columnID + 'ddbutton').html("<div></div>");
		}
	}

	RecordGUID = "";
	//$('#jqxgrid2').jqxGrid('clearselection');
	var tableId = $('#matchup_table_tree').jqxTree('getSelectedItem').id;
	$("#matchup_table_tree").jqxTree('selectItem', null);
	$('#matchup_table_tree').jqxTree('selectItem', $('#'+tableId)[0]);
}

function RemoveRecord(siteId, tableName, data) {
	var mainDictionary   = {};
	var fieldsDictionary = {};
	
	fieldsDictionary.IsActive = 0;
 
	mainDictionary.fields = fieldsDictionary;
	
	mainDictionary.key = {"RecordGroupGUID":RecordGUID}
	
	$.ajax({
	  type: "POST",
	  contentType: 'application/json',
	  url: ruIP + ruPort + listsDB + listEN + "update/dbo/MatchupTableRecords",
	  data: JSON.stringify(mainDictionary),
	  complete: function(jqXHR, textStatus) {
		if(textStatus == "success")
			DisplayAlert("Alert!",'Record successfully updated');
		else
			DisplayAlert("Alert!",'Unable to insert record.');
		
		$("#jqxgrid2").jqxGrid('refreshdata');
		$("#jqxgrid2").jqxGrid('updatebounddata');
		ResetRecordForm(data);
	  },
	  dataType: 'json'
	});
}

function getColumnValue(columnName, columnType, controlVariables) {
	switch(columnType) {
		case 'checkbox':
		case 'switch':
			return $("#"+columnName).is(":checked").toString();
		break;
		
		case 'ddl':
		case 'ref2':
			if($("#"+columnName).val() == 'null') {
				return '';
			}
			else {
				return $("#"+columnName).find("option:selected").text();
			}
		break;
		
		case 'table':		
		case 'ref':
			var RecordGUID = $("#"+columnName+"ddbutton").find("#dropDownButtonContent"+columnName+"ddbutton div").html();
			return RecordGUID;
		break;
		
		default:
			return ($("#"+columnName).val() != "") ? $("#"+columnName).val() : null;
	}
}

$.expr[':'].icontains = $.expr.createPseudo(function(text) {
    return function(e) {
        return $(e).text().toUpperCase().indexOf(text.toUpperCase()) >= 0;
    };
});

function filterCurrentDropDown(element) {
	var ddID		= element.attr("filterList");
	var filterValue	= element.val();
	
	$("#" + ddID).prev().find('li').css({"display":"inherit"});
	$("#" + ddID).prev().find('li').filter(":not(:icontains('"+filterValue+"'))").css({"display":"none"});
	$("#" + ddID).prev().prev().click();
}

function generateControl(columnName, type, variables) {
	switch(type) {
		case 'ddl':
		
			var listOfListsGUID  = variables[0];
			
			var dropDownListHTML	= '<div class="input-field col l6 s12">'
										+ '<input onchange="filterCurrentDropDown($(this))" onkeypress="filterCurrentDropDown($(this))" type="text" id="'+columnName+'_filter" filterList="' + columnName + '">'
										+ '<label for="'+columnName+'_filter">'+columnName+' Search:</label>'
										+ '<select MatchupTableGUID="'+listOfListsGUID+'" class="generatedSelect browser-default" id="' + columnName + '"></select>'
									+ '</div>';
			
			return dropDownListHTML;
			
		break;
		
		case 'table':
		
			//We have a drop down list component that links to the list of lists. We know from our logic, that the GUID 
			//will be in variable 1.
			var matchupTableGUID  = variables[0];
			
			//Let's create a drop down list element via HTML. This id will be the columnName so we can extract the values 
			//when we need to submit the record.
			var jqWidgetHTML	= '<div class="col l6 s12">'
									+ '<div>' + columnName + '</div>'
									+ '<div id="' + columnName + 'jqContainer">'
										+ '<div id="' + columnName + 'ddbutton">'
											+ '<div id="' + columnName + 'jqgrid" style="border-color: transparent"></div>'
										+ '</div>'
									+ '</div>'
								+ '</div>';

			//Lastly we will call a function to populate the drop down list.  
			populateJQWidget(matchupTableGUID, columnName);
			
			return jqWidgetHTML;
			
		break;
		
		case 'ref':
		
			//We have a drop down list component that links to the list of lists. We know from our logic, that the GUID 
			//will be in variable 1.
			var matchupTableGUID	= variables[0];
			var primaryKey			= variables[1];
			var displayCol			= variables[2];
			
			//Let's create a drop down list element via HTML. This id will be the columnName so we can extract the values 
			//when we need to submit the record.
			var jqWidgetHTML	= '<div class="col l6 s12">'
									+ '<div>' + columnName + '</div>'
									+ '<div id="' + columnName + 'jqContainer">'
										+ '<div id="' + columnName + 'ddbutton">'
											+ '<div id="' + columnName + 'jqgrid" style="border-color: transparent"></div>'
										+ '</div>'
									+ '</div>'
								+ '</div>';

			//Lastly we will call a function to populate the drop down list.  
			populateRefJQWidget(matchupTableGUID, columnName, primaryKey, displayCol);
			
			return jqWidgetHTML;
			
		break;
		
		case 'ref2':
		
			var matchupTableGUID  = variables[0];
			
			var dropDownListHTML	= '<div class="input-field col l6 s12">'
										+ '<input onchange="filterCurrentDropDown($(this))" onkeypress="filterCurrentDropDown($(this))" type="text" id="'+columnName+'_filter" filterList="' + columnName + '">'
										+ '<label for="'+columnName+'_filter">'+columnName+' Search:</label>'
										+ '<select MatchupTableGUID="'+matchupTableGUID+'" class="generatedRefSelect browser-default" id="' + columnName + '"></select>'
									+ '</div>';
			
			return dropDownListHTML;
			
		break;
		
		case 'textarea':
		
			//A simple textarea does not have any variables at this time. So we are simply going generate the HTML for a new textarea.
			var textAreaHTML	= '<div class="input-field col l12 s12">'
									+ '<textarea class="materialize-textarea" id="' + columnName + '"></textarea>'
									+ '<label for="' + columnName + '">' + columnName + '</label>'
								+ '</div>';
			
			return textAreaHTML;
			
		break;
		
		case 'query':
		
			//A simple query.
			var queryHTML	= '<div class="input-field col l6 s12">'
								+ '<input type="text" value="'+variables[0]+'" id="' + columnName + '">'
								+ '<label class="active" for="' + columnName + '">' + columnName + '</label>'
							+ '</div>';
			
			return queryHTML;
			
		break;
		
		case 'writeTo':
		
			//A simple query.
			queryHTML	= '<div class="input-field col l6 s12">'
							+ '<input type="text" value="'+variables[1]+'" id="write_to">'
							+ '<label class="active" for="write_to">Write To Table</label>'
						+ '</div>';
			
			return queryHTML;
			
		break;
		
		case 'guid':
		
			//The GUID field will automatically generate a GUID, although the GUID can be manually updated if needed.
			var newGUID = CreateGUID();
		
			//A simple guid field does not have any variables at this time. So we are simply going to generate the HTML for a new guidField.
			var guidHTML	= '<div class="input-field col l6 s12">'
								+ '<input type="text" id="' + columnName + '" value="' + newGUID + '">'
								+ '<label class="active" for="' + columnName + '">' + columnName + '</label>'
							+ '</div>';
			
			return guidHTML;
			
		break;
		
		case 'auto':
			var incVariable = "";

			if(variables[0].split(": ")[0] == "Table") {
				incVariable = variables[0].split(": ")[1] + "xTABLEx";
			}
			else {
				incVariable = variables[0].split(": ")[1];
			}
			//An auto field will not be editable by the user but will instead, based on the column chosen, will increment automatically when records are added to the database.
			var autoFieldHTML	= '<div class="input-field col l6 s12">'
									+ '<input disabled Increment="'+incVariable+'" type="text" id="' + columnName + '" class="autoField" value="">'
									+ '<label class="active" for="' + columnName + '">' + columnName + '</label>'
								+ '</div>';
			
			return autoFieldHTML;
			
		break;
		
		case 'textfield':
		
			//A simple textfield does not have any variables at this time. So we are simply going to generate the HTML for a new textField.
			var textFieldHTML	= '<div class="input-field col l6 s12">'
									+ '<input type="text" id="' + columnName + '">'
									+ '<label for="' + columnName + '">' + columnName + '</label>'
								+ '</div>';
			
			return textFieldHTML;
			
		break;
		
		case 'checkbox':
			//A checkbox does not have any variables either at this time. Let's generate the HTML for a simple checkbox.
			var checkboxHTML	= '<div>'
									+ '<div class="input-field col l6 s12">'
										+ '<input type="checkbox" id="' + columnName + '">'
										+ '<label for="' + columnName + '">' + columnName + '</label>'
									+ '</div>'
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
									+ 'On</label>'
								+ '</div>'
							+ '</div>';
			
			return switchHTML;
			
		break;
		
		case 'datetime':
			//This will return just the html for a date picker, and then call on the JQuery to populate the code. We need a JQuery date picker because IE does not yet support
			//datepickers in HTML5. Sad, I know, but a necessary evil.
			
			var dateTimePickerHTML	= '<div class="input-field col l6 s12">'
										+ '<input type="text" id="' + columnName + '" class="datepicker">'
										+ '<label for="' + columnName + '">' + columnName + '</label>'
									+ '</div>';
			
			setTimeout(function() {
				$('#' + columnName).datetimepicker();
			},500);
			
			return dateTimePickerHTML;
			
		break;
		
		case 'date':
			//This will return just the html for a date picker, and then call on the JQuery to populate the code. We need a JQuery date picker because IE does not yet support
			//datepickers in HTML5. Sad, I know, but a necessary evil.
			
			var datePickerHTML	= '<div class="input-field col l6 s12">'
									+ '<input type="date" id="' + columnName + '" class="datepicker">'
									+ '<label for="' + columnName + '">' + columnName + '</label>'
								+ '</div>';
			
			//populateDatePicker(columnName);
			
			setTimeout(function() {			
				$('#' + columnName).datetimepicker({
					timepicker:false,
					format:'m/d/Y h:i',
					mask:true,
					formatDate:'Y/m/d'//,
					//minDate:'2015/03/3', // yesterday is minimum date
					//maxDate:'2015/03/11' // and tommorow is maximum date calendar
				});
			},500);
			
			return datePickerHTML;
			
		break;
		
	}
	
	return 'No Control Found for Type ' + type;	
}

function populateDatePicker(columnName) {

	if(loadedScripts == 0) {
		loadjscssfile("../dba/js/jquery.js", "js"); 
		loadjscssfile("../dba/js/jquery.datetimepicker.js", "js"); 
		loadedScripts = 1;
	}
	
	setTimeout(function() {
	
		$('#' + columnName).datetimepicker({
			timepicker:false,
			format:'m/d/Y',
			mask:true,
			formatDate:'Y/m/d'//,
			//minDate:'2015/03/3', // yesterday is minimum date
			//maxDate:'2015/03/11' // and tommorow is maximum date calendar
		});
	
	}, 1000);
}


function populateDropDownControl(listOfListsGUID, columnName) {
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableRecords?where=\"MatchupTableGUID= '" + listOfListsGUID + "' AND IsActive = '1' ORDER BY RecordValue ASC\"", function( data ) {	     	
	     	
		$('#'+columnName).html("<option value='null'>-- Choose --</option>");
		var dropDownList = document.getElementById(columnName);
		
		for(var key in data) {
			dropDownList.options[dropDownList.options.length] = new Option(data[key].RecordValue, data[key].RecordGroupGUID);
		}
	});
}

function populateJQWidget(matchupTableGUID, element) {
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?select=\"MatchupTableName\"&where=\"MatchupTableGUID='" + matchupTableGUID +"'\"", function( tableData ) {		
		var CurrentTableName = tableData[0].MatchupTableName;
		
		$.getJSON(ruIP + ruPort + listsDB + listEN + "getstructure/virtual/"+ UserData[0].SiteGUID +"/"+ CurrentTableName +"", function( tableStructureData ) {
			var loadURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/" + CurrentTableName;
			var tableStructure = [];

			tableStructure = tableStructureData;
			PrepareColumnsForGrid2(tableStructure, loadURL, element);
		});
	});
}

function populateRefJQWidget(matchupTableGUID, element, pk, dc) {
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?select=\"MatchupTableName\"&where=\"MatchupTableGUID='" + matchupTableGUID +"'\"", function( tableData ) {		
		var CurrentTableName = tableData[0].MatchupTableName;
		
		$.getJSON(ruIP + ruPort + listsDB + listEN + "getstructure/virtual/"+ UserData[0].SiteGUID +"/"+ CurrentTableName +"", function( tableStructureData ) {
			var loadURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/" + CurrentTableName;
			var tableStructure = [];
			
/* 			for(var key in tableStructureData) {
				var dataObj = {};
				
				dataObj.ElementControlType		= "textfield";
				dataObj.MatchupTableElementName = tableStructureData[key];
				dataObj.MatchupTableElementName = tableStructureData[key];
				dataObj.ElementDataType			= "string";
				tableStructure.push(dataObj);
			} */

			var dataObj1 = {};

			dataObj1.ElementControlType			= "textfield";
			dataObj1.MatchupTableElementName	= pk;
			dataObj1.ElementDataType			= "string";
			var dataObj2 = {};

			dataObj2.ElementControlType			= "textfield";
			dataObj2.MatchupTableElementName	= dc;
			dataObj2.ElementDataType			= "string";
			tableStructure.push(dataObj2);			

			PrepareColumnsForGrid2(tableStructure, loadURL, element, pk, dc);
		});
	});
}

function populateRefDropDown(matchupTableGUID, columnName) {
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?select=\"MatchupTableName\"&where=\"MatchupTableGUID='" + matchupTableGUID +"'\"", function( tableData ) {		
		var CurrentTableName = tableData[0].MatchupTableName;
		var tableGUID = tableData[0].MatchupTableGUID;
		
		$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"SiteGUID = '" + UserData[0].SiteGUID + "' AND MatchupTableGUID = '" + matchupTableGUID + "' AND IsActive = '1' ORDER BY Ordinal ASC\"", function( refTableData ) {
			$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+ UserData[0].SiteGUID +"/"+ CurrentTableName +"", function( data ) {

				$('#'+columnName).html("<option value='null'></option>");
				var dropDownList = document.getElementById(columnName);
				
				for(var key in data) {
					dropDownList.options[dropDownList.options.length] = new Option(data[key][refTableData[0].ControlVariable2], data[key][refTableData[0].ControlVariable2]);
				}
			});
		});
	});
}

function PrepareColumnsForGrid2(tableStructure, url, element, pk, dc) {
	
	var datafieldsColumnArray = [];
	
	datafieldsColumnArray.push({ text: '#', sortable: false, filterable: false, editable: false, groupable: false, draggable: false, 
		resizable: false, datafield: '', columntype: 'number', width: 50, cellsrenderer: function (row, column, value) {
			return "<div style='margin:4px;'>" + (value + 1) + "</div>";
		}
	});
	
	if(pk) {
		datafieldsColumnArray.push({ name: pk, display: pk, type: 'string', text: pk, datafield: pk, hidden: false, editable: false });
		datafieldsColumnArray.push({ name: dc, display: dc, type: 'string', text: dc, datafield: dc, hidden: false, editable: false });
	}
	else {
		datafieldsColumnArray.push({ name: 'TableRecordGUID', display: 'TableRecordGUID', type: 'string', text: 'TableRecordGUID', datafield: 'TableRecordGUID', hidden: true, editable: false });
	}

	if(!pk) {
		for(var key in tableStructure) {
			
			var colType = "";
			var cellsAlign = "";
			var cellsFormat = "";
			
			if(tableStructure[key].ElementControlType == "ddl") {
				colType = 'dropdownlist';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "textarea") {
				colType = 'text';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "table") {
				colType = 'text';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "ref") {
				colType = 'text';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "auto") {
				colType = 'text';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "guid") {
				colType = 'text';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "textfield") {
				colType = 'text';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "checkbox") {
				colType = 'checkbox';
				cellsAlign = 'center';
			}
			if(tableStructure[key].ElementControlType == "date") {
				colType = 'datetimeinput';
				cellsAlign = 'right';
				cellsFormat = 'MM/dd/yyyy';
			}
			if(tableStructure[key].ElementControlType == "datetime") {
				colType = 'datetimeinput';
				cellsAlign = 'right';
				cellsFormat = 'MM/dd/yyyy hh:mm';
			}

			datafieldsColumnArray.push({ name: tableStructure[key].MatchupTableElementName, display: tableStructure[key].MatchupTableElementName,
				type: tableStructure[key].ElementDataType, cellsalign: cellsAlign, cellsformat: cellsFormat, text: tableStructure[key].MatchupTableElementName,
				datafield: tableStructure[key].MatchupTableElementName, columntype: colType, hidden: false, editable: false,
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					if (newvalue == "") return oldvalue;
				}
			});
		}
	}
	
	LoadRecordsGrid2(datafieldsColumnArray, tableStructure, url, element);
}

function LoadRecordsGrid2(datafieldsArray, tableStructure, url, element) {
	
	var jqWidgetContainer	= "#" + element + "jqContainer";
	var jqDropDown			= "#" + element + "ddbutton";
	var jqWidget			= "#" + element + "jqgrid";
		
	$(jqWidget).jqxGrid('destroy');
	$(jqDropDown).jqxDropDownButton('destroy');
	$(jqWidgetContainer).prepend('<div id="' + element + 'ddbutton"><div id="' + element + 'jqgrid" style="border-color: transparent"></div></div>');
	
	var source = {
		datatype: "json",
		datafields: datafieldsArray,
		url: url
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
 	$(jqWidget).jqxGrid({
		width: "100%",
		autoheight: true,
		height: 300,
		source: dataAdapter,
		theme: 'metro',
		columnsresize: true,
		columnsreorder: true,
		filterable: true,
		pageable: false,
		sortable: true,
		groupable: true,
        editable: false,
		enabletooltips: false,
		columns: datafieldsArray,
	});

	$(jqWidget).on('rowselect', function (event) {
		var args = event.args;
		var row = args.row;
		var rowString = "";
		var count = 0;		

 		for(var key in row) {
			(count == 0) ? rowString += row[key] : false;
			count++;
		}
				
		var dropDownContent = '<div style="position: relative; margin-left: 3px; margin-top: 5px;">'+rowString+'</div>';
		$(jqDropDown).jqxDropDownButton('setContent', dropDownContent);
	});

	$(jqDropDown).jqxDropDownButton({
		width: "100%", height: 25
	});
}









