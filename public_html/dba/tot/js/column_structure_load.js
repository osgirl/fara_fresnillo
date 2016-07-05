/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			column_structure_load.js
=============================================================*/

function LoadColumnStructures(url) {
	MatchupTableElementsArray = [];

	var jqxhrMatchupTableElementsArr = $.getJSON(url, function() {
		var matchupTablesData = jQuery.parseJSON(jqxhrMatchupTableElementsArr.responseText);
		var colNum = 1;

		$("#table_structure_input").html("");
		columnCount = 0;
		newColumns = 0;
		
		$("#table_structure_upload_button").addClass("disabled");
		canUpload = false;
		$("#matchup_table_rb").attr("disabled", false);
		$("#reference_table_rb").attr("disabled", false);

		for(var key in matchupTablesData) {
			if(matchupTablesData[key].ElementControlType == "query") {
				isRefTable = true;
				AppendSQLColumnToStructure();
			}
			else {
				isRefTable = false;
				AppendColumnToStructure();
			}
			
			if(matchupTablesData[key].MatchupTableElementGUID != null) {
				$("#row_container_" + colNum).attr("TableElementGUID",matchupTablesData[key].MatchupTableElementGUID);
			}
			if(matchupTablesData[key].MatchupTableElementName != null) {
				$("#column_name_col_" + colNum).val(matchupTablesData[key].MatchupTableElementName);
			}
			if(matchupTablesData[key].ElementControlType != null) {
				$("#control_col_" + colNum).val(matchupTablesData[key].ElementControlType);
			}
			if(matchupTablesData[key].ElementDataType != null) {
				$("#datatype_col_" + colNum).val(matchupTablesData[key].ElementDataType);
			}
			if(matchupTablesData[key].ControlVariable1 != null) {
				$("#control_col_" + colNum).change();
				$("#control_var_1_col_" + colNum).val(matchupTablesData[key].ControlVariable1);
				
				if($("#control_var_1_col_" + colNum).hasClass("structSelectInput")) {
				}
			}
			if(matchupTablesData[key].ControlVariable2 != null) {
				if(matchupTablesData[key].ElementControlType == "query") {
					generateColumnsFromQuery(matchupTablesData[key].ControlVariable1, matchupTablesData[key].ControlVariable2, matchupTablesData[key].ControlVariable3);
				}
				else {
					$("#control_var_2_col_" + colNum).val(matchupTablesData[key].ControlVariable2);
					
					if($("#control_var_2_col_" + colNum).hasClass("structSelectInput")) {
					}
				}
			}
			if(matchupTablesData[key].ControlVariable3 != null) {
				$("#control_var_3_col_" + colNum).val(matchupTablesData[key].ControlVariable3);
				
				if($("#control_var_3_col_" + colNum).hasClass("structSelectInput")) {
				}
			}
			colNum++;
			$("#matchup_table_rb").attr("disabled", true);
			$("#reference_table_rb").attr("disabled", true);
		}
		
		if(tableIsLocked) {
			$("#table_structure_lock_button").removeClass("disabled");
			$("#table_structure_add_button").addClass("disabled");
		}
		else {
			$("#table_structure_lock_button").removeClass("disabled");
			$("#table_structure_add_button").removeClass("disabled");
		}

		if(!$("#matchup_table_rb").attr("disabled")) {
			if(isRefTable) {
				$("#table_structure_sql_toggle").removeClass("disabled");
				$("#table_structure_add_button").addClass("disabled");
			}
			else {
				$("#table_structure_sql_toggle").removeClass("disabled");
			}
		}
		else {
			if(isRefTable) {
				$("#table_structure_sql_toggle").removeClass("disabled");
				$("#table_structure_add_button").addClass("disabled");
				$("#reference_table_rb").prop("checked","checked");
			}
			else {
				$("#table_structure_sql_toggle").addClass("disabled");
				$("#matchup_table_rb").prop("checked","checked");
			}
		}
		if(isRefTable) {
			$("#reference_table_rb").prop("checked","checked");
		}
		else {
			$("#matchup_table_rb").prop("checked","checked");
		}
		
		if(columnCount == 0) {
			$("#table_structure_add_button").click();
		}
	});
}