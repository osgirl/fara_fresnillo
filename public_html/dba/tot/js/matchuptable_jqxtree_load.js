/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			matchuptable_jqxtree_load.js
=============================================================*/

var initialLoad		= false;
var gridLoaded		= false;
var tableIsLocked	= false;
var isRefTable		= false;
var mustMaterialize	= false;
var targetSchema	= "";
var targetTable		= "";
var targetTableGUID	= "";
var targetDB		= "";
var canToggleSQL	= true;
var currTableGroup	= '';
var currTableDesc	= '';
var matchupTblTree	= [];

$(document).ready(function() {
	$('.modal-trigger').leanModal();
	
	$(document).keydown(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13' && $("#table_name_input").is(":focus")) {
			$("#table_list_add_button").click();
		}
		if(keycode == '46' && $("#matchup_table_tree").is(":focus")) {
			$("#table_list_remove_button").click();
		}
	});
	
	$("#table_list_add_button").on("click", function() {
		var newEntry = $.trim($("#table_name_input").val());
		var entryExists = false;
		var validEntry = true;
		
		for(var key in MatchupTablesArray) {
			if(newEntry.toUpperCase() == MatchupTablesArray[key].MatchupTableName.toUpperCase()) {
				entryExists = true;
			}
		}	
		
		if(entryExists) {
			DisplayAlert("Alert!",newEntry + " Already exists in the database.");
			validEntry = false;
		}
		else if(newEntry == "") {
			DisplayAlert("Alert!","You have not entered a valid list name.");
			validEntry = false;
		}
		else if(newEntry.indexOf(' ') >= 0) {
			DisplayAlert("Alert!",'List names may not contain any spaces.');
			validEntry = false;
		}
		
		if(validEntry) {
			$("#table_description_header").html(newEntry + " Details");
			$("#table_description_input").val("");
			$("#table_description_span").html("Give <span class='red-text lighten-3'>"+newEntry+"</span> a description, or leave it blank if not applicable.");
			$("#table_group_span").html("Select the table group you want to assign <span class='red-text lighten-3'>"+newEntry+"</span>, or leave it blank if not applicable.");					
			$("#table_cancel_span").html("To cancel creating <span class='red-text lighten-3'>"+newEntry+"</span> click cancel.");
			$("#submit_table").attr("onclick","TableModalTrigger('submit')");
			
			$('#table_description_modal').openModal();
		}		
	});
	
	$("#must_materialize").on("change", function() {
		var value = $("#must_materialize").prop("checked");
		
		(value) ? $("#materialize_form").show() : $("#materialize_form").hide();
	});
	
	$("#table_list_edit_button").on("click", function() {
		var selectedItem	= $('#matchup_table_tree').jqxTree('getSelectedItem');
		var entry			= selectedItem.label;
		
		$("#table_description_header").html(entry + " Details");
		$("#table_group_select").val(currTableGroup);
		$("#table_description_input").val(currTableDesc);
		
		$("#must_materialize").prop("checked",mustMaterialize);
		$("#target_schema").val(targetSchema);
		$("#target_table").val(targetTable);
		$("#target_database").val(targetDB);
		$("#must_materialize").change();
		
		$("#table_description_span").html("Give <span class='red-text lighten-3'>"+entry+"</span> a description, or leave it blank if not applicable.");
		$("#table_group_span").html("Select the table group you want to assign <span class='red-text lighten-3'>"+entry+"</span>, or leave it blank if not applicable.");					
		$("#table_cancel_span").html("To cancel editing <span class='red-text lighten-3'>"+entry+"</span> click cancel.");
		$("#submit_table").attr("onclick","TableModalTrigger('edit')");
		
		$('#table_description_modal').openModal();
	});
	
	$("#table_list_remove_button").on("click", function() {
		var elementIsLocked = false;
		
		if(!(!$("#matchup_table_tree").jqxTree('getSelectedItem'))) {
			var entryToDelete = $("#matchup_table_tree").jqxTree('getSelectedItem');
			
			for(var key in MatchupTablesArray) {
				if(entryToDelete.label == MatchupTablesArray[key].MatchupTableName && MatchupTablesArray[key].IsLocked) {
					elementIsLocked = true;
				}
			}
			
			if(!elementIsLocked) {
				if(entryToDelete.value) {
					DisplayConfirm("Confirmar!", "Are you sure you want to delete this item?",
						function() {
							$("#matchup_table_tree").jqxTree('removeItem', entryToDelete ); 
							DeleteTableMatchup(entryToDelete);
						}
					);
				}
			}
			else {
				DisplayAlert("Alert!","You can not remove a locked table.");
			}
		}
	});
});

function TableModalTrigger(action) {
	
	switch(action) {
		case "submit":
			var newEntry		= $.trim($("#table_name_input").val());
			var description		= $.trim($("#table_description_input").val());
			var tableGroup		= $.trim($("#table_group_select").val());
			var mustMaterialize	= $("#must_materialize").prop("checked");
			var targetSchema	= $.trim($("#target_schema").val());
			var targetTable		= $.trim($("#target_table").val());
			var targetDB		= $.trim($("#target_database").val());
			
			LoadNewTableMatchup(newEntry, description, tableGroup, mustMaterialize, targetSchema, targetTable, targetDB);
			break;
			
		case "edit":
			var description	= $.trim($("#table_description_input").val());
			var tableGroup	= $.trim($("#table_group_select").val());
			var mustMaterialize	= $("#must_materialize").prop("checked");
			var targetSchema	= $.trim($("#target_schema").val());
			var targetTable		= $.trim($("#target_table").val());
			var targetDB		= $.trim($("#target_database").val());
			
			EditTableMatchup(description, tableGroup, mustMaterialize, targetSchema, targetTable, targetDB);
			break;
		
		case "cancel":
			break;
	}
}

function RemoveTableFromList() {
	var elementIsLocked = false;
	
	if(!(!$("#matchup_table_tree").jqxTree('getSelectedItem'))) {
		var entryToDelete = $("#matchup_table_tree").jqxTree('getSelectedItem');
		
		for(var key in MatchupTablesArray) {
			if(entryToDelete.label == MatchupTablesArray[key].MatchupTableName && MatchupTablesArray[key].IsLocked) {
				elementIsLocked = true;
			}
		}
		
		if(!elementIsLocked) {
			DisplayConfirm("Confirmar!", "Are you sure you want to delete this item?",
				function() {
					$("#matchup_table_tree").jqxTree('removeItem', entryToDelete ); 
					DeleteTableMatchup(entryToDelete);
				}
			);
		}
		else {
			DisplayAlert("Alert!","You can not remove a locked table.");
		}
	}	
}

function LoadMatchupTablesListBox(selectedIndex) {
	var jqxhrTREE = $.getJSON(ruIP + ruPort + listsDB + listEN + "readtree/" + UserData[0].SiteGUID + "/dbo/MatchupTables/TableGroup?where=\"IsActive = '1' AND IsList = '0' AND SiteGUID = '"+ UserData[0].SiteGUID +"'\"", function() {
		matchupTblTree = jQuery.parseJSON(jqxhrTREE.responseText);
		
		for(var key in matchupTblTree) {
			for(var item in matchupTblTree[key].items) {
				matchupTblTree[key].items[item].icon = "../images/" + matchupTblTree[key].items[item].icon;				
			}
		}
		
		$('#table_group_select').html('<option value="" disabled selected>-- Choose --</option>');
		var tableGroupSelect = document.getElementById('table_group_select');			
		
		for(var key in tableGroupsArray) {
			tableGroupSelect.options[tableGroupSelect.options.length] = new Option(tableGroupsArray[key].SYS_TableGroups, tableGroupsArray[key].TableRecordGUID);
		}
	
		$('#matchup_table_tree').jqxTree('destroy');

		if($("#matchup_table_tree").length == 0) {
			$("#listbox_container").append("<div id='matchup_table_tree'></div>");
		}
		
		// Create a jqxTree
		$("#matchup_table_tree").jqxTree({ source: matchupTblTree, width: '100%', height: '100%', incrementalSearch: true });
		
		if(!initialLoad) {
			setTimeout(function(){
				$("#matchup_table_tree").jqxTree('selectItem', $("#matchup_table_tree").find('li:first')[0]);
				initialLoad = true;
			}, 100);
		}

		if(selectedIndex) {
			setTimeout(function(){
				$("#matchup_table_tree").jqxTree('selectItem', $("#matchup_table_tree").find('li:first')[selectedIndex]);
			}, 100);
		}
		
		$('#matchup_table_tree').on('select', function (event) {
			var args = event.args;
			if (args) {
				var item	= $("#matchup_table_tree").jqxTree('getItem', args.element);
				var value	= item.value;
				
				if(value) {
					var label		= item.label;
					var value		= item.value;
					
					RecordGUID = "";
					
					$("#table_description").html("Description: Table Group");

					for(key in MatchupTablesArray) {					
						if(label == MatchupTablesArray[key].MatchupTableName) {
							tableIsLocked	= MatchupTablesArray[key].IsLocked;
							isRefTable		= MatchupTablesArray[key].IsReferenceTable;
							currTableGroup	= MatchupTablesArray[key].TableGroup;
							currTableDesc	= MatchupTablesArray[key].Description;
							mustMaterialize	= MatchupTablesArray[key].MustMaterialize;
							targetSchema	= MatchupTablesArray[key].TargetSchema;
							targetTable		= MatchupTablesArray[key].TargetTable;
							targetDB		= MatchupTablesArray[key].TargetDB;
							targetTableGUID	= MatchupTablesArray[key].MatchupTableGUID;
							(MatchupTablesArray[key].Description) ? $("#table_description").html("Description: " + MatchupTablesArray[key].Description) : $("#table_description").html("Description: ");		
						}
					}
					
					matchupTableGUID = value;
					$("#table_structure_header").html(label);
					$("#table_structure_link").html('<a href="' +  ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/" + label + '" target="_blank">View JSON for '+label+'</a>');								
					
					if(gridLoaded) {
						if($("#table_structure_header_tab1").hasClass("active")) {
							var loadURL = ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"IsActive = '1' AND MatchupTableGUID = '" + matchupTableGUID + "' ORDER BY Ordinal ASC\"";
							//LoadGrid(loadURL);
							
							if(validTableSelected) {
								LoadColumnStructures(loadURL);
							}
							else {
								LoadTableStructureHTML(loadURL);
							}
							
							validTableSelected = true;
						}
						else if($("#table_structure_header_tab2").hasClass("active")) {
							loadForm(UserData[0].SiteGUID, label);
						}
					}
				}
				else {
					validTableSelected = false;
					$("#table_form_receiver").html("Please select a table from the Matchup Tables List");
				}
			}
		});
		
		$('#matchup_table_tree').jqxTree('collapseAll');
	});
}

function LoadNewTableMatchup(newEntry, description, tableGroup, mustMaterialize, targetSchema, targetTable, targetDB) {
	
	var newList					= {};
	newList.SiteGUID			= UserData[0].SiteGUID;
	newList.MatchupTableName	= newEntry;
	newList.CreatedByGUID		= UserData[0].PersonGUID;
	newList.Description			= description;
	newList.TableGroup			= tableGroup;
	newList.Modified			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	newList.IsLocked			= false;
	newList.IsReferenceTable	= false;
	newList.Icon				= "unlock_icon.png";
	newList.MustMaterialize		= mustMaterialize;
	newList.TargetSchema		= targetSchema;
	newList.TargetTable			= targetTable;
	newList.TargetDB			= targetDB;
	
	var jsonData = {
		 "fields": newList
	};
	
	jQuery.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/dbo/MatchupTables",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			var listLength = $("#matchup_table_tree").jqxTree('getItems').length;
			LoadMatchupTables(listLength);
			$("#add_table_input input").val("");
		}
	});
}

function EditTableMatchup(description, tableGroup, mustMaterialize, targetSchema, targetTable, targetDB) {
	var selectedItem		= $('#matchup_table_tree').jqxTree('getSelectedItem');
	var matchupTableGUid	= selectedItem.value;	
	
	var jsonData = {
		"key": { "MatchupTableGUID": matchupTableGUid},
		"fields": { "Description":description, "TableGroup":tableGroup, "MustMaterialize":mustMaterialize, "TargetSchema":targetSchema, "TargetTable":targetTable, "TargetDB":targetDB }
	};

	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "update/dbo/MatchupTables",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			var listLength = $("#matchup_table_tree").jqxTree('getItems').length;
			LoadMatchupTables(listLength);
		}
	});
	
}

function UpdateMatchupTable(matchupTableGuid) {
	if(matchupTableGuid) {
		var jqxhrMatchupTable = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"MatchupTableGUID = '"+ matchupTableGuid +"'\"", function() {			
			var matchupTableData = jQuery.parseJSON(jqxhrMatchupTable.responseText);
			var iconString = "sql_icon.png";
			
			if(matchupTableData[0].IsSystemTable) {
				iconString = "sql_active_icon.png";
			}
			
			var jsonData = {
				"key": { "MatchupTableGUID": matchupTableGuid },
				"fields": { "IsReferenceTable":"true", "Icon":iconString }
			};
			
			jQuery.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + listsDB + listEN + "update/dbo/MatchupTables",
				type: "POST",
				data: JSON.stringify(jsonData),
				success: function(){
					LoadMatchupTables($("#matchup_table_tree").jqxTree('getSelectedItem'));
				}
			});
		});
	}
	else {
		DisplayAlert("Alert!", "The MatchupTableGUID was undefined.  Could not proceed with update.");
	}
}

function LockSelectedTable(newEntry) {
	if(newEntry.value) {
		var jqxhrMatchupTable = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"MatchupTableGUID = '"+ newEntry.value +"'\"", function() {			
			var matchupTableData = jQuery.parseJSON(jqxhrMatchupTable.responseText);
			var iconString = "lock_icon.png";
			
			if(matchupTableData[0].IsReferenceTable) {
				iconString = "sql_inactive_icon.png";
			}
		
			var jsonData = {
				"key": { "MatchupTableGUID": newEntry.value },
				"fields": { "IsLocked":"true", "Icon":iconString }
			};
			
			jQuery.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + listsDB + listEN + "update/dbo/MatchupTables",
				type: "POST",
				data: JSON.stringify(jsonData),
				success: function(){
					LoadMatchupTables($("#matchup_table_tree").jqxTree('getSelectedItem'));			
					$("#table_structure_lock_button").removeClass("disabled");
					$("#table_structure_add_button").addClass("disabled");
				}
			});
		});
	}
	else {
		DisplayAlert("Alert!", "The MatchupTableGUID was undefined.  Could not proceed with update.");
	}
}

function DeleteTableMatchup(newEntry) {	
	if(newEntry.value) {
		var jsonData = {
			"key": { "MatchupTableGUID": newEntry.value },
			"fields": { "IsActive":"false" }
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "update/dbo/MatchupTables",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				LoadMatchupTables();
			}
		});
	}
	else {
		DisplayAlert("Alert!", "The MatchupTableGUID was undefined.  Could not proceed with update.");
	}
}









