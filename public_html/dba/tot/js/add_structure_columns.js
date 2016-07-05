/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			add_structure_columns.js
=============================================================*/

var columnCount	= 0;
var newColumns	= 0;
var canUpload	= true;

function AppendSQLColumnToStructure() {
	columnCount = 1;
	var sqlHTML = '<div id="row_container_'+columnCount+'" TableElementGUID="-1" class="row columnRow rowContainer1" value="' + columnCount + '" style="margin-bottom:20px !important;">'
					+ '<div class="columnStruct" id="column_struct_1">'
						+ '<div class="input-field col s12">'
							+ '<textarea class="sqlTextArea materialize-textarea" id="control_var_1_col_1"></textarea>'
							+ '<label class="active" for="control_var_1_col_1">Query Builder</label>'
						+ '</div>'
						+ '<div class="col s3">'
							+ '<label>Primary Key</label>'
							+ '<select class="structSelectInput datatypeStruct browser-default" id="control_var_2_col_1">'
								+ '<option value="default">-- Choose --</option>'
							+ '</select>'
						+ '</div>'
						+ '<div class="col s3">'
							+ '<label>Display Column</label>'
							+ '<select class="structSelectInput datatypeStruct browser-default" id="control_var_3_col_1">'
								+ '<option value="default">-- Choose --</option>'
							+ '</select>'
						+ '</div>'
						+ '<div class="input-field col s3">'
							+ '<div onclick="generateColumnsFromQuery()" class="structureBtn waves-effect waves-light btn btn-floating deep-orange lighten-1 center"><i class="material-icons">loop</i></div>'
						+ '</div>'
						+ '<div style="display:none">'
							+ '<a id="ordinal_col_1" class="ordinalButton hide">1</a>'
							+ '<input class="structTextInput columnNameStruct" id="column_name_col_1" type="text" value="Query">'
							+ '<select class="structSelectInput controlStruct browser-default" id="control_col_1"><option value="default">-- Choose --</option><option selected value="query">Query</option></select>'
							+ '<select class="structSelectInput datatypeStruct browser-default" id="datatype_col_1"><option value="default">-- Choose --</option><option selected value="string">text</option></select>'
						+ '</div>'
					+ '</div>'
				+ '</div>';
	
	$("#table_structure_input").html("");
	$("#table_structure_input").append(sqlHTML);
	
	//$("#table_structure_upload_button").removeClass("disabled");
	//canUpload = true;
}

function generateColumnsFromQuery(qry, value1, value2) {
	var query = (qry) ? btoa(qry) : btoa($("#control_var_1_col_1").val());
	
	var jsonData = {
		 "query": query
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + 'runQuery',
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(data){
			if(data.error) {
				DisplayAlert("ERROR","Query not valid.");
			}
			else {
				var selectHtml	= $("#control_var_2_col_1").html();
				var selectHtml2	= $("#control_var_3_col_1").html();
				
				for(var key in data[0]) {
					selectHtml	+= '<option value="' + key + '">' + key + '</option>';
					selectHtml2	+= '<option value="' + key + '">' + key + '</option>';
				}
				
				$("#control_var_2_col_1").html(selectHtml);
				$("#control_var_3_col_1").html(selectHtml2);
				(value1) ? $("#control_var_2_col_1").val(value1) : false;
				(value2) ? $("#control_var_3_col_1").val(value2) : false;
				
				$("#table_structure_upload_button").removeClass("disabled");
				canUpload = true;
			}
		}
	});
}

function AppendColumnToStructure() {
	var readOnlyInput				= '';
	var readOnlySelect				= '';
	var cancelDisabled				= '';
	var notEditableClass			= '';
	var readOnlyColumnNameInput		= '';
	var notEditableColumnNameClass	= '';
	var cancelClickEvent			= 'onclick="RemoveColumn($(this))"';
	columnCount++;
	
	if(tableIsLocked) {
		readOnlyInput				= 'readonly';
		readOnlySelect				= 'disabled';
		cancelDisabled				= 'disabled';
		notEditableClass			= 'class="notEditable"';
		readOnlyColumnNameInput		= 'readonly';
		notEditableColumnNameClass	= 'class="notEditable"';
		cancelClickEvent = '';
	}

	var columnHTML	= '<div id="row_container_'+columnCount+'" TableElementGUID="-1" class="draggable row columnRow rowContainer' + (columnCount % 2) + '" value="' + columnCount + '">'
						+ '<div class="columnStruct" id="column_struct_' + columnCount + '">'
							+ '<a id="ordinal_col_' + columnCount + '" class="ordinalButton btn-flat btn waves-effect waves-light blue white-text left">' + columnCount + '</a>'
							+ '<a id="remove_col_' + columnCount + '" ' + cancelClickEvent + '" class="deleteButton btn-flat btn waves-effect waves-light red white-text right ' + cancelDisabled +'"><i class="material-icons">delete</i></a>'
							
							+ '<div class="input-field col s3">'
								+ '<input ' + readOnlyColumnNameInput + ' class="columnNameStruct" id="column_name_col_' + columnCount + '" type="text" value="Column_'+columnCount+'" placeholder="Enter Column Name Here:">'
								+ '<label class="active" for="column_name_col_' + columnCount + '">Column Name</label>'
							+ '</div>'
							
							+ '<div class="col s2">'
								+ '<label>Control</label>'
								+ '<select ' + readOnlySelect + ' class="structSelectInput controlStruct browser-default" id="control_col_' + columnCount + '">'
									+ '<option value="default" disabled>-- Choose --</option>'
									+ '<option value="guid">GUID</option>'
									+ '<option value="auto">Auto</option>'
									+ '<option value="textfield" selected>text field</option>'
									+ '<option value="textarea">text area</option>'
									+ '<option value="ddl">drop down list</option>'
									+ '<option value="table">Matchup-Table</option>'
									+ '<option value="ref">Reference-Table (SQL)</option>'
									+ '<option value="checkbox">checkbox</option>'
									+ '<option value="switch">switch</option>'
									+ '<option value="num">number</option>'
									+ '<option value="date">date</option>'
									+ '<option value="datetime">date time</option>'
								+ '</select>'
							+ '</div>'
							
							+ '<div class="col s2">'
								+ '<label>Datatype</label>'
								+ '<select ' + readOnlySelect + ' class="structSelectInput datatypeStruct browser-default" id="datatype_col_' + columnCount + '">'
									+ '<option value="default">-- Choose --</option>'
									+ '<option value="string" selected>text</option>'
									+ '<option disabled value="int">integer</option>'
									+ '<option disabled value="float">decimal</option>'
									+ '<option disabled value="bool">boolean</option>'
								+ '</select>'
							+ '</div>'
							+ '<div class="controlVarsContainer" id="control_variables_container_'+columnCount+'"></div>'
						+ '</div>'
					+ '</div>';
	
	$("#table_structure_input").append(columnHTML);
	canDelete = false;
	
	$("#control_col_" + columnCount).on('change', function(){
		var element = $(this);
		var rowNum = parseInt(element.attr("id").split("_")[2]);
		
		$("#table_structure_upload_button").removeClass("disabled");
		canUpload = true;

		PopulateDataTypes(element);
		PopulateControlVariables(element, rowNum, readOnlySelect, readOnlyInput, notEditableClass);
	});
	
	$("#column_name_col_" + columnCount).on('keypress', function() {
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
			
			ReasignRows();
		}
	});
}

function UploadNewColumns() {
	var createdRowArray			= [];
	var updatedRowArray			= [];
	var tempMatchupTableGUID	= "";
	var defaultValue			= "-- Choose --";
	var validColumn				= true;
	var alertMessage			= '';	
	
	for(var i = 1; i <= columnCount; i++) {
		var newObj = {};
		
		if($("#row_container_" + i).attr("TableElementGUID") == "-1") {
			
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
				newObj.MatchupTableGUID			= matchupTableGUID;
				newObj.SiteGUID					= UserData[0].SiteGUID;
				newObj.MatchupTableElementName	= $.trim($("#column_name_col_" + i).val());
				newObj.Ordinal					= $("#ordinal_col_" + i).html();
				newObj.ElementControlType		= $("#control_col_" + i).val();
				newObj.ElementDataType			= $("#datatype_col_" + i).val();
				newObj.ControlVariable1			= $("#control_var_1_col_" + i).val();
				newObj.ControlVariable2			= $("#control_var_2_col_" + i).val();
				newObj.ControlVariable3			= $("#control_var_3_col_" + i).val();				
				
				createdRowArray.push(newObj);
				
				if(newObj.ElementControlType == "query" && i == 1) {
					tempMatchupTableGUID = matchupTableGUID;
				}
			}
		}
		else {
			var MatchupTableElementGUID			= $("#row_container_" + i).attr("TableElementGUID");
			var apiKeyObj						= {};
			apiKeyObj.MatchupTableElementGUID	= MatchupTableElementGUID;
			newObj.Modified						= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			newObj.APIKEY						= apiKeyObj;
			newObj.MatchupTableElementName		= $.trim($("#column_name_col_" + i).val());
			newObj.Ordinal						= $("#ordinal_col_" + i).html();
			newObj.ElementControlType			= $("#control_col_" + i).val();
			newObj.ElementDataType				= $("#datatype_col_" + i).val();
			newObj.ControlVariable1				= $("#control_var_1_col_" + i).val();
			newObj.ControlVariable2				= $("#control_var_2_col_" + i).val();
			newObj.ControlVariable3				= $("#control_var_3_col_" + i).val();
			
			updatedRowArray.push(newObj);
		}
	}
	
	if(validColumn) {
		if(tempMatchupTableGUID != "") {
			UpdateMatchupTable(tempMatchupTableGUID);
		}
		
		CreateMatchupTableElements(createdRowArray, updatedRowArray);
	}
	else {
		DisplayAlert("Alert!",alertMessage);
	}
}

function CreateMatchupTableElements(createdRowArray, updatedRowArray) {	
	if(createdRowArray.length > 0) {
	
		var jsonData = {
			 "fields": createdRowArray
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + 'create/bulk/dbo/MatchupTableElements',
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				UpdateMatchupTableElements(updatedRowArray, true);
			}
		});
	}
	else {
		UpdateMatchupTableElements(updatedRowArray, false);
	}
}

function UpdateMatchupTableElements(updatedRowArray, columnsCreated) {
	if(updatedRowArray.length > 0) {
		var validGUIDKey = true;

		for(var key in updatedRowArray) {
			if(!updatedRowArray[key].APIKEY.MatchupTableElementGUID) {
				validGUIDKey = false;
			}
		}
		
		if(validGUIDKey) {
				
			var jsonData2 = {
				 "fields": updatedRowArray
			};
			
			$.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + listsDB + listEN + 'update/bulk/dbo/MatchupTableElements',
				type: "POST",
				data: JSON.stringify(jsonData2),
				success: function(){
					if(!columnsCreated) {
						DisplayAlert("Alert!","Success! Columns have been updated.");
					}
					var item = $("#matchup_table_tree").jqxTree('getSelectedItem');
					$("#matchup_table_tree").jqxTree('selectItem', null);
					$("#matchup_table_tree").jqxTree('selectItem', item);
				}
			});
		}
		else {
			DisplayAlert("Alert!", "A MatchupTableGUID was undefined.  Could not proceed with update.");
		}
	}
	else if(columnsCreated) {
		DisplayAlert("Alert!","Success! Columns have been created.");
		var item = $("#matchup_table_tree").jqxTree('getSelectedItem');
		$("#matchup_table_tree").jqxTree('selectItem', null);
		$("#matchup_table_tree").jqxTree('selectItem', item);
	}
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
	var MatchupTableElementGUID = element.closest(".columnRow").attr("TableElementGUID");
	element.closest(".columnRow").animate({"height":"0px", "opacity":"0.0"}, 250);
	
	setTimeout(function() {	
		element.closest(".columnRow").remove();
	
		columnCount--;
		newColumns--;
		
		var count = 1;
		DeactivateColumn(MatchupTableElementGUID);
		ReasignRows();
	},250);
}

function DeactivateColumn(MatchupTableElementGUID) {
	if(MatchupTableElementGUID != -1) {
		
		var jsonData = {
			"key": { "MatchupTableElementGUID": MatchupTableElementGUID},
			"fields": { "IsActive" : false }
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + 'update/dbo/MatchupTableElements',
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				
				/* $.ajax ({
					headers: {
						"Content-Type": "application/json"
					},
					url: ruIP + ruPort + listsDB + listEN + 'update/dbo/MatchupTableRecords',
					type: "POST",
					data: JSON.stringify(jsonData),
					success: function(){
					}
				}); */
			}
		});
	}
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
		element.find("select.controlVar1").attr("id", "control_var_1_col_" + count);
		element.find("select.controlVar1").next().attr("for", "control_var_1_col_" + count);
		element.find("select.controlVar2").attr("id", "control_var_2_col_" + count);
		element.find("select.controlVar2").next().attr("for", "control_var_2_col_" + count);
		element.find("select.controlVar3").attr("id", "control_var_3_col_" + count);
		element.find("select.controlVar3").next().attr("for", "control_var_3_col_" + count);
		
		count++;		
	});
}



