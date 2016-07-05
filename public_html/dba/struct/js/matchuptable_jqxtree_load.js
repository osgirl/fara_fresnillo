/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			matchuptable_jqxtree_load.js
=============================================================*/

var initialLoad			= false;
var gridLoaded			= false;
var canToggleSQL		= true;

$(document).ready(function() {
	$('.modal-trigger').leanModal();
	
	$("#table_list_add_button").on("click", function() {
		var newEntry = $.trim($("#table_name_input").val());
		var entryExists = false;
		var validEntry = true;
		
		for(var key in FormStructuresArray) {
			if(newEntry.toUpperCase() == FormStructuresArray[key].FormStructureName.toUpperCase()) {
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
			$("#table_description_span").html("Give <span class='red-text lighten-3'>"+newEntry+"</span> a description, or leave it blank if not applicable.");
			$("#table_group_span").html("Select the table group you want to assign <span class='red-text lighten-3'>"+newEntry+"</span>, or leave it blank if not applicable.");					
			$("#table_cancel_span").html("To cancel creating <span class='red-text lighten-3'>"+newEntry+"</span> click cancel.");
			
			$('#table_description_modal').openModal();
		}		
	});
	
	$("#table_list_remove_button").on("click", function() {
		
		if(!(!$("#form_struct_tree").jqxTree('getSelectedItem'))) {
			var entryToDelete = $("#form_struct_tree").jqxTree('getSelectedItem');
			
			if(entryToDelete.value) {
				DisplayConfirm("Confirmar!", "Are you sure you want to delete this item?",
					function() {
						$("#form_struct_tree").jqxTree('removeItem', entryToDelete ); 
						DeleteTableMatchup(entryToDelete);
					}
				);
			}
		}
	});
});

function TableModalTrigger(action) {
	
	switch(action) {
		case "submit":
			var newEntry	= $.trim($("#table_name_input").val());
			var description	= $.trim($("#table_description_input").val());
			var tableGroup	= $.trim($("#table_group_select").val());
			
			LoadNewTableMatchup(newEntry, description, tableGroup);
			break;
		
		case "cancel":			
			console.log(action);
			break;
	}
}

function LoadFormStrcuturesListBox(itemName) {
	for(var key in FormStructuresArray) {
		FormStructuresArray[key].icon		= "../images/unlock_icon.png";
		FormStructuresArray[key].label		= FormStructuresArray[key].FormStructureName;			
		FormStructuresArray[key].value		= FormStructuresArray[key].FormStructureGUID;
		FormStructuresArray[key].isSystem	= FormStructuresArray[key].SystemForm;
		
	}
	
	$('#table_group_select').html('<option value="" disabled selected>-- Choose --</option>');
	var tableGroupSelect = document.getElementById('table_group_select');			
	
	for(var key in tableGroupsArray) {
		tableGroupSelect.options[tableGroupSelect.options.length] = new Option(tableGroupsArray[key].SYS_TableGroups, tableGroupsArray[key].TableRecordGUID);
	}		
	
	$('#table_group_select').material_select('destroy');
	$('#table_group_select').material_select();

	$('#form_struct_tree').jqxTree('destroy');

	if($("#form_struct_tree").length == 0) {
		$("#listbox_container").append("<div id='form_struct_tree'></div>");
	}
	
	// Create a jqxTree //HERE
	$("#form_struct_tree").jqxTree({ source: FormStructuresArray, width: '100%', height: '100%', incrementalSearch: true });
	
	if(!initialLoad) {
		setTimeout(function(){
			$("#form_struct_tree").jqxTree('selectItem', $("#form_struct_tree").find('li:first')[0]);
			initialLoad = true;
		}, 100);
	}

	if(itemName) {
		setTimeout(function(){
			var elementId	= $( "li div:contains('"+itemName+"')" ).parent().attr("id");
			var element		= $("#" + elementId)[0];
			$("#form_struct_tree").jqxTree('selectItem', $('#form_struct_tree').jqxTree('getItem', element));
		}, 100);
	}
	
	$('#form_struct_tree').on('select', function (event) {
		var args = event.args;
		if (args) {
			var item	= $("#form_struct_tree").jqxTree('getItem', args.element);
			var value	= item.value;
			
			if(value) {
				var label		= item.label;
				var value		= item.value;
				
				RecordGUID = "";
				
				$("#table_description").html("Description: Table Group");

				for(key in FormStructuresArray) {					
					if(label == FormStructuresArray[key].FormStructureName) {
						if(FormStructuresArray[key].Description) {
							$("#table_description").html("Description: " + FormStructuresArray[key].Description);
						}
						else {
							$("#table_description").html("Description: ");
						}
					}
				}
				
				matchupTableGUID = value;
				LoadMatchupTableElements();
				$("#table_structure_header").html(label);
				//$("#table_structure_link").html('<a href="' +  ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/" + label + '" target="_blank">View JSON for '+label+'</a>');								
				$("#table_structure_link").html('<a target="_blank">'+label+'</a>');
				
				if(gridLoaded) {
					var loadURL = ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/FormStructureElements?where=\"FormStructureGUID = '"+ matchupTableGUID +"' ORDER BY Ordinal ASC\"";
					//LoadGrid(loadURL);

					LoadTableStructureHTML(loadURL);
					
					validTableSelected = true;
				}
				else {
					ServiceComplete();
				}
			}
			else {
				validTableSelected = false;
				$("#table_form_receiver").html("Please select a table from the Matchup Tables List");
				ServiceComplete();
			}
		}
		else {
			ServiceComplete();
		}
	});
	
	ServiceComplete();
}

function LoadNewTableMatchup(newEntry, description, tableGroup) {
	
	var structObj					= {};
	structObj.FormStructureGUID		= CreateGUID();
	structObj.FormStructureName		= newEntry;
	structObj.CreatedByGUID			= UserData[0].PersonGUID;
	structObj.Description			= description;
	structObj.FormStructureGroup	= tableGroup;
	structObj.SystemForm			= "false";
	
	var jsonData = {
		 "fields": structObj
	};
	
	jQuery.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/virtual/" + UserData[0].SiteGUID + "/FormStructures",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			var newTableName = $("#table_name_input").val();
			LoadMatchupTables(newTableName);
			$("#add_table_input input").val("");
		}
	});
}

function DeleteTableMatchup(newEntry) {
	var recordGroupGUID = "";
	
	for(var key in FormStructuresArray) {
		if(FormStructuresArray[key].value == newEntry.value) {
			recordGroupGUID = FormStructuresArray[key].TableRecordGUID;
		}
	}
	if(recordGroupGUID != "") {
		
		var jsonData = { "key": { "RecordGroupGUID": recordGroupGUID } };
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "destroy/dbo/MatchupTableRecords",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				for(var key in matchupTableSettingsData) {
					RemoveSettings(matchupTableSettingsData[key].TableRecordGUID, key, false);
				}
				for(var key in MatchupTableElementsArray) {
					RemoveOldElements(MatchupTableElementsArray[key].TableRecordGUID, key, null, false);
				}
				if(MatchupTableElementsArray.length <= 0 && matchupTableSettingsData.length <= 0) {
					$("#form_struct_tree").jqxTree('selectItem', $("#form_struct_tree").find('li:first')[0]);
				}
			}
		});
	}
	else {
		DisplayAlert("Alert!", "The TableRecordGUID was undefined.  Could not proceed with update.");
	}
}

function GetTableStructure(isRef) {
	var CurrentTableName = $("#form_struct_tree").jqxTree('getSelectedItem').label;
	var jqxhrTableStructureArr = $.getJSON(ruIP + ruPort + listsDB + listEN + "getstructure/virtual/"+ UserData[0].SiteGUID +"/"+ CurrentTableName +"", function() {
			
		var tableStructureData = jQuery.parseJSON(jqxhrTableStructureArr.responseText);
		var loadURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/" + CurrentTableName;

		PrepareColumnsForGrid(tableStructureData, loadURL, isRef);
	});
}