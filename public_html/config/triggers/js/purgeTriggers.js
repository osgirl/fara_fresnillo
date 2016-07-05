/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			ZAC CARTER
	Application Name:	FARA
	Directory:			FARA/CONFIG/TRIGGERS/JS
	File Name:			purgeTriggers.js
=============================================================*/

var recordGroupGUIDArrsToRemove = [];

function loadRemoveAllTriggers() {
	
	var initialHTML	=	'<div class="row">' +
							'<div class="col s1"><div class="white-text waves-effect orange btn btn-floating">!</div></div>' +
							'<div class="col s2 white-text">Purge Triggers</div>' +
						'</div>' +
						'<div class="row">'  +
							'<div class="col s4 offset-s1 white-text">Would you lilke to remove all triggers?</div>' +
							'<div class="white-text input-field col s3">' +
								'<select id="purgeYesNo" onChange="showPurgeWarningAndButton()"><option>No</option><option>Yes</option></select>' +
								'<label>Purge Triggers?</label>' +
							'</div>' +
						'</div>' +
						'<div class="row">' +
							'<div class="col s2 offset-s10"><div style="width: 150px; display: none" class="waves-effect waves-light btn black white-text" id="purgeButtonLocation">Purge</div></div>' +
						'</div>';
	    	
	$("#content").hide().html(initialHTML).fadeIn('slow');
	$("#purgeYesNo").material_select();
}

function showPurgeWarningAndButton() {

	if($("#purgeYesNo").val() == "Yes") {
		DisplayAlert("Alert","Warning this cannot be undone. Triggers are not deleted yet. To Continue, click the \"Purge\" button now.");
		$("#purgeButtonLocation").css({"display":"block"});
		
		$("#purgeButtonLocation").click(function() {
			getTriggerTableMatchupTableGUID();		
		});
	}
}

function getTriggerTableMatchupTableGUID() {

	var listOfMatchupTableNames = ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"(MatchupTableName = 'Triggers' OR MatchupTableName = 'TriggerConditions' OR MatchupTableName = 'TriggerImpacts') AND SiteGUID = '" + UserData[0].SiteGUID + "'\"";
		
	$.getJSON(listOfMatchupTableNames, function( data ) {
			
			var container = {};
			var fields    = {"IsActive": 0};
			
			container.fields = fields;
			
			var whereString = "";
			
			var i = 0;
			for(var key in data) {
				(i != 0) ? whereString += " OR " : false;
					
				whereString += "MatchupTableGUID = '" + data[key].MatchupTableGUID + "'";
				i++;
			}
			
			container.where = whereString;
			
			$.ajax ({
	        headers: {
	             "Content-Type": "application/json"
	        },
	        url: ruIP + ruPort + listsDB + listEN + "nupdate/dbo/MatchupTableRecords",
	        type: "POST",
	        data: JSON.stringify(container),
	        success: function(){
	    		loadRemoveAllTriggers();
	            DisplayAlert("Success!","All Triggers were successfully removed!");
	        },
	        error: function(){
	             DisplayAlert("Alert","Unable to remove all Triggers.");
	        }
		 });

	});
}


/*EVERYTHING BELOW HERE IS FOR REMOVING A SINGLE TRIGGER*/

function removeSingleTrigger() {
	
	var initialHTML	=	'<div class="row">' +
							'<div class="col s1"><div class="white-text waves-effect orange btn btn-floating">!</div></div>' +
							'<div class="col s4 white-text">Remove Single Triggers</div>' +
						'</div>' +
						'<div class="row">'  +
							'<div class="col s3 offset-s1 white-text">Select Existing Trigger:</div>' +
							'<div class="white-text input-field col s3">' +
								'<select id="removableTriggersList"></select>' +
								'<label>Select Trigger?</label>' +
							'</div>' +
						'</div>' +
						'<div class="row">' +
							'<div class="col s2 offset-s10"><div style="width: 150px" class="waves-effect waves-light btn black white-text" id="removeSingleTrigger">remove</div></div>' +
						'</div>';
	
	$("#content").hide().html(initialHTML).fadeIn('slow');
	
	$("#removeSingleTrigger").click(function() {
		($("#removableTriggersList").val()) ? removeTriggerStep1() : DisplayAlert("Alert","Please select a trigger to remove.");
	});
			
	showListOfRemovableTriggers();
}

function showListOfRemovableTriggers() {

	var TriggersURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Triggers?orderby=TriggerName ASC";
		
	$.getJSON(TriggersURL, function( data ) {
			
		setTimeout(function() {
		
			var existingTriggers = document.getElementById("removableTriggersList");
			
			$("#removableTriggersList").html("");
				 
			for(var key in data) {
				 var currentObject = data[key];
				 
				 option          = document.createElement("option");
				 option.value    = currentObject.TriggerGUID;
				 option.text     = currentObject.TriggerName;
							
				 existingTriggers.add(option); 
			}
			
			$("#removableTriggersList").material_select();

		}, 500);
	});
}

function removeTriggerStep1() {
	
	recordGroupGUIDArrsToRemove = [];
	
	var ConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Triggers?where=\"TriggerGUID='" + $("#removableTriggersList").val() + "'\"";	
	
	$.getJSON(ConditionsURL, function( data ) {
		
		for(var i = 0; i<data.length; i++) {
			var currentObject = data[i];
			recordGroupGUIDArrsToRemove.push(currentObject.TableRecordGUID);
			
			(i == data.length - 1) ? removeTriggerStep2() : false;
		}
	});
}

function removeTriggerStep2() {
		
	var Conditions2URL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/TriggerConditions?where=\"TriggerGUID='" + $("#removableTriggersList").val() + "'\"";	
	
	$.getJSON(Conditions2URL, function( data ) {
		
		for(var i = 0; i<data.length; i++) {
			var currentObject = data[i];
			recordGroupGUIDArrsToRemove.push(currentObject.TableRecordGUID);
			
			(i == data.length - 1) ? removeTriggerStep3() : false;
		}
	});
}

function removeTriggerStep3() {
		
	var Conditions3URL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/TriggerImpacts?where=\"TriggerGUID='" + $("#removableTriggersList").val() + "'\"";	
	
	$.getJSON(Conditions3URL, function( data ) {
		
		for(var i = 0; i<data.length; i++) {
			var currentObject = data[i];
			recordGroupGUIDArrsToRemove.push(currentObject.TableRecordGUID);
			
			(i == data.length - 1) ? removeTriggerStep4() : false;
		}
	});
}

function removeTriggerStep4() {

	var eventBatchArray  = [];
	var fieldsDictionary = {};
	
	for(var key in recordGroupGUIDArrsToRemove) {
		var currentGUID = recordGroupGUIDArrsToRemove[key];
		
		var guidDictionary = {};
		
		guidDictionary.APIKEY   = {"RecordGroupGUID": currentGUID };
		guidDictionary.IsActive = 0;
		
		eventBatchArray.push(guidDictionary);		
	}	
	
	fieldsDictionary.fields = eventBatchArray;
	
	$.ajax ({
        headers: {
             "Content-Type": "application/json"
        },
        url: ruIP + ruPort + listsDB + listEN + "update/bulk/dbo/MatchupTableRecords",
        type: "POST",
        data: JSON.stringify(fieldsDictionary),
        success: function(){
            DisplayAlert("Success","Trigger: " + $("#removableTriggersList option:selected").text() + " was successfully removed.");
            removeSingleTrigger();
        },
        error: function(){
			DisplayAlert("Alert","Unable to update details at this time. Please try again later.");
        }
	 });
}




