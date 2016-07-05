/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			toggle_screen.js
=============================================================*/

var sqlToggleActive		= false;
var validTableSelected	= false;

$(document).ready(function() {
	gridLoaded = true;
	LoadMatchupTables();
	$("#table_tabs").tabs()
	
	$("#table_structure_header_tab1").on("click", function(){
		if(!$("#table_structure_header_tab1").hasClass("active") && validTableSelected) {
			LoadTableStructureHTML();
			$('#jqxgrid').jqxGrid('destroy');
			$('#jqxgrid2').jqxGrid('destroy');
		}
	});
	
	$("#table_structure_header_tab2").on("click", function(){
		if(columnCount > 0) {
			if(!$("#table_structure_header_tab2").hasClass("active") && validTableSelected) {
				LoadCreateRecordsHTML();
			}
		}
		else {
			setTimeout(function() {
				$("#table_structure_header_tab1").click();
			}, 300);
		}
	});
});

function LoadTableStructureHTML(url) {
	
	var formCode	= document.getElementById("table_form_receiver");
	sqlToggleActive	= false;
	
	formCode.innerHTML	= '<div id="table_structure_input"></div>'
						+ '<div id="add_column_container">'
							+ '<div style="margin-right:8px" id="table_structure_add_button" class="structureBtn waves-effect waves-light btn green"><i class="material-icons">add</i></div>'
							+ '<div id="table_structure_upload_button" class="structureBtn waves-effect waves-light btn indigo lighten-2"><i class="material-icons">backup</i></div>'
							+ '<div style="margin-left:8px" id="table_structure_lock_button" class="structureBtn waves-effect waves-light btn purple lighten-2 right"><i class="material-icons">lock_outline</i></div>'
							+ '<div class="right"><div><input class="matchupTableRB with-gap" name="tableType" type="radio" id="matchup_table_rb" checked="checked"><label for="matchup_table_rb">Matchup-Table</label></div><div><input class="with-gap referenceTableRB" name="tableType" type="radio" id="reference_table_rb"><label for="reference_table_rb">Reference-Table (SQL)</label></div></div>'
						+ '</div>';
	
	if(!gridLoaded) {
		LoadMatchupTables();
	}
	
	var loadURL = ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"IsActive = '1' AND MatchupTableGUID = '" + matchupTableGUID + "' ORDER By Ordinal ASC\"";
	//LoadGrid(loadURL);

	if(gridLoaded) {
		LoadColumnStructures(loadURL);
	}
	
	gridLoaded = true;
	
	$("#table_structure_add_button").unbind("click");
	$("#table_structure_add_button").on("click", function() {
		if(!(tableIsLocked && sqlToggleActive)) {
			cancelClass = "deleteActive";
			newColumns++;
			AppendColumnToStructure();
			$("#table_structure_upload_button").removeClass("disabled");
			canUpload = true;
		}
	});
	
	$("#table_structure_upload_button").unbind("click");
	$("#table_structure_upload_button").on("click", function() {
		if(canUpload) {
			UploadNewColumns();
		}
	});
	
	$("#matchup_table_rb").unbind("change");
	$("#matchup_table_rb").change(function() {
		var element = $(this);
		
		if(element.is(':checked')) {
			isRefTable = false;
			LoadTableStructureHTML();
			$("#table_structure_sql_toggle").removeClass("disabled");
			$("#table_structure_add_button").removeClass("disabled");
			$("#table_structure_upload_button").addClass("disabled");
			canUpload = false;
		}
	});
	
	$("#reference_table_rb").unbind("change");
	$("#reference_table_rb").change(function() {
		var element = $(this);
		
		if(element.is(':checked')) {
			isRefTable = true;
			AppendSQLColumnToStructure();
			$("#table_structure_sql_toggle").removeClass("disabled");
			$("#table_structure_add_button").addClass("disabled");
			$("#table_structure_upload_button").removeClass("disabled");
			canUpload = true;
		}
	});
	
	$("#table_structure_lock_button").unbind("click");
	$("#table_structure_lock_button").on("click", function() {
		if(!tableIsLocked) {			
			if(newColumns > 0 || canUpload) {
				DisplayAlert("Success","Changes have been made to the current table structure.  Saving the changes is required before locking the table.");
			}
			else {
				DisplayConfirm("Confirmar!", "Are you sure you want to lock the selected table? This action can not be undone.",					
					function() {
						LockSelectedTable($("#matchup_table_tree").jqxTree('getSelectedItem'));
					}
				);
			}
		}
	});
	
	if(url) {
		LoadColumnStructures(loadURL);
	}

	//$(window).resize();
}

function LoadCreateRecordsHTML() {
	var formCode = document.getElementById("table_form_receiver");
	var tableName = $("#matchup_table_tree").jqxTree('getSelectedItem').label;
	
	formCode.innerHTML = '<div id="generatedForm"></div>';

	loadForm(UserData[0].SiteGUID, tableName);
}


