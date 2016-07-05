/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			add_structure_columns.js
=============================================================*/

var columnCount		= 0;
var settingsCount	= 0;
var canUpload		= false;

function AppendColumnToStructure(completeService) {
	columnCount++;

	var columnHTML	= '<div id="row_container_'+columnCount+'" TableElementGUID="-1" class="draggable row columnRow rowContainer' + (columnCount % 2) + '" value="' + columnCount + '">'
						+ '<div class="columnStruct" id="column_struct_' + columnCount + '">'
							+ '<a id="ordinal_col_' + columnCount + '" class="ordinalButton btn-flat btn waves-effect waves-light blue white-text left">' + columnCount + '</a>'
							+ '<a id="remove_col_' + columnCount + '" onclick="RemoveColumn($(this))" class="deleteButton btn-flat btn waves-effect waves-light red white-text right"><i class="material-icons">delete</i></a>'
							
							+ '<div class="input-field col s3">'
								+ '<input class="columnNameStruct" id="column_name_col_' + columnCount + '" type="text" value="Field'+columnCount+'" placeholder="Enter Field Name Here:">'
								+ '<label class="active" for="column_name_col_' + columnCount + '">Field Name</label>'
							+ '</div>'
							
							+ '<div class="input-field col s2">'
								+ '<select class="structSelectInput controlStruct" id="control_col_' + columnCount + '">'
									+ '<option value="default" disabled>-- Choose --</option>'
									+ '<option value="header">Header</option>'
									+ '<option value="textfield" selected>text field</option>'
									+ '<option value="textarea">text area</option>'
									+ '<option value="ddl">drop down list</option>'
									+ '<option value="table">Matchup Table</option>'
									+ '<option value="checkbox">checkbox</option>'
									+ '<option value="switch">switch</option>'
								+ '</select>'
								+ '<label for="control_col_' + columnCount + '">Control</label>'
							+ '</div>'
							
							+ '<div class="controlVarsContainer" id="control_variables_container_'+columnCount+'">'
								+ '<div class="input-field col s3">'
									+ '<input class="controlVar1" id="control_var_1_col_' + columnCount + '" type="text">'
									+ '<label class="active" for="control_var_1_col_' + columnCount + '">Control Variable</label>'
							+ '</div>'
						+ '</div>'
					+ '</div>';
	
	$("#table_structure_input").append(columnHTML);
	$('#control_col_' + columnCount).material_select();
	canDelete = false;
	
	$("#control_col_" + columnCount).on('change', function(){
		$("#table_structure_upload_button").removeClass("disabled");
		canUpload = true;
		var element = $(this);
		var rowNum = parseInt(element.attr("id").split("_")[2]);
		
		PopulateControlVariables(element, rowNum);
	});
	
	$("#column_name_col_" + columnCount).on('keypress', function() {
		$("#table_structure_upload_button").removeClass("disabled");
		canUpload = true;
	});
	
	$("#control_var_1_col_" + columnCount).on('keypress', function() {
		$("#table_structure_upload_button").removeClass("disabled");
		canUpload = true;
	});
	
	$("#control_var_1_col_" + columnCount).on('change', function() {
		$("#table_structure_upload_button").removeClass("disabled");
		canUpload = true;
	});
	
	var scrollHeight = $("#table_structure_input")[0].scrollHeight;
	$("#table_structure_input").scrollTop(scrollHeight);
	
	var draggingID;

	$( ".draggable" ).draggable({
		cursor: "crosshair",
		helper: "clone",
		start: function( event, ui) {
			draggingID = $(this).attr("id");
		}
	});


	$( ".draggable" ).droppable({
		drop: function( event, ui ) {
			$("#table_structure_upload_button").removeClass("disabled");
			canUpload = true;
			var oldID = "#" + draggingID;
			var oldOrdinal = $(oldID).find(".ordinalButton").html();
			var newOrdinal = $(this).find(".ordinalButton").html();
			
			if(oldOrdinal < newOrdinal) {
				$( this ).after($(oldID)[0]);
			}
			else {
				$( this ).before($(oldID)[0]);				
			}			
			
			$('.structSelectInput').material_select('destroy');
			
			setTimeout(function() {				
				ReasignRows();
			},250);
		}
	});
	
	if(completeService) {
		ServiceComplete();
	}
}

function AppendSettingToStructure() {
	settingsCount++;
	canRemoveSetting = true;
	$("#table_setting_remove_button").removeClass("disabled");
	
	var settingsHTML 	= '<div class="input-field col s6">'
							+ '<select TableRecordGUID="-1" class="settingsSelect" id="settings_select_'+settingsCount+'"></select>'
							+ '<label for="settings_select_'+settingsCount+'">Event Type '+settingsCount+'</label>'
						+ '</div>'
	
	$("#table_settings_input").append(settingsHTML);
	
	var element		= $('#settings_select_'+settingsCount);
	var selectHTML	= "";
	
	selectHTML = '<option value="default">-- Choose --</option>';
	
	for(key in systemEventTypes) {
		selectHTML += '<option EventTypeGUID="'+systemEventTypes[key].TableRecordGUID+'" value="' + systemEventTypes[key].SYS_EventTypes + '">' + systemEventTypes[key].SYS_EventTypes + '</option>';
	}
	
	element.html(selectHTML);
	
	element.material_select();
}

function RemoveSetting() {
	var element = $('#settings_select_'+settingsCount);
	
	element.material_select('destroy');
	element.parent().remove();
	
	settingsCount--;

	if(settingsCount <= 0) {
		canRemoveSetting = false;
		$("#table_setting_remove_button").addClass("disabled");
	}	
}

function UploadNewColumns() {
	var createdRowArray = [];
	var validColumn		= true;
	var alertMessage	= '';
	
	for(var i = 1; i <= columnCount; i++) {
		var newObj = {};
		
		if($("#column_name_col_" + i).val() == "") {
			alertMessage = "A Name must be entered for each new column.";
			validColumn = false;
		}
		else if($("#column_name_col_" + i).val()[0].isInteger == true) {
			alertMessage = "Column names must start with a letter.";
			validColumn = false;
		}
		else if($("#column_name_col_" + i).val().trim().indexOf(" ") != "-1") {
			alertMessage = "Field names cannot contain spaces.";
			validColumn = false;
		}
		else if($("#control_col" + i).val() == "default") {
			alertMessage = "A Control must be selected for each new column.";
			validColumn = false;
		}
		else if(columnNameExists($("#column_name_col_" + i).val())) {
			alertMessage = $("#column_name_col_" + i).val() + ' already exists in this table structure.';
			validColumn = false;
		}
		else {
			newObj.FormStructureElementGUID	= CreateGUID();
			newObj.FormStructureGUID		= matchupTableGUID;
			newObj.FormStructureElementName	= $.trim($("#column_name_col_" + i).val());
			newObj.Ordinal					= String.fromCharCode(96 + parseInt($("#ordinal_col_" + i).html()));
			newObj.ElementControlType		= $("#control_col_" + i).val();
			newObj.ControlVariable1			= $("#control_var_1_col_" + i).val();
			newObj.ControlVariable2			= $("#control_var_2_col_" + i).val();
			newObj.ControlVariable3			= $("#control_var_3_col_" + i).val();
			createdRowArray.push(newObj);
		}
	}
	
	console.log(createdRowArray);
	
	if(validColumn) {
		for(var key in MatchupTableElementsArray) {
			RemoveOldElements(MatchupTableElementsArray[key].TableRecordGUID, key, createdRowArray, true);
		}
		
		if(MatchupTableElementsArray.length <= 0) {
			CreateMatchupTableElements(createdRowArray);
		}
	}
	else {
		DisplayAlert("Alert!",alertMessage);
		ServiceComplete();
	}
}

function RemoveOldElements(recordGroupGUID, count, createdRowArray, proceed) {
	var jsonData = { "key": { "RecordGroupGUID": recordGroupGUID } };

	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "destroy/dbo/MatchupTableRecords",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			if(count >= (MatchupTableElementsArray.length - 1)) {
				if(proceed) {
					CreateMatchupTableElements(createdRowArray);
				}
				else {
					$("#form_struct_tree").jqxTree('selectItem', $("#form_struct_tree").find('li:first')[0]);
				}
			}
		}
	});
}

function CreateMatchupTableElements(createdRowArray) {
	if(createdRowArray.length > 0) {
	
		var jsonData = {
			 "fields": createdRowArray
		};

		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + 'create/bulk/virtual/'+UserData[0].SiteGUID+'/FormStructureElements',
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				DisplayAlert("Alert!","Success! New Columns have been created.");
				UploadSettings();
			}
		});
	}
	else {
		UploadSettings();
	}
}

function UploadSettings() {
	
	for(var key in matchupTableSettingsData) {
		RemoveSettings(matchupTableSettingsData[key].TableRecordGUID, key, true);
	}
	if(matchupTableSettingsData.length <= 0) {
		CreateSettings();
	}
}

function RemoveSettings(recordGroupGUID, count, proceed) {
	var jsonData = { "key": { "RecordGroupGUID": recordGroupGUID } };
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "destroy/dbo/MatchupTableRecords",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			if(count >= (matchupTableSettingsData.length - 1)) {
				if(proceed) {
					CreateSettings();
				}
				else {
					$("#form_struct_tree").jqxTree('selectItem', $("#form_struct_tree").find('li:first')[0]);
				}
			}
		}
	});
}

function CreateSettings() {
	var createdSettingArray = [];
	
	for(var i = 1; i <= settingsCount; i++) {
		var newObj = {};
		
		newObj.FormStructureGUID	= matchupTableGUID;
		newObj.EventRecording		= $("#settings_select_" + i).val();
		createdSettingArray.push(newObj);
	}
	
	if(createdSettingArray.length > 0) {
		var jsonData = {
			 "fields": createdSettingArray
		};

		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + 'create/bulk/virtual/'+UserData[0].SiteGUID+'/FormStructureRecordings',
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateSystemOption();
			}
		});
	}
	else {
		UpdateSystemOption();
	}
}

function UpdateSystemOption() {
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/FormStructures?where=\"FormStructureGUID = '"+matchupTableGUID+"'\"", function(data) {
		var recordGUID = data[0].TableRecordGUID;
	
		var systemForm = $("#system_form").prop('checked').toString();
		
		var jsonData = {
			 "key": { "TableRecordGUID": recordGUID },
			 "fields": { "SystemForm": systemForm }
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "update/virtual/"+UserData[0].SiteGUID+"/FormStructures",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				ResetStructurePage();
			}
		});
	});
}

function ResetStructurePage() {
	var tableName = $("#form_struct_tree").jqxTree('getSelectedItem').label;
	LoadMatchupTables(tableName);
}

function columnNameExists(column) {
	var count = 0;
	
	for(var i = 1; i <= columnCount; i++) {	
		var newObj = {};
		var existingColumn    = $("#column_name_col_" + i).val().toLowerCase();
		var columnNameToCheck = column.toLowerCase();

		if($.trim(existingColumn) == $.trim(columnNameToCheck)) {
			count++;
		}
	}
	
	if(count > 1)
		return true;
	
	return false;
}

function columnNameHasSpaces(column) {
	if(column.indexOf(' ') >= 0)
	{
		return true;
	}
	
	return false;
}

function RemoveColumn(element) {
	
	var index = element.attr("id").split("_")[2];
	element.closest(".columnRow").animate({"height":"0px", "opacity":"0.0"}, 250);
	
	$('.structSelectInput').material_select('destroy');
	
	setTimeout(function() {	
		element.closest(".columnRow").remove();
	
		columnCount--;
		
		var count = 1;
		
		ReasignRows();
	},250);
}

function RemoveMatchupTableElements(mteGuid) {
	var jsonData = {
		 "key": { "MatchupTableElementGUID": mteGuid },
		 "fields": { "IsActive": false, "Modified": moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.000z") }
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + 'update/dbo/MatchupTableElements/FormStructureElements',
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			if(!columnsCreated) {
				DisplayAlert("Alert!","Success! Columns have been updated.");
			}
			var item = $("#form_struct_tree").jqxTree('getSelectedItem');
			$("#form_struct_tree").jqxTree('selectItem', null);
			$("#form_struct_tree").jqxTree('selectItem', item);
		}
	});	
}

function ReasignRows() {
	var count = 1;
	
	$("#table_structure_input .columnRow").each(function(index) {
		var element = $(this);
		
		element.attr("value",count);
		element.removeClass("rowContainer0");
		element.removeClass("rowContainer1");
		element.addClass("rowContainer" + (count % 2));

		element.attr("id", "row_container_" + count);
		element.find(".columnStruct").attr("id", "column_struct_" + count);
		element.find(".ordinalButton").attr("id", "ordinal_col_" + count);
		element.find(".deleteButton").attr("id", "remove_col_" + count);
		element.find(".ordinalButton").html(count);
		element.find(".columnNameStruct").attr("id", "column_name_col_" + count);
		
		if(element.find(".columnNameStruct").val() == "") {
			element.find(".columnNameStruct").val("Column " + count);
		}
		
		element.find(".controlVarsContainer").attr("id", "control_variables_container_" + count);
		element.find(".columnNameStruct").next().attr("for", "column_name_col_" + count);
		
		element.find("select.controlStruct").attr("id", "control_col_" + count);
		element.find("select.controlStruct").next().attr("for", "control_col_" + count);		
		element.find("select.datatypeStruct").attr("id", "datatype_col_" + count);
		
		element.find(".controlVar1").attr("id", "control_var_1_col_" + count);
		element.find(".controlVar1").next().attr("for", "control_var_1_col_" + count);
		
		element.find(".controlVar2").attr("id", "control_var_2_col_" + count);
		element.find(".controlVar2").next().attr("for", "control_var_2_col_" + count);
		
		element.find(".controlVar3").attr("id", "control_var_3_col_" + count);
		element.find(".controlVar3").next().attr("for", "control_var_3_col_" + count);
		
		count++;		
	});
	
	$('.structSelectInput').material_select();
}



