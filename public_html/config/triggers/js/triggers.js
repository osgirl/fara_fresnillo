/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			ZAC CARTER
	Application Name:	FARA
	Directory:			FARA/CONFIG/TRIGGERS/JS
	File Name:			triggers.js
=============================================================*/

//Global Variable Settings
var conditionalCount = 1;
var impactCount      = 1;
var lhsOptions       = [];
var operandOptions   = [];
var impactTypes      = [];
var triggerNames     = [];
var currentAddButton;
var currentDoneButton; 
var currentRemoveButton;
var currentWorkType;
var ignoreDoneButton = false;
var TriggerGUID;

$(document).ready(function() {	
	loadConditionals();
	$('ul.tabs').tabs();
	loadAddNewTrigger();
});

//Here we need to load our conditionals
function loadConditionals() {

	var TriggerConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_TriggerConditions?orderby=SYS_TriggerConditions ASC";
	
	$.getJSON(TriggerConditionsURL, function( data3 ) {
		
		for(var key in data3) {
			var LHSOption = data3[key].SYS_TriggerConditions;
			lhsOptions.push(LHSOption);
		}
		
		var OperandConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_TriggerConditionOperands?orderby=SYS_TriggerConditionOperands ASC";
	
		$.getJSON(OperandConditionsURL, function( data2 ) {
		
			for(var key in data2) {
				var OperandOptions = data2[key].SYS_TriggerConditionOperands;
				operandOptions.push(OperandOptions);
			}
			
			var impactTypesURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_TriggerImpactTypes?orderby=SYS_TriggerImpactTypes ASC";
		
			$.getJSON(impactTypesURL, function( data ) {
			
				for(var key in data) {
					var impactOptions = data[key].SYS_TriggerImpactTypes;
					impactTypes.push(impactOptions);
				}
			});		
		});	
	});	
}


//Here we're going to setup the basis for a new Trigger.
function loadAddNewTrigger() {

	var initialHTML	=	'<div class="row">' +
							'<div class="col s1"><div class="white-text waves-effect blue btn btn-floating">1</div></div>' +
							'<div class="col s2 white-text">Enter Trigger Details</div>' +
						'</div>' +
						'<div class="row">' +
							'<div class="white-text input-field col s8 offset-s1">' +
								'<input id="triggerName" type="text">' +
								'<label for="triggerName">Name your Trigger</label>' +
							'</div>' +
						'</div>' +
						'<div class="row">' +
							'<div class="col s2 offset-s10"><div style="width:150px" class="waves-effect waves-light btn black white-text" id="doneButtonStep1">DONE</div></div>' +
						'</div>' +
						'<div id="section2"></div>' +
						'<div id="section3"></div>';
	    	
	$("#content").hide().html(initialHTML).fadeIn('slow');
	
	//Bind new events when this is loaded...
	$("#doneButtonStep1").bind("click", function() {
		if($("#triggerName").val() == "" || $("#triggerName").val().length < 1) {
			DisplayAlert("Alert!","Please enter a name for your trigger.")
		}
		else {
			$("#doneButtonStep1").fadeOut();
			loadStep2();
		}
	});
}

function loadStep2() {
	var step2HTML	=	'<div class="row">' +
							'<div class="col s1"><div class="white-text waves-effect blue btn btn-floating">2</div></div>' +
							'<div class="col s2 white-text">Execute <u>ONLY IF</u></div>' +
						'</div>' +
						'<div class="row">' +
							'<div class="white-text input-field col s3 offset-s1">' +
								'<select id="cond_1_lhs" onChange="lhsDDChange(\'1\')"></select>' +
								'<label>Select Condition</label>' +
							'</div>' +
							'<div class="white-text input-field col s3">' +
								'<select id="cond_1_operand"></select>' +
								'<label>Select Operand</label>' +
							'</div>' +
							'<div class="white-text input-field col s3">' +
								'<select id="cond_1_rhs"></select>' +
								'<label></label>' +
							'</div>' +
						'</div>' +
						'<div class="row">' +
							'<div class="col s2 offset-s8"><div style="width:150px" class="waves-effect waves-light btn blue white-text" id="addButton1">Add</div></div>' +
							'<div class="col s2"><div style="width:150px" class="waves-effect waves-light btn black white-text" id="doneButton1">DONE</div></div>' +
						'</div>';
	
    $("#section2").hide().html(step2HTML).fadeIn('slow');
    
    currentAddButton  = "#addButton1";
    currentDoneButton = "#doneButton1";
	bindEventsStep2();
}

function insertConditionalRow() {

	$(currentAddButton).fadeOut();
	$(currentDoneButton).fadeOut();
	
	(conditionalCount > 1) ? $(currentRemoveButton).fadeOut() : false;		
	conditionalCount++;
			
	var conditionalRowHTML	=	$('<div class="row">' +
									'<div class="col s2 offset-s5 white-text">and</div>' +
								'</div>' +
								'<div class="row">' +
									'<div class="white-text input-field col s3 offset-s1">' +
										'<select id="cond_' + conditionalCount + '_lhs" onChange="lhsDDChange(\'' + conditionalCount + '\')"></select>' +
										'<label>Select Condition</label>' +
									'</div>' +
									'<div class="white-text input-field col s3">' +
										'<select id="cond_' + conditionalCount + '_operand"></select>' +
										'<label>Select Operand</label>' +
									'</div>' +
									'<div class="white-text input-field col s3">' +											
										'<select id="cond_' + conditionalCount + '_rhs"></select>' +
										'<label></label>' +
									'</div>' +
								'</div>' +
								'<div class="row">' +
									'<div class="col s2 offset-s6"><div style="width:150px" class="waves-effect waves-light btn blue white-text" id="addButton' + conditionalCount + '">Add</div></div>' +
									'<div class="col s2"><div style="width:150px" class="waves-effect waves-light btn red white-text" id="removeButton' + conditionalCount + '">Remove</div></div>' +
									'<div class="col s2"><div style="width:150px" class="waves-effect waves-light btn black white-text" id="doneButton' + conditionalCount + '">DONE</div></div>' +
								'</div>');
								
	conditionalRowHTML.hide();
	$("#section2 .row:last-child").hide();
	$("#section2 .row:last-child").after(conditionalRowHTML);
	conditionalRowHTML.fadeIn("slow");
	
	currentAddButton	= "#addButton"		+ conditionalCount;
	currentRemoveButton	= "#removeButton"	+ conditionalCount;
	currentDoneButton	= "#doneButton"		+ conditionalCount;
	
	//Need to rebind the new buttons...
	bindEventsStep2();
}

function bindEventsStep2() {
	$(currentAddButton).bind("click", function() { insertConditionalRow(); });
	
	$(currentDoneButton).bind("click", function() { loadStep3(); });
	
	$(currentRemoveButton).bind("click", function() {		
		
		$("#section2 .row:last-child").prev().prev().prev().fadeIn(300);
		$("#section2 .row:last-child").prev().prev().fadeOut(300, function() { $(this).remove(); });
		$("#section2 .row:last-child").prev().fadeOut(300, function() { $(this).remove(); });
		$("#section2 .row:last-child").fadeOut(300, function() {
			$(this).remove();
			conditionalCount--;
			currentAddButton	= "#addButton"		+ conditionalCount;
			currentDoneButton	= "#doneButton"		+ conditionalCount;
			currentRemoveButton	= "#removeButton"	+ conditionalCount;
			
			(conditionalCount > 1) ? $(currentRemoveButton).fadeIn() : false;
			(ignoreDoneButton == false) ? $(currentDoneButton).fadeIn() : false;			
			$(currentAddButton).fadeIn();
			(ignoreDoneButton) ? loadStep3() : false;
		});
	});
	
	(ignoreDoneButton == true) ? $(currentDoneButton).hide() : false;
	
	//Here now, we need to assign all of the drop down options to the select fields
	lhsDDLID	= "cond_" + conditionalCount + "_lhs";
	lhsJQDDLID	= "#" + lhsDDLID;
	
	//Let's wipe out the options.
	$(lhsJQDDLID).html("");
	
	var lhsDDL = document.getElementById(lhsDDLID);
	     
	for(var optionKey in lhsOptions) {
		 option          = document.createElement("option");
	     option.text     = lhsOptions[optionKey];
	     lhsDDL.add(option);
	}
	
	//Here we are assigning the operands
	opDDLID		= "cond_" + conditionalCount + "_operand";
	opJQDDLID	= "#" + opDDLID;
	
	//Let's wipe out the options.
	$(opJQDDLID).html("");
	
	var opDDL = document.getElementById(opDDLID);

	for(var optionKey in operandOptions) {
		 option          = document.createElement("option");
		 option.value    = operandOptions[optionKey];
	     option.text     = operandOptions[optionKey];
	     opDDL.add(option); 
	}

	lhsDDChange(conditionalCount);
	$("#cond_" + conditionalCount + "_lhs").material_select();
	$("#cond_" + conditionalCount + "_operand").material_select();
	$("#cond_" + conditionalCount + "_rhs").material_select();
}

function lhsDDChange(instanceCount) {
	var lhsDDListID = "#cond_" + instanceCount + "_lhs";
		
	//Here we are assigning the operands
	rhsDDLID	= "cond_" + instanceCount + "_rhs";
	rhsJQDDLID	= "#cond_" + instanceCount + "_rhs";
	
	//Let's wipe out the options.
	$(rhsJQDDLID).html("");
	
	var rhsDDL = document.getElementById(rhsDDLID);
	
	//Let's create a standard Option first
	option			= document.createElement("option");
	option.value	= "-1";
	option.text		= "Loading...";
	
	rhsDDL.add(option);
	
	
	/************
		Beacon 
	*************/
	if($(lhsDDListID).val() == "Beacon") {
		
		var operandDDIDMain	= "#cond_" + instanceCount + "_operand";
		var operandDDID		= "#cond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2	= "#cond_" + instanceCount + "_operand option[value='Less Than']";
		var operandDDID3	= "#cond_" + instanceCount + "_operand option[value='Not Equals']";

		$(operandDDID).attr('disabled', true);
		$(operandDDID2).attr('disabled', true);
		$(operandDDID3).attr('disabled', false);
		
		$("#cond_" + instanceCount + "_operand").material_select();

		var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Beacons?orderby=Name ASC";

		$.getJSON(RHSConditionsURL, function( data ) {
	
			setTimeout(function(){
				$(rhsJQDDLID).html("");
				
				for(var key in data) {
					 var currentObject = data[key];
					 option          = document.createElement("option");
					 option.value    = currentObject.TableRecordGUID;
				     option.text     = currentObject.Name;
				     rhsDDL.add(option); 
				}

				$(rhsJQDDLID).parent().next().html("Select Beacon");
				$(rhsJQDDLID).material_select();
				
				(ignoreDoneButton) ? loadStep3() : false;
			}, 500);
		});
	}
	
	/************
		GPS Region 
	*************/
	
	if($(lhsDDListID).val() == "GPS Region") {
		var operandDDID      = "#cond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2     = "#cond_" + instanceCount + "_operand option[value='Less Than']";
		var operandDDID3     = "#cond_" + instanceCount + "_operand option[value='Not Equals']";
		
		$(operandDDID).attr('disabled', true);
		$(operandDDID2).attr('disabled', true);
		$(operandDDID3).attr('disabled', false);
		
		$("#cond_" + instanceCount + "_operand").material_select();
		
		var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/geo/Region?where=\"RegionType = 'Global' AND SiteGUID = '"+UserData[0].SiteGUID+"' ORDER BY RegionName ASC\"";
		
		$.getJSON(RHSConditionsURL, function( data ) {
	
			setTimeout(function(){
			
				$(rhsJQDDLID).html("");
				
				for(var key in data) {
					 var currentObject = data[key];
					 
					 option          = document.createElement("option");
					 option.value    = currentObject.RegionGUID;
				     option.text     = currentObject.RegionName;
				     			
				     rhsDDL.add(option); 
				}
				
				$(rhsJQDDLID).parent().next().html("Select GPS Region");
				$(rhsJQDDLID).material_select();
				
				(ignoreDoneButton) ? loadStep3() : false;
			}, 500);
		});
	}
	
	/************
		Status 
	*************/
	
	if($(lhsDDListID).val() == "Status") {
		var operandDDID      = "#cond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2     = "#cond_" + instanceCount + "_operand option[value='Less Than']";
		var operandDDID3     = "#cond_" + instanceCount + "_operand option[value='Not Equals']";

		$(operandDDID).attr('disabled', true);
		$(operandDDID2).attr('disabled', true);
		$(operandDDID3).attr('disabled', false);
		
		$("#cond_" + instanceCount + "_operand").material_select();
		
		var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_Status?orderby=SYS_Status ASC";
		
		$.getJSON(RHSConditionsURL, function( data ) {
	
			setTimeout(function(){
			
				$(rhsJQDDLID).html("");
				
				for(var key in data) {
					 var currentObject = data[key];
					 
					 option          = document.createElement("option");
				     option.text     = currentObject.SYS_Status;
				     			
				     rhsDDL.add(option); 
				}
				
				$(rhsJQDDLID).parent().next().html("Select Status");
				$(rhsJQDDLID).material_select();
				
				(ignoreDoneButton) ? loadStep3() : false;
			}, 500);

		});
	}
	
	/************
		WorkType
	*************/
	
	if($(lhsDDListID).val() == "WorkType") {
		var operandDDID      = "#cond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2     = "#cond_" + instanceCount + "_operand option[value='Less Than']";
		var operandDDID3     = "#cond_" + instanceCount + "_operand option[value='Not Equals']";

		$(operandDDID).attr('disabled', true);
		$(operandDDID2).attr('disabled', true);
		$(operandDDID3).attr('disabled', true);
		
		$("#cond_" + instanceCount + "_operand").material_select();

		var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_WorkTypeName?orderby=SYS_WorkTypeName ASC";
		
		$.getJSON(RHSConditionsURL, function( data ) {
	
			setTimeout(function(){
			
				$(rhsJQDDLID).html("");
				
				for(var key in data) {
					 var currentObject = data[key];
					 
					 option          = document.createElement("option");
				     option.text     = currentObject.SYS_WorkTypeName;
				     			
				     rhsDDL.add(option); 
				}
				
				$(rhsJQDDLID).parent().next().html("Select WorkType");
				$(rhsJQDDLID).material_select();
				
				(ignoreDoneButton) ? loadStep3() : false;
			}, 500);

		});
	}
	
	/************
		GPS Speed
	*************/
	
	if($(lhsDDListID).val() == "GPS Speed") {
		var operandDDID  = "#cond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2 = "#cond_" + instanceCount + "_operand option[value='Less Than']";
		var operandDDID3 = "#cond_" + instanceCount + "_operand option[value='Equals']";
		
		$(operandDDID).attr('disabled', false);
		$(operandDDID2).attr('disabled', false);
		$(operandDDID3).attr('disabled', false);
		
		$("#cond_" + instanceCount + "_operand").material_select();

		var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_GPSSpeed";
		
		$.getJSON(RHSConditionsURL, function( data ) {
	
			setTimeout(function(){
			
				$(rhsJQDDLID).html("");
				
				for(var key in data) {
					 var currentObject = data[key];
					 
					 option			= document.createElement("option");
				     option.text	= currentObject.SYS_GPSSpeed;
				     			
				     rhsDDL.add(option); 
				}
				
				$(rhsJQDDLID).html($("option", $(rhsJQDDLID)).sort(function(a, b) {
					return parseInt(a.text) == parseInt(b.text) ? 0 : parseInt(a.text) < parseInt(b.text) ? -1 : 1; 
				}));
				
				$(rhsJQDDLID).parent().next().html("Select GPS Speed");				
				$(rhsJQDDLID).material_select();
				
				(ignoreDoneButton) ? loadStep3() : false;
			}, 500);

		});
	}
	
	/************
		EventStarted
	*************/
	
	if($(lhsDDListID).val() == "EventStarted") {
		var operandDDID  = "#cond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2 = "#cond_" + instanceCount + "_operand option[value='Less Than']";
		var operandDDID3 = "#cond_" + instanceCount + "_operand option[value='Not Equals']";

		$(operandDDID).attr('disabled', true);
		$(operandDDID2).attr('disabled', true);
		$(operandDDID3).attr('disabled', true);
		
		$("#cond_" + instanceCount + "_operand").material_select();
		
		var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_EventTypes";
		
		$.getJSON(RHSConditionsURL, function( data ) {
	
			setTimeout(function(){
			
				$(rhsJQDDLID).html("");
				
				for(var key in data) {
					 var currentObject = data[key];
					 
					 option          = document.createElement("option");
				     option.text     = currentObject.SYS_EventTypes;
				     			
				     rhsDDL.add(option); 
				}
				
				$(rhsJQDDLID).html($("option", $(rhsJQDDLID)).sort(function(a, b) {
					return parseInt(a.text) == parseInt(b.text) ? 0 : parseInt(a.text) < parseInt(b.text) ? -1 : 1; 
				}));
				
				$(rhsJQDDLID).parent().next().html("Select EventStarted");
				$(rhsJQDDLID).material_select();

				(ignoreDoneButton) ? loadStep3() : false;
			}, 500);

		});
	}
	
	if($(lhsDDListID).val() == "Sequence") {
		var operandDDID  = "#cond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2 = "#cond_" + instanceCount + "_operand option[value='Less Than']";
		var operandDDID3 = "#cond_" + instanceCount + "_operand option[value='Not Equals']";

		$(operandDDID).attr('disabled', true);
		$(operandDDID2).attr('disabled', true);
		$(operandDDID3).attr('disabled', false);
		
		$("#cond_" + instanceCount + "_operand").material_select();
		
		if(workTypePresent() == true) {
			var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SequenceType_states_worktype?where=\work_type_name='" + currentWorkType + "'\"";
			
			$.getJSON(RHSConditionsURL, function( data ) {
		
				setTimeout(function(){
				
					$(rhsJQDDLID).html("");
					
					for(var key in data) {
						 var currentObject = data[key];
						 
						 option          = document.createElement("option");
						 option.value    = currentObject.TableRecordGUID;
						 option.text     = currentObject.seq_no + " - " + currentObject.sequence_type_name;
									
						 rhsDDL.add(option); 
					}
					
					$(rhsJQDDLID).html($("option", $(rhsJQDDLID)).sort(function(a, b) {
						return parseInt(a.text) == parseInt(b.text) ? 0 : parseInt(a.text) < parseInt(b.text) ? -1 : 1; 
					}));
					
					$(rhsJQDDLID).parent().next().html("Select Sequence");
					$(rhsJQDDLID).material_select();

					(ignoreDoneButton) ? loadStep3() : false;
				}, 500);

			});
		}
		else {
			DisplayAlert('Alert!','Please add a worktype as a conditional first.');
		}
	}
	
}

function nextImpactDidChange(passedImpact) {

	var nextImpactID = "#nextImpact" + passedImpact;
	var impactOptionsID = "#impactOptions" + passedImpact;
	
	if($(nextImpactID).val() == "Custom" && $(impactOptionsID).val() == "Sequence" && checkRequiredConditionals("Sequence") == true) {
		showSequenceGrid(passedImpact);
	}
	else if($(nextImpactID).val() == "Next" && $(impactOptionsID).val() == "Sequence" && checkRequiredConditionals("Sequence") == true) {
		var jqxGridID = "#jqxgrid" + passedImpact;
		$(jqxGridID).fadeOut();
	}
}

function loadStep3() {

	ignoreDoneButton = true;
	$(currentDoneButton).fadeOut();
	
	var step3HTML	=	'<div class="row">' +
							'<div class="col s1"><div class="white-text waves-effect blue btn btn-floating">3</div></div>' +
							'<div class="col s2 white-text">Set Impacts</div>' +
						'</div>' +
						'<div class="row">' +
							'<div class="white-text col s1 offset-s1 valign-wrapper" style="height:70px"><span class="valign center-align">Change:</span></div>' +
							'<div class="white-text input-field col s3">' +
								'<select id="impactOptions1" onChange="adjustNextImpact(\'1\')"></select>' +
								'<label>Select Impact</label>' +
							'</div>' +
							'<div class="white-text col s1 valign-wrapper" style="height:70px"><span class="valign center-align">to</span></div>' +
							'<div class="white-text input-field col s3">' +
								'<select id="nextImpact1" onChange="nextImpactDidChange(\'1\')"></select>' +
								'<label>Select InfoScreen</label>' +
							'</div>' +
						'</div>' +
						'<div class="row">' +
							'<div class="col s6 offset-s2"><div id="jqxwidget1"><div id="jqxgrid1" style="height:400px; width:580px; display:none;"></div></div></div>' +
						'</div>' +
						'<div class="row">' +
							'<div class="col s2 offset-s8"><div style="width: 150px" class="waves-effect waves-light btn blue white-text" id="faddButton' + impactCount + '">Add</div></div>' +
							'<div class="col s2"><div style="width: 150px" class="waves-effect waves-light btn black white-text" id="submitButton">SUBMIT</div></div>' +
						'</div>';
	
    $("#section3").hide().html(step3HTML).fadeIn('slow');
    $("#submitButton").unbind("click");
    $("#submitButton").bind("click", function() { var element = $(this); submitStep1Info(element); });
    
    bindStep3Events();
}

function insertImpactRow() {
	if(impactCount > 1) {
		var currentRemoveButton = "#fremoveButton" + impactCount;
		$(currentRemoveButton).hide();
	}
	
	var currentAddButton = "#faddButton" + impactCount;
	$(currentAddButton).hide();
		
	impactCount++;
	
	var conditionalRowHTMLString	=	$('<div class="row">' +
											'<div class="white-text col s1 offset-s1 valign-wrapper" style="height:70px"><span class="valign center-align">Change:</span></div>' +
											'<div class="white-text input-field col s3">' +
												'<select id="impactOptions' + impactCount + '" onChange="adjustNextImpact(\'' + impactCount + '\')"></select>' +
												'<label>Select Impact</label>' +
											'</div>' +											
											'<div class="white-text col s1 valign-wrapper" style="height:70px"><span class="valign center-align">to</span></div>' +
											'<div class="white-text input-field col s3">' +
												'<select id="nextImpact' + impactCount + '" onChange="nextImpactDidChange(\'' + impactCount + '\')"></select>' +
												'<label>Select InfoScreen</label>' +
											'</div>' +
										'</div>' +
										'<div class="row">' +
											'<div class="col s6 offset-s2"><div id="jqxwidget' + impactCount + '"><div id="jqxgrid' + impactCount + '" style="height:400px; width:580px; display:none;"></div></div></div>' +
										'</div>' +
										'<div class="row">' +
											'<div class="col s2 offset-s6"><div style="width:150px" class="waves-effect waves-light btn blue white-text" id="faddButton' + impactCount + '">Add</div></div>' +
											'<div class="col s2"><div style="width:150px" class="waves-effect waves-light btn red white-text" id="fremoveButton' + impactCount + '">Remove</div></div>' +
											'<div class="col s2"><div style="width: 150px" class="waves-effect waves-light btn black white-text" id="submitButton' + impactCount + '">SUBMIT</div></div>' +
										'</div>');
								
 	conditionalRowHTMLString.hide();
	$("#section3 .row:last-child").hide();
	$("#section3 .row:last-child").after(conditionalRowHTMLString);
	conditionalRowHTMLString.fadeIn("slow");
	
    $("#submitButton" + impactCount).unbind("click");
    $("#submitButton" + impactCount).bind("click", function() { var element = $(this); submitStep1Info(element); });

	bindStep3Events();
 }
 
 function bindStep3Events() {

	//Here now, we need to assign all of the impact types to the change drop down box in step 3.
	var itDDLID		= "impactOptions" + impactCount;
	var itJQDDLID	= "#" + itDDLID;
	
	//Let's wipe out the options.
	$(itJQDDLID).html("");
	
	var itDDL	= document.getElementById(itDDLID);
	     
	for(var optionKey in impactTypes) {
		 option          = document.createElement("option");
	     option.text     = impactTypes[optionKey];
	     itDDL.add(option);
	}
	
	var addButtonID = "#faddButton" + impactCount;
	
	$(addButtonID).bind("click", function() { insertImpactRow(); });
	
	var currentRemoveButton = "#fremoveButton" + impactCount;
	
	$(currentRemoveButton).bind("click", function() {		
		
		$("#section3 .row:last-child").prev().prev().prev().fadeIn(300);
		$("#section3 .row:last-child").prev().prev().fadeOut(300, function() { $(this).remove(); });
		$("#section3 .row:last-child").prev().fadeOut(300, function() { $(this).remove(); });
		$("#section3 .row:last-child").fadeOut(300, function() {
			$(this).remove();
			impactCount--;
			currentAddButton	= "#faddButton"		+ impactCount;
			currentRemoveButton	= "#fremoveButton"	+ impactCount;
			
			(impactCount > 1) ? $(currentRemoveButton).fadeIn() : false;
			(ignoreDoneButton == false) ? $(currentDoneButton).fadeIn() : false;			
			$(currentAddButton).fadeIn();
		});
	});
	
	$("#impactOptions" + impactCount).material_select();
	adjustNextImpact(impactCount);
}

function adjustNextImpact(passedImpact) {
	
	var jqxGridID      = "#jqxgrid" + passedImpact;
	var jqxWidgetID    = "#jqxwidget" + passedImpact;
	
	//Here, we're setting the variables for the "Next Impact" drop down list.
	var niDDLID        = "nextImpact" + passedImpact;
	var niJQDDLID      = "#" + niDDLID;
	
	var impactOptions  = "#impactOptions" + passedImpact;
	
	//Let's wipe out the options.
	$(niJQDDLID).html("");
	
	var niDDL          = document.getElementById(niDDLID);

	if($(impactOptions).val() == "Sequence") {
		if(checkRequiredConditionals("Sequence", passedImpact) == true) {
			$(jqxGridID).fadeOut();

			$(niJQDDLID).html("");
			$(niJQDDLID).parent().next().html("");
			
			var  option     = document.createElement("option");
		    option.text     = "Next";
					     			
			niDDL.add(option); 
			
			var  option2     = document.createElement("option");
		    option2.text     = "Custom";
					     			
			niDDL.add(option2);
			
			$(niJQDDLID).parent().next().html("Select Sequence");	
			$(niJQDDLID).material_select();
		
			$(niJQDDLID).parent().parent().css({"display":"block"});
		}					 
	}
	
	if($(impactOptions).val() == "InfoScreen") {
		$(jqxGridID).fadeOut();
		
		$(niJQDDLID).html("");
		$(niJQDDLID).parent().next().html("");
		
		var  option     = document.createElement("option");
		option.text     = "Required Details";
								
		niDDL.add(option); 
		
		var  option2     = document.createElement("option");
		option2.text     = "Optional Details";
								
		niDDL.add(option2);
		
		$(niJQDDLID).parent().next().html("Select InfoScreen");	
		$(niJQDDLID).material_select();
		
		$(niJQDDLID).parent().parent().css({"display":"block"});

		showFormsGrid(passedImpact);
	}
	
	if($(impactOptions).val() == "Status") {
		if(checkRequiredConditionals("Status", passedImpact) == true) {
			$(niJQDDLID).parent().parent().hide();
			showStatusGrid(passedImpact);
		} 	
	}
}

function workTypePresent() {
	
	//Step 1 is to create new tables with a list value of 1.
	for(var i = 1; i<=conditionalCount; i++) {	
		var lhsDDListID     = "#cond_" + i + "_lhs";
		var rhsDDListID     = "#cond_" + i + "_rhs";
		
		if($(lhsDDListID).val() == "WorkType" && $(rhsDDListID).val().length > 1) {
			currentWorkType = $(rhsDDListID).val();
			return true;
		}
	}
	
	return false;
}

function checkRequiredConditionals(impact, passedImpact) {
	
	var niDDLID        = "nextImpact" + passedImpact;
	var niJQDDLID      = "#" + niDDLID;
	
	var impactOptions  = "#impactOptions" + passedImpact;
	
	if(impact == "Sequence" || impact == "Status") {
		//Step 1 is to create new tables with a list value of 1.
		for(var i = 1; i<=conditionalCount; i++) {	
			var lhsDDListID     = "#cond_" + i + "_lhs";
			var rhsDDListID     = "#cond_" + i + "_rhs";
			
			if($(lhsDDListID).val() == "WorkType" && $(rhsDDListID).val().length > 1) {
				currentWorkType = $(rhsDDListID).val();
				return true;
			}
		}
	}
	
	$(niJQDDLID).html("");
	$(impactOptions).val("-1");
	
	DisplayAlert("Alert!","A work type is required as a condition to use this impact.");
	
	return false;
}

function showStatusGrid(passedImpact) {

	var jqxGridID = "#jqxgrid" + passedImpact;
	var jqxWidgetID = "#jqxwidget" + passedImpact;
	
	$(jqxGridID).jqxGrid('destroy');
	$(jqxWidgetID).prepend('<div id="jqxgrid' + passedImpact + '"></div>');
	
    var NIConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/StatusCodes_equip_worktype?where=\"work_type_name='" + currentWorkType + "' ORDER BY status ASC\"";

	// prepare the data
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'TableRecordGUID', type: 'string' },
			{ name: 'work_type_name', type: 'string' },
			{ name: 'status', type: 'string' },
			{ name: 'status_reason_code', type: 'string' }
		],
		url: NIConditionsURL
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	// Create jqxgrid2
	$(jqxGridID).jqxGrid({
		width: "570px",
		height: "400px",
		source: dataAdapter,
		editmode: 'dblclick',
		showstatusbar: true,
		renderstatusbar: function (statusbar) {
			// appends buttons to the status bar.
			var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");			
			statusbar.append(container);
		},
		columnsresize: true,
		columnsreorder: true,
		filterable: true,
		sortable: true,
		groupable: true,
        editable: true,
		enabletooltips: true,
		columns: [
			{ text: 'TableRecordGUID', datafield: 'TableRecordGUID', width: 150, hidden: true },
			{ text: 'Work Type Name', datafield: 'work_type_name', width: 150 },
			{ text: 'Status', datafield: 'status', cellsalign: 'left', align: 'left', width: 200 },
			{ text: 'Reason Code', datafield: 'status_reason_code', align: 'left', cellsalign: 'left', width: 200 },
		]
	});
	
	$(jqxGridID).fadeIn();
}

function showFormsGrid(passedImpact) {

	var jqxGridID = "#jqxgrid" + passedImpact;
	var jqxWidgetID = "#jqxwidget" + passedImpact;
	
	$(jqxGridID).jqxGrid('destroy');
	$(jqxWidgetID).prepend('<div id="jqxgrid' + passedImpact + '"></div>');
	
    var NIConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/FormStructures?where=\"1=1 ORDER BY FormStructureName\"";

	// prepare the data
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'FormStructureGUID', type: 'string' },
			{ name: 'FormStructureName', type: 'string' },
			{ name: 'Description', type: 'string' }
		],
		url: NIConditionsURL
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	// Create jqxgrid2
	$(jqxGridID).jqxGrid({
		width: "570px",
		height: "400px",
		source: dataAdapter,
		editmode: 'dblclick',
		showstatusbar: true,
		renderstatusbar: function (statusbar) {
			// appends buttons to the status bar.
			var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");			
			statusbar.append(container);
		},
		columnsresize: true,
		columnsreorder: true,
		filterable: true,
		sortable: true,
		groupable: true,
        editable: true,
		enabletooltips: true,
		columns: [
			{ text: 'TableRecordGUID', datafield: 'FormStructureGUID', width: 250, hidden: true },
			{ text: 'Form Structure Name', datafield: 'FormStructureName', width: 285 },
			{ text: 'Description', datafield: 'Description', cellsalign: 'left', align: 'left', width: 285 }
		]
	});
	
	$(jqxGridID).fadeIn();
}

function showSequenceGrid(passedImpact) {

	var jqxGridID = "#jqxgrid" + passedImpact;
	var jqxWidgetID = "#jqxwidget" + passedImpact;
	
	$(jqxGridID).jqxGrid('destroy');
	$(jqxWidgetID).prepend('<div id="jqxgrid' + passedImpact + '"></div>');
	
    var NIConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SequenceType_states_worktype?where=\"work_type_name='" + currentWorkType + "' ORDER BY sequence_type_name ASC\"";

	// prepare the data
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'TableRecordGUID', type: 'string' },
			{ name: 'work_type_name', type: 'string' },
			{ name: 'seq_no', type: 'string' },
			{ name: 'sequence_type_name', type: 'string' },
			{ name: 'sequence_state_name', type: 'string' }       
		],
		url: NIConditionsURL
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	// Create jqxgrid2
	$(jqxGridID).jqxGrid({
		width: "570px",
		height: "400px",
		source: dataAdapter,
		editmode: 'dblclick',
		showstatusbar: true,
		renderstatusbar: function (statusbar) {
			// appends buttons to the status bar.
			var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");			
			statusbar.append(container);
		},
		columnsresize: true,
		columnsreorder: true,
		filterable: true,
		sortable: true,
		groupable: true,
        editable: true,
		enabletooltips: true,
		columns: [
			{ text: 'TableRecordGUID', datafield: 'TableRecordGUID', width: 150, hidden: true },
			{ text: 'Work Type Name', datafield: 'work_type_name', width: 100 },
			{ text: 'Seq. No', datafield: 'seq_no', cellsalign: 'left', align: 'left', width: 70 },
			{ text: 'Sequence Name', datafield: 'sequence_type_name', cellsalign: 'left', align: 'left', width: 200 },
			{ text: 'Sequence State', datafield: 'sequence_state_name', align: 'left', cellsalign: 'left', width: 200 },
		]
	});
	
	$(jqxGridID).fadeIn();
}




function submitStep1Info(element) {

	var fields      = {};	
	var mainDict    = {};
	
	TriggerGUID     = CreateGUID();
	
	mainDict.TriggerGUID = TriggerGUID;
	mainDict.TriggerName = $("#triggerName").val();
	
	fields.fields = mainDict;
	
	$.ajax ({
        headers: {
             "Content-Type": "application/json"
        },
        url: ruIP + ruPort + listsDB + listEN + "create/virtual/" + UserData[0].SiteGUID + "/Triggers",
        type: "POST",
        data: JSON.stringify(fields),
        success: function(){
            submitStep2Info();
        },
        error: function(){
             DisplayAlert("Alert!","Unable to insert trigger details at this time. Please try again later.");
        }
	 });
}

function submitStep2Info() {

	var containingObject = {};
	var mainDictionary   = [];
		
		
	//Step 1 is to create new tables with a list value of 1.
	for(var i = 1; i<=conditionalCount; i++) {
		var currentObject = {};

		var lhsDDListID     = "#cond_" + i + "_lhs";
		var rhsDDListID     = "#cond_" + i + "_rhs";
		var operandDDListID = "#cond_" + i + "_operand";

		currentObject.TriggerConditionGUID = CreateGUID();
		currentObject.TriggerGUID          = TriggerGUID;
		currentObject.LeftHandSide         = $(lhsDDListID).val();
		currentObject.RightHandSide        = $(rhsDDListID).val();
		currentObject.Operand              = $(operandDDListID).val();
		
		mainDictionary.push(currentObject);
	}
		

	containingObject.fields = mainDictionary;
	
	$.ajax ({
        headers: {
             "Content-Type": "application/json"
        },
        url: ruIP + ruPort + listsDB + listEN + "create/bulk/virtual/" + UserData[0].SiteGUID + "/TriggerConditions",
        type: "POST",
        data: JSON.stringify(containingObject),
        success: function(){
            submitStep3Info();
        },
        error: function(){
             DisplayAlert("Alert!","Unable to insert trigger details at this time. Please try again later.");
        }
	 });

}

function submitStep3Info() {
	
	var containingObject = {};
	var mainDictionary   = [];
		
		
	//Step 1 is to create new tables with a list value of 1.
	for(var i = 1; i<=impactCount; i++) {
		var currentObject = {};

		currentObject.TriggerGUID       = TriggerGUID;
		currentObject.TriggerImpactGUID = CreateGUID();
		
		var currentImpactObject         = "#impactOptions" + i;
		var nextImpactObject            = "#nextImpact" + i;
		
		
		var TriggerImpType = $(currentImpactObject).val();
		
		($(currentImpactObject).val() == "InfoScreen") ? ($(nextImpactObject).val() == "Required Details") ? TriggerImpType = "RequiredDetails" : TriggerImpType = "OptionalDetails" : false;
		
		currentObject.TriggerImpactType = TriggerImpType;
		
		
		if($(currentImpactObject).val() == "Status") {
			var currentJQXGridID        = "#jqxgrid" + i;
			
			var getselectedrowindexes   = $(currentJQXGridID).jqxGrid('getselectedrowindexes');
			var selectedRowData         = $(currentJQXGridID).jqxGrid('getrowdata', getselectedrowindexes[0]);
				
			currentObject.TriggerImpact = selectedRowData.TableRecordGUID;
		}		
		else if($(currentImpactObject).val() == "Sequence" && $(nextImpactObject).val() == "Custom") {
			var currentJQXGridID        = "#jqxgrid" + i;
			
			var getselectedrowindexes   = $(currentJQXGridID).jqxGrid('getselectedrowindexes');
			var selectedRowData         = $(currentJQXGridID).jqxGrid('getrowdata', getselectedrowindexes[0]);
				
			currentObject.TriggerImpact = selectedRowData.TableRecordGUID;
		}
		else if($(currentImpactObject).val() == "InfoScreen") {
			var currentJQXGridID        = "#jqxgrid" + i;
			
			var getselectedrowindexes   = $(currentJQXGridID).jqxGrid('getselectedrowindexes');
			var selectedRowData         = $(currentJQXGridID).jqxGrid('getrowdata', getselectedrowindexes[0]);
				
			currentObject.TriggerImpact = selectedRowData.FormStructureGUID;
		}
		else {
			currentObject.TriggerImpact = $(nextImpactObject).val();
		}
		
		mainDictionary.push(currentObject);
	}
		

	containingObject.fields = mainDictionary;

	$.ajax ({
        headers: {
             "Content-Type": "application/json"
        },
        url: ruIP + ruPort + listsDB + listEN + "create/bulk/virtual/" + UserData[0].SiteGUID + "/TriggerImpacts",
        type: "POST",
        data: JSON.stringify(containingObject),
        success: function(){
            DisplayAlert("Success!","You have successfully created this trigger.");
            location.reload();
        },
        error: function(){
             DisplayAlert("Alert!","Unable to insert trigger details at this time. Please try again later.");
        }
	 });
}

function LoadBottomSheet() {
  $("#modal-table .modal-header").html('');
	$("#modal-table .modal-subcontent").html("");
		
  LoadTriggers();
}

function LoadTriggers(){
  $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Triggers", function( data ) {
    for(var key in data){
      triggerNames.push({"TriggerGUID": data[key].TriggerGUID, "TriggerName": data[key].TriggerName});
    }
    
    LoadTConditionsGrid();
  });
}

function LoadTConditionsGrid() {

	var formTypesArray	= [];

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/TriggerConditions", function( data ) {
		
		for(var key in data) {
			var formTypeObj		= {};
      
      for(var key2 in triggerNames){
        if(triggerNames[key2].TriggerGUID == data[key].TriggerGUID){
          formTypeObj.TriggerName = triggerNames[key2].TriggerName;
        }
      }
      
			formTypeObj.LeftHandSide	= data[key].LeftHandSide;
			formTypeObj.Operand	= data[key].Operand;
      formTypeObj.RightHandSide	= data[key].RightHandSide;
			formTypesArray.push(formTypeObj);
		}
	
		$("#modal-table .modal-subcontent").append($('<div class="row" style="margin-top: -20px"><div class="col s6"><h5>Trigger Conditions</h5><div id="jqxgrid"></div></div><div class="col s6"><h5>Trigger Impacts</h5><div id="jqxgrid2"></div></div></div>'));
		
    var source = {
      localdata: formTypesArray,
      datatype: "array",
      datafields:
      [
        { name: 'TriggerName',			type: 'string' },
        { name: 'LeftHandSide',				type: 'string' },
        { name: 'Operand',	type: 'string' },
        { name: 'RightHandSide',	type: 'string' }
      ]
    };
    
    var dataAdapter = new $.jqx.dataAdapter(source);
    
    $("#jqxgrid").jqxGrid({
      width: '100%',
      height: "430px",
      source: dataAdapter,
      filterable: true,
      sortable: true,
      autoshowfiltericon: true,
      columnsresize: true,
      columnsreorder: true,
      groupable: true,
      enabletooltips: true,
      columns: [
        { text: 'Trigger Name',		    datafield: 'TriggerName',		hidden: false },
        { text: 'Left Hand Side',			        datafield: 'LeftHandSide',			hidden: false },
        { text: 'Operand',   datafield: 'Operand',	hidden: false },
        { text: 'Right Hand Side',   datafield: 'RightHandSide',	hidden: false }
      ]
    });
    
    LoadTImpactsGrid();
		
	});
}

function LoadTImpactsGrid(){
  var formTypesArray	= [];

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/TriggerImpacts", function( data ) {
		
		for(var key in data) {
			var formTypeObj		= {};
      
      for(var key2 in triggerNames){
        if(triggerNames[key2].TriggerGUID == data[key].TriggerGUID){
          formTypeObj.TriggerName = triggerNames[key2].TriggerName;
        }
      }
      
			formTypeObj.TriggerImpactType	= data[key].TriggerImpactType;
			formTypeObj.TriggerImpact	    = data[key].TriggerImpact;
			formTypesArray.push(formTypeObj);
		}
			
    var source = {
      localdata: formTypesArray,
      datatype: "array",
      datafields:
      [
        { name: 'TriggerName',			  type: 'string' },
        { name: 'TriggerImpactType',  type: 'string' },
        { name: 'TriggerImpact',	    type: 'string' }
      ]
    };
    
    var dataAdapter = new $.jqx.dataAdapter(source);
    
    $("#jqxgrid2").jqxGrid({
      width: '100%',
      height: "430px",
      source: dataAdapter,
      filterable: true,
      sortable: true,
      autoshowfiltericon: true,
      columnsresize: true,
      columnsreorder: true,
      groupable: true,
      enabletooltips: true,
      columns: [
        { text: 'Trigger Name',		    datafield: 'TriggerName',		    hidden: false },
        { text: 'TriggerImpactType',	datafield: 'TriggerImpactType', hidden: false },
        { text: 'TriggerImpact',      datafield: 'TriggerImpact',	    hidden: false }
      ]
    });
    
    DisplayBottomSheet();
		
	});
}

function DisplayBottomSheet() {
	bottomSheetDisplayed = true;
	
	$("#modal-table").openModal({
		dismissible:	true,
		height:			600,
		ready:			function() { ServiceComplete(); },
		complete:		function() { bottomSheetDisplayed = false; }
	});
}
