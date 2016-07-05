/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			column_structure_load.js
=============================================================*/

var matchupTableSettingsData = [];

function LoadColumnStructures(url) {

	var jqxhrMatchupTableElementsArr = $.getJSON(url, function() {
		var matchupTablesData = jQuery.parseJSON(jqxhrMatchupTableElementsArr.responseText);
		
		var jqxhrMatchupTableSettingsArr = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/FormStructureRecordings?where=\"FormStructureGUID = '"+matchupTableGUID+"'\"", function() {
			matchupTableSettingsData = jQuery.parseJSON(jqxhrMatchupTableSettingsArr.responseText);

			var colNum		= 1;
			var settingsNum	= 1;
			
			$("#table_structure_input").html("");
			columnCount		= 0;
			settingsCount	= 0;
			columnSpace		= "";
			
			$("#table_structure_upload_button").addClass("disabled");
			canUpload = false;
			
			if(matchupTablesData.length > 0) {
				for(var key in FormStructuresArray) {

					if(matchupTablesData[0].FormStructureGUID == FormStructuresArray[key].FormStructureGUID) {
						var isChecked = false;
						
						if(FormStructuresArray[key].SystemForm == "true") {
							isChecked = true;
						}

						$("#system_form").prop("checked", isChecked);
					}
				}
			}
			
			for(var key in matchupTablesData) {
				AppendColumnToStructure(false);
				
				if(matchupTablesData[key].TableRecordGUID != null) {
					$("#row_container_" + colNum).attr("TableRecordGUID",matchupTablesData[key].TableRecordGUID);
				}if(matchupTablesData[key].FormStructureElementGUID != null) {
					$("#row_container_" + colNum).attr("TableElementGUID",matchupTablesData[key].FormStructureElementGUID);
				}
				if(matchupTablesData[key].FormStructureElementName != null) {
					$("#column_name_col_" + colNum).val(matchupTablesData[key].FormStructureElementName);
				}
				if(matchupTablesData[key].ElementControlType != null) {
					$("#control_col_" + colNum).val(matchupTablesData[key].ElementControlType);
					$("#control_col_" + colNum).material_select('destroy');
					$("#control_col_" + colNum).material_select();
				}
				if(matchupTablesData[key].ControlVariable1 != null) {
					$("#control_col_" + colNum).change();
					$("#control_var_1_col_" + colNum).val(matchupTablesData[key].ControlVariable1);
					
					if($("#control_var_1_col_" + colNum).hasClass("structSelectInput")) {
						$("#control_var_1_col_" + colNum).material_select('destroy');
						$("#control_var_1_col_" + colNum).material_select();
					}
				}
				if(matchupTablesData[key].ControlVariable2 != null) {
					PopulateTableColumns($("#control_var_1_col_" + colNum), colNum, matchupTablesData[key].ControlVariable2);
				}
				colNum++;
			}
			
			for(var key in matchupTableSettingsData) {
				AppendSettingToStructure();				
				
				$("#settings_select_" + settingsNum).attr("TableRecordGUID", matchupTableSettingsData[key].TableRecordGUID);
				$("#settings_select_" + settingsNum).val(matchupTableSettingsData[key].EventRecording);
				$("#settings_select_" + settingsNum).material_select('destroy');
				$("#settings_select_" + settingsNum).material_select();
				
				settingsNum++;
			}
			
			if(columnCount == 0) {
				$("#table_structure_add_button").click();
			}
			else {
				ServiceComplete();
			}
		});
	});
}