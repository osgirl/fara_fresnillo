/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			populate_control_options.js
=============================================================*/

function PopulateDataTypes(element) {
	var currentRow = (element.attr('id').split("_")[2]);
	
	switch(element.val()) {
		case "textfield":
		case "textarea":
		case "guid":
		case "ddl":		
		case "table":
		case "ref":
		case "date":
		case "datetime":
			$("#datatype_col_" + currentRow + " option[value='string']").attr("disabled",false);
			$("#datatype_col_" + currentRow + " option[value='bool']").attr("disabled",true);
			$("#datatype_col_" + currentRow + " option[value='int']").attr("disabled",true);
			$("#datatype_col_" + currentRow + " option[value='float']").attr("disabled",true);
			break;
			
		case "auto":
			$("#datatype_col_" + currentRow + " option[value='string']").attr("disabled",true);
			$("#datatype_col_" + currentRow + " option[value='bool']").attr("disabled",true);
			$("#datatype_col_" + currentRow + " option[value='int']").attr("disabled",false);
			$("#datatype_col_" + currentRow + " option[value='float']").attr("disabled",true);
			break;
			
		case "checkbox":
		case "switch":
			$("#datatype_col_" + currentRow + " option[value='string']").attr("disabled",true);
			$("#datatype_col_" + currentRow + " option[value='bool']").attr("disabled",false);
			$("#datatype_col_" + currentRow + " option[value='int']").attr("disabled",true);
			$("#datatype_col_" + currentRow + " option[value='float']").attr("disabled",true);
			break;
			
		case "num":
			$("#datatype_col_" + currentRow + " option[value='string']").attr("disabled",true);
			$("#datatype_col_" + currentRow + " option[value='bool']").attr("disabled",true);
			$("#datatype_col_" + currentRow + " option[value='int']").attr("disabled",false);
			$("#datatype_col_" + currentRow + " option[value='float']").attr("disabled",false);
			break;
	}
}

function PopulateControlVariables(element, colCount, readOnlyAttribute, readOnlyInput, notEditableClass) {
	
	var controlVariablesRowHTML = "";
	var controlVar1HTML = "";
	var controlVar2HTML = "";
	var controlVar3HTML = "";
	
	switch(element[0].value) {
		case "ddl":
			controlVar1HTML += '<div class="col s3">';
			controlVar1HTML += '<label>Control Variable 1</label>';
			controlVar1HTML += '<select ' + readOnlyAttribute + ' class="structSelectInput controlVar1 browser-default" id="control_var_1_col_' + colCount + '">';
			controlVar1HTML += '<option value="default" disabled>-- Choose --</option>';		
			for(key in ListOfListsArray) {			
				controlVar1HTML += '<option value="' + ListOfListsArray[key].value + '">' + ListOfListsArray[key].label + '</option>';
			}
			controlVar1HTML += '</select>';
			controlVar1HTML += '</div>';
			controlVariablesRowHTML += controlVar1HTML;

			$("#control_variables_container_" + colCount).html(controlVariablesRowHTML);
			break;
			
		case "table":
			controlVar1HTML += '<div class="col s3">';
			controlVar1HTML += '<label>Control Variable 1</label>';
			controlVar1HTML += '<select ' + readOnlyAttribute + ' class="structSelectInput controlVar1 browser-default" id="control_var_1_col_' + colCount + '">';
			controlVar1HTML += '<option value="none" disabled>-- Choose --</option>';		
			for(key in MatchupTablesArray) {			
				(!MatchupTablesArray[key].IsReferenceTable) ? controlVar1HTML += '<option value="' + MatchupTablesArray[key].MatchupTableGUID + '">' + MatchupTablesArray[key].MatchupTableName + '</option>' : false;
			}
			controlVar1HTML += '</select>';
			controlVar1HTML += '</div>';
			controlVariablesRowHTML += controlVar1HTML;

			$("#control_variables_container_" + colCount).html(controlVariablesRowHTML);
			break;
			
		case "ref":
			controlVar1HTML += '<div class="col s3">';
			controlVar1HTML += '<label>Control Variable 1</label>';
			controlVar1HTML += '<select ' + readOnlyAttribute + ' class="structSelectInput controlVar1 browser-default" id="control_var_1_col_' + colCount + '">';
			controlVar1HTML += '<option value="none" disabled>-- Choose --</option>';		
			for(key in MatchupTablesArray) {
				(MatchupTablesArray[key].IsReferenceTable) ? controlVar1HTML += '<option value="' + MatchupTablesArray[key].MatchupTableGUID + '">' + MatchupTablesArray[key].MatchupTableName + '</option>' : false;
			}
			controlVar1HTML += '</select>';
			controlVar1HTML += '</div>';
			
			controlVar1HTML += '<div class="col s3">';
			controlVar1HTML += '<label>Control Variable 2</label>';
			controlVar1HTML += '<select disabled class="structSelectInput controlVar2 browser-default" id="control_var_2_col_' + colCount + '">';
			controlVar1HTML += '<option value="none" disabled>-- Choose --</option>';
			controlVar1HTML += '</select>';
			controlVar1HTML += '</div>';
			
			controlVar1HTML += '<div class="col s3">';
			controlVar1HTML += '<label>Control Variable 3</label>';
			controlVar1HTML += '<select disabled class="structSelectInput controlVar3 browser-default" id="control_var_3_col_' + colCount + '">';
			controlVar1HTML += '<option value="none" disabled>-- Choose --</option>';
			controlVar1HTML += '</select>';
			controlVar1HTML += '</div>';
			controlVariablesRowHTML += controlVar1HTML;

			$("#control_variables_container_" + colCount).html(controlVariablesRowHTML);
			
			$("#control_var_1_col_" + colCount).unbind("change");
			$("#control_var_1_col_" + colCount).on("change", function() {
				var element	= $(this);
				var value	= element.val();
				
				$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"MatchupTableGUID = '" + value + "'\"", function( elements ) {
					var primaryKey = elements[0].ControlVariable2;
					var displayCol = elements[0].ControlVariable3;
					
					var jsonData = {
						 "query": btoa(elements[0].ControlVariable1)
					};
					
					$.ajax ({
						headers: {
							"Content-Type": "application/json"
						},
						url: ruIP + ruPort + listsDB + listEN + 'runQuery',
						type: "POST",
						data: JSON.stringify(jsonData),
						success: function(columns){
							$("#control_var_2_col_" + colCount).html('<option value="none" disabled>-- Choose --</option>');
							$("#control_var_3_col_" + colCount).html('<option value="none" disabled>-- Choose --</option>');
							
							for(key in columns[0]) {
								$("#control_var_2_col_" + colCount).append('<option value="' + key + '">' + key + '</option>');
								$("#control_var_3_col_" + colCount).append('<option value="' + key + '">' + key + '</option>');
							}
							
							(primaryKey) ? $("#control_var_2_col_" + colCount).val(primaryKey) : false;
							(displayCol) ? $("#control_var_3_col_" + colCount).val(displayCol) : false;
						}
					});
				});
			});
			
			setTimeout(function() {
				$("#control_var_1_col_" + colCount).change();
			},250);
			
			break;
			
		/*case "checkbox":
			controlVar1HTML += '<p>';
			controlVar1HTML += '<input type="checkbox" id="control_var_1_col_' + colCount + '" />';
			controlVar1HTML += '<label for="control_var_1_col_' + colCount + '">Control Variable 1</label>';
			controlVar1HTML += '</p>';
			controlVariablesRowHTML += controlVar1HTML;

			$("#control_variables_container_" + colCount).html(controlVariablesRowHTML);
			break;
			
		case "switch":
			controlVar1HTML += '<div class="switch">';
			controlVar1HTML += '<label>Off';
			controlVar1HTML += '<input type="checkbox" id="control_var_1_col_' + colCount + '" />';			
			controlVar1HTML += '<span class="lever"></span>';
			controlVar1HTML += 'On<label>';
			controlVar1HTML += '<label for="control_var_1_col_' + colCount + '">Control Variable 1</label>';
			controlVar1HTML += '</div>';
			controlVariablesRowHTML += controlVar1HTML;

			$("#control_variables_container_" + colCount).html(controlVariablesRowHTML);
			break;	 */		
			
		case "auto":
			controlVar1HTML += '<div class="col s3">';
			controlVar1HTML += '<label>Control Variable 1</label>';
			controlVar1HTML += '<select ' + readOnlyAttribute + ' class="structSelectInput controlVar1 browser-default" id="control_var_1_col_' + colCount + '">';
			controlVar1HTML += '<option value="none" disabled>-- Choose --</option>';
			
			var elColName	= $("#column_name_col_" + colCount).val();
			var elTableName	= $("#table_structure_header").html();
			
			$(".columnNameStruct").each(function(index) {
				var colName			= $(this).val();
				var variableString	= "Column: " + colName;
				
				
				if(colName == elColName) {
					variableString = "Table: " + elTableName;
				}
				
				controlVar1HTML += '<option value="' + variableString + '">' + variableString + '</option>';
			});

			controlVar1HTML += '</select>';
			controlVar1HTML += '</div>';
			controlVariablesRowHTML += controlVar1HTML;

			$("#control_variables_container_" + colCount).html(controlVariablesRowHTML);
			break;
			
		default:
			$("#control_variables_container_" + colCount).html("");
			break;	
	}
}