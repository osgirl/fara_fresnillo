/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			populate_control_options.js
=============================================================*/

function PopulateControlVariables(element, colCount) {	
	
	var controlVariablesRowHTML = "";
	
	switch(element[0].value) {
		case "ddl":
			controlVariablesRowHTML += '<div class="input-field col s3">';
			controlVariablesRowHTML += '<select class="structSelectInput controlVar1" id="control_var_1_col_' + colCount + '">';
			controlVariablesRowHTML += '<option value="default" disabled>-- Choose --</option>';
			
			for(key in ListOfListsArray) {
				controlVariablesRowHTML += '<option value="' + ListOfListsArray[key].value + '">' + ListOfListsArray[key].label + '</option>';
			}
			
			controlVariablesRowHTML += '</select>';
			controlVariablesRowHTML += '<label for="control_var_1_col_' + colCount + '">Control Variable</label>';
			controlVariablesRowHTML += '</div>';

			$("#control_variables_container_" + colCount).html(controlVariablesRowHTML);
	
			$("#control_var_1_col_" + colCount).on('change', function() {
				$("#table_structure_upload_button").removeClass("disabled");
				canUpload = true;
			});
			
			$("#control_var_1_col_" + colCount).material_select();
		break;
			
		case "table":
			controlVariablesRowHTML += '<div class="input-field col s2">';
			controlVariablesRowHTML += '<select onchange="PopulateTableColumns($(this), '+colCount+')" class="structSelectInput controlVar1" id="control_var_1_col_' + colCount + '">';
			controlVariablesRowHTML += '<option value="none">-- Choose --</option>';
			
			for(key in MatchupTablesArray) {			
				controlVariablesRowHTML += '<option value="' + MatchupTablesArray[key].MatchupTableGUID + '">' + MatchupTablesArray[key].MatchupTableName + '</option>';
			}
			
			controlVariablesRowHTML += '</select>';
			controlVariablesRowHTML += '<label for="control_var_1_col_' + colCount + '">Control Variable 1</label>';
			controlVariablesRowHTML += '</div>';

			$("#control_variables_container_" + colCount).html(controlVariablesRowHTML);
	
			$("#control_var_1_col_" + colCount).on('change', function() {
				$("#table_structure_upload_button").removeClass("disabled");
				canUpload = true;
			});
			
			$("#control_var_1_col_" + colCount).material_select();
		break;
			
		default:
			controlVariablesRowHTML += '<div class="input-field col s3">';
			controlVariablesRowHTML += '<input class="controlVar1" id="control_var_1_col_' + colCount + '" type="text" value="Display Text" placeholder="Enter Text Here:">'
			controlVariablesRowHTML += '<label class="active" for="control_var_1_col_' + colCount + '">Control Variable</label>';
			controlVariablesRowHTML += '</div>';
	
			$("#control_var_1_col_" + colCount).on('keypress', function() {
				$("#table_structure_upload_button").removeClass("disabled");
				canUpload = true;
			});

			$("#control_variables_container_" + colCount).html(controlVariablesRowHTML);	
		break;	
	}
}

function PopulateTableColumns(element, colCount, value) {
	
	$("#table_structure_upload_button").removeClass("disabled");
	canUpload = true;
			
	var tableName = element.find("option:selected").text();
	$.getJSON(ruIP + ruPort + listsDB + listEN + "getstructure/virtual/"+ UserData[0].SiteGUID +"/"+ tableName +"", function(data) {
		var controlVariablesRowHTML = "";
		
		controlVariablesRowHTML += '<div class="controlVariable2 input-field col s2">';
		controlVariablesRowHTML += '<select class="structSelectInput controlVar2" id="control_var_2_col_' + colCount + '">';
		controlVariablesRowHTML += '<option value="none">-- Choose --</option>';
		
		for(key in data) {			
			controlVariablesRowHTML += '<option MatchuptableElementGUID="'+data[key].MatchupTableElementGUID+'" value="' + data[key].MatchupTableElementName + '">' + data[key].MatchupTableElementName + '</option>';
		}
		
		controlVariablesRowHTML += '</select>';
		controlVariablesRowHTML += '<label for="control_var_2_col_' + colCount + '">Control Variable 2</label>';
		controlVariablesRowHTML += '</div>';
		
		$("#control_variables_container_" + colCount).find(".controlVariable2").remove();
		$("#control_variables_container_" + colCount).append(controlVariablesRowHTML);
		
		if(value) {
			$("#control_var_2_col_" + colCount).val(value);
		}
	
		$("#control_var_2_col_" + colCount).on('change', function() {
			$("#table_structure_upload_button").removeClass("disabled");
			canUpload = true;
		});
		
		$("#control_var_2_col_" + colCount).material_select('destroy');
		$("#control_var_2_col_" + colCount).material_select();
	});
}









