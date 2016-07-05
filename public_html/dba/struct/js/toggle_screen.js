/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			toggle_screen.js
=============================================================*/

var sqlToggleActive		= false;
var validTableSelected	= false;
var canRemoveSetting	= false;

$(document).ready(function() {
	gridLoaded = true;
	LoadMatchupTables();	
});

function LoadTableStructureHTML(url) {
	
	var formCode		= document.getElementById("table_form_receiver");
	var settingsCode	= document.getElementById("table_settings_receiver");
	
	sqlToggleActive	= false;
	
	formCode.innerHTML		= '<div id="table_structure_input"></div>'
							+ '<div id="add_column_container">'
								+ '<div style="margin-right:8px" id="table_structure_add_button" class="structureBtn waves-effect waves-light btn green"><i class="material-icons">add</i></div>'
								+ '<div id="table_structure_upload_button" class="structureBtn waves-effect waves-light btn indigo lighten-2"><i class="material-icons">backup</i></div>'
								+ '<div class="right" style="padding:2px">System Option Form<div style="margin-left:16px" class="switch"><label>No<input id="system_form" type="checkbox"><span class="lever"></span>Yes</label></div></div>'
							+ '</div>';
						
	settingsCode.innerHTML	= '<div id="table_settings_container" class="row">'
								+ '<form class="col s12">'
									+ '<div class="row" id="table_settings_input">'
									+ '</div>'
									+ '<div id="add_setting_container">'
										+ '<div style="margin-right:8px" id="table_setting_add_button" class="settingBtn waves-effect waves-light btn green"><i class="material-icons">add</i></div>'
										+ '<div id="table_setting_remove_button" class="disabled settingBtn waves-effect waves-light btn red"><i class="material-icons">delete</i></div>'
									+ '</div>';
								+ '</form>'
							+ '</div>';
	
	var loadURL = ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/FormStructureElements";
	//LoadGrid(loadURL);

	if(gridLoaded) {
		if(url) {
			loadURL = url;
		}
		LoadColumnStructures(loadURL);
	}
	else {		
		LoadMatchupTables();
	}
	
	gridLoaded = true;
	
	$("#table_structure_add_button").unbind("click");
	$("#table_structure_add_button").on("click", function() {
		AppendColumnToStructure(true);
		$("#table_structure_upload_button").removeClass("disabled");
		canUpload = true;
	});
	
	$("#table_structure_upload_button").unbind("click");
	$("#table_structure_upload_button").on("click", function() {
		if(canUpload) {
			LockForService();
			UploadNewColumns();
		}
	});
	
	$("#matchup_table_rb").unbind("change");
	$("#matchup_table_rb").change(function() {
		var element = $(this);
		
		if(element.is(':checked')) {
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
			AppendSQLColumnToStructure();
			$("#table_structure_sql_toggle").removeClass("disabled");
			$("#table_structure_add_button").addClass("disabled");
			$("#table_structure_upload_button").removeClass("disabled");
			canUpload = true;
		}
	});
	
	$("#table_structure_lock_button").unbind("click");
	$("#table_structure_lock_button").on("click", function() {		
		if(canUpload) {
			DisplayAlert("Success","Changes have been made to the current table structure.  Saving the changes is required before locking the table.");
		}
		else {
			DisplayConfirm("Confirmar!", "Are you sure you want to lock the selected table? This action can not be undone.",					
				function() {
					LockSelectedTable($("#form_struct_tree").jqxTree('getSelectedItem'));
				}
			);
		}
	});
	
	$("#system_form").unbind("change");
	$("#system_form").on("change", function() {
		$("#table_structure_upload_button").removeClass("disabled");
		canUpload = true;
	});
	
	$("#table_setting_add_button").unbind("click");
	$("#table_setting_add_button").on("click", function() {
		AppendSettingToStructure();
		$("#table_structure_upload_button").removeClass("disabled");
		canUpload = true;
	});
	
	$("#table_setting_remove_button").unbind("click");
	$("#table_setting_remove_button").on("click", function() {
		if(canRemoveSetting) {
			RemoveSetting();
			$("#table_structure_upload_button").removeClass("disabled");
		}
	});
}

function LoadCreateRecordsHTML() {
	var formCode = document.getElementById("table_form_receiver");
	var tableName = $("#form_struct_tree").jqxTree('getSelectedItem').label;
	
	formCode.innerHTML = '<div id="generatedForm"></div>';

	loadForm(UserData[0].SiteGUID, tableName);
}