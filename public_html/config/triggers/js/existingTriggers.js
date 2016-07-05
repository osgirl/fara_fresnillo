/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			ZAC CARTER
	Application Name:	FARA
	Directory:			FARA/CONFIG/TRIGGERS/JS
	File Name:			existingTriggers.js
=============================================================*/

var existingConditionalCount = 1;
var existingImpactCount      = 1;
var existingLhsOptions       = [];
var existingOperandOptions   = [];
var existingImpactTypes      = [];
var existingCurrentAddButton;
var existingCurrentDoneButton; 
var existingCurrentRemoveButton;
var existingCurrentWorkType;
var existingIgnoreDoneButton = false;
var existingTriggerGUID;
var recordGroupGUIDArrs      = [];
var preLoadedWorkType;

function showListOfTriggers() {

	var TriggersURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Triggers?orderby=TriggerName ASC";
		
	$.getJSON(TriggersURL, function( data ) {
		setTimeout(function(){
			var existingTriggers = document.getElementById("existingTriggersList");
			$("#existingTriggersList").html(""); 
				 
			for(var key in data) {
				 var currentObject = data[key];
				 
				 option          = document.createElement("option");
				 option.value    = currentObject.TriggerGUID;
				 option.text     = currentObject.TriggerName;
							
				 existingTriggers.add(option); 
			}
			
			$("#existingTriggersList").material_select();
			loadExistingTriggerStep2();
		}, 500);
	});
}

function loadExistingTriggers() {
	
	var initialHTML	=	'<div class="row">' +
							'<div class="col s1"><div class="white-text waves-effect blue btn btn-floating">1</div></div>' +
							'<div class="col s2 white-text">Find Trigger</div>' +
						'</div>' +
						'<div class="row">'  +
							'<div class="white-text input-field col s3 offset-s1">' +
								'<select id="existingTriggersList" onChange="loadExistingTriggerStep2()"></select>' +
								'<label>Select Existing Trigger</label>' +
							'</div>' +
						'</div>' +
						'<div id="existingSection2"></div>' +
						'<div id="existingSection3"></div>';
						
	$("#content").hide().html(initialHTML).fadeIn('slow');
	
	showListOfTriggers();
}

function loadExistingTriggerStep2() {
	
	var step2HTML	=	'<div class="row">' +
							'<div class="col s1"><div class="white-text waves-effect blue btn btn-floating">2</div></div>' +
							'<div class="col s2 white-text">Review Existing:</div>' +
							'<div class="col s2 white-text">Execute <u>ONLY IF</u></div>' +
						'</div>';
	
	var ConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/TriggerConditions?where=\"TriggerGUID='" + $("#existingTriggersList").val() + "'\"";
		
	$.getJSON(ConditionsURL, function( data ) {
				
		for(var i = 1; i <= data.length; i++) {
	
			var index = i - 1;
			var currentObject = data[index];
			
			(currentObject.LeftHandSide == "WorkType") ? preLoadedWorkType = currentObject.RightHandSide : false;
			
			(i != 1) ? step2HTML += '<div class="row"><div class="col s1 offset-s10">AND</div></div>' : false;
			
			step2HTML	+=	'<div class="row">' +
								'<div class="white-text input-field col s3 offset-s1">' +
									'<select id="eCond_' + i + '_lhs" onChange="elhsDDChange(\'' + i + '\', \'NULL\')"></select>' +
									'<label>Select Condition</label>' +
								'</div>' +
								'<div class="white-text input-field col s3">' +
									'<select id="eCond_' + i + '_operand"></select>' +
									'<label>Select Operand</label>' +
								'</div>' +
								'<div class="white-text input-field col s3">' +
									'<select id="eCond_' + i + '_rhs" onChange="loadExistingTriggerStep3()"></select>' +
									'<label>Select Value</label>' +
								'</div>' +
							'</div>';
	    			
			if(data.length == i) {
				step2HTML +=	'<div class="row">' +
									'<div class="col s2 offset-s8"><div style="width:150px" class="waves-effect waves-light btn blue white-text" id="existingAddButton' + i + '">Add</div></div>' +
									'<div class="col s2"><div style="width:150px" class="waves-effect waves-light btn red white-text" id="existingRemoveButton' + i + '">Remove</div></div>' +
								'</div>';
			}
			else {
				step2HTML	+=	'<div class="row" style="display:none;">' +
									'<div class="col s2 offset-s8"><div style="width:150px" class="waves-effect waves-light btn blue white-text" id="existingAddButton' + i + '">Add</div></div>' +
									'<div class="col s2"><div style="width:150px" class="waves-effect waves-light btn red white-text" id="existingRemoveButton' + i + '">Remove</div></div>' +
								'</div>';
			}
		}	
		
		$("#existingSection2").hide().html(step2HTML).fadeIn('slow');
		
		/*Once the number of drop downs are loaded, we're going to pre-populate them with values.*/
		//Here now, we need to assign all of the drop down options to the select fields
		
		
		var c = 1;
		
		for(var key in data) {
			var currentObject = data[key];

			elhsDDLID        = "eCond_" + c + "_lhs";
			elhsJQDDLID      = "#" + elhsDDLID;
			
			//Let's wipe out the options.
			$(elhsJQDDLID).html("");
			
			var elhsDDL      = document.getElementById(elhsDDLID);
			     
			for(var optionKey in lhsOptions) {
				var option		= document.createElement("option");
			    option.text	= lhsOptions[optionKey];
			     
			    (currentObject.LeftHandSide == lhsOptions[optionKey]) ? option.selected = true: false;			     	
			    elhsDDL.add(option); 
			}


			//Here we are assigning the operands
			eopDDLID        = "eCond_" + c + "_operand";
			eopJQDDLID      = "#" + eopDDLID;
			
			//Let's wipe out the options.
			$(eopJQDDLID).html("");
			
			var eopDDL      = document.getElementById(eopDDLID);
		
			for(var optionKey in operandOptions) {
				var option2          = document.createElement("option");
				option2.value        = operandOptions[optionKey];
			    option2.text         = operandOptions[optionKey];
			     
   			    (currentObject.Operand == operandOptions[optionKey]) ? option2.selected = true : false;			     
			    eopDDL.add(option2); 
			}
			
			$("#eCond_" + (parseInt(key) + 1) + "_lhs").material_select();
			$("#eCond_" + (parseInt(key) + 1) + "_operand").material_select();
			
			var lastLoad = (c == data.length) ? true : false;
			
			elhsDDChange(c, currentObject.RightHandSide, lastLoad);
	
			initialBindExistingEventsStep2(c);
			 
			c++;
		}

		existingConditionalCount    = data.length;
		existingCurrentAddButton    = "#existingAddButton" + data.length;
		existingCurrentRemoveButton = "#existingRemoveButton" + data.length;
		
		//bindExistingEventsStep2();	
	});
}

function initialBindExistingEventsStep2(currentCount) {
	
	existingCurrentAddButton    = "#existingAddButton" + currentCount;
	existingCurrentRemoveButton = "#existingRemoveButton" + currentCount;
	
	$(existingCurrentAddButton).bind("click", function() { insertExistingConditionalRow(); });
	
	$(existingCurrentRemoveButton).bind("click", function() {
		$("#existingSection2 .row:last-child").prev().prev().prev().fadeIn(300);
		$("#existingSection2 .row:last-child").prev().prev().fadeOut(300, function() { $(this).remove(); });
		$("#existingSection2 .row:last-child").prev().fadeOut(300, function() { $(this).remove(); });
		$("#existingSection2 .row:last-child").fadeOut(300, function() {
			$(this).remove();		
			existingCurrentAddButton = "#existingAddButton" + existingConditionalCount;
			
			if(existingConditionalCount > 1) {
				existingCurrentRemoveButton = "#existingRemoveButton" + existingConditionalCount;
			}	
		});

		existingConditionalCount--;
	});		
}


function insertExistingConditionalRow() {
		
	existingConditionalCount++;
			
	var conditionalRowHTML	=	$('<div class="row"><div class="col s1 offset-s10">AND</div></div>' +
								'<div class="row">' +
									'<div class="white-text input-field col s3 offset-s1">' +
										'<select id="eCond_' + existingConditionalCount + '_lhs" onChange="elhsDDChange(\'' + existingConditionalCount + '\', \'NULL\')"></select>' +
										'<label>Select Condition</label>' +
									'</div>' +
									'<div class="white-text input-field col s3">' +
										'<select id="eCond_' + existingConditionalCount + '_operand"></select>' +
										'<label>Select Operand</label>' +
									'</div>' +
									'<div class="white-text input-field col s3">' +
										'<select id="eCond_' + existingConditionalCount + '_rhs"></select>' +
										'<label>Select Value</label>' +
									'</div>' +
								'</div>' +
								'<div class="row">' +
									'<div class="col s2 offset-s8"><div style="width:150px" class="waves-effect waves-light btn blue white-text" id="existingAddButton' + existingConditionalCount + '">Add</div></div>' +
									'<div class="col s2"><div style="width:150px" class="waves-effect waves-light btn red white-text" id="existingRemoveButton' + existingConditionalCount + '">Remove</div></div>' +
								'</div>');
								
	conditionalRowHTML.hide();
	$("#existingSection2 .row:last-child").hide();
	$("#existingSection2 .row:last-child").after(conditionalRowHTML);
	conditionalRowHTML.fadeIn("slow");
	
	existingCurrentAddButton    = "#existingAddButton" + existingConditionalCount;
	existingCurrentRemoveButton = "#existingRemoveButton" + existingConditionalCount;
	
	//Need to rebind the new buttons...
	bindExistingEventsStep2();
}

function bindExistingEventsStep2() {
	
	$(existingCurrentAddButton).bind("click", function() { insertExistingConditionalRow(); });
	
	$(existingCurrentRemoveButton).bind("click", function() {
		$("#existingSection2 .row:last-child").prev().prev().prev().fadeIn(300);
		$("#existingSection2 .row:last-child").prev().prev().fadeOut(300, function() { $(this).remove(); });
		$("#existingSection2 .row:last-child").prev().fadeOut(300, function() { $(this).remove(); });
		$("#existingSection2 .row:last-child").fadeOut(300, function() {
			$(this).remove();	
		
			existingCurrentAddButton = "#existingAddButton" + existingConditionalCount;
			(existingConditionalCount > 1) ? existingCurrentRemoveButton = "#existingRemoveButton" + existingConditionalCount : false;
		});

		existingConditionalCount--;
	});
	
	elhsDDLID        = "eCond_" + existingConditionalCount + "_lhs";
	elhsJQDDLID      = "#" + elhsDDLID;
	
	//Let's wipe out the options.
	$(elhsJQDDLID).html("");
	
	var elhsDDL      = document.getElementById(elhsDDLID);
	     
	for(var optionKey in lhsOptions) {
		 var option      = document.createElement("option");
	     option.text     = lhsOptions[optionKey];
	   	     	
	     elhsDDL.add(option); 
	}
	
	//Here we are assigning the operands
	eopDDLID        = "eCond_" + existingConditionalCount + "_operand";
	eopJQDDLID      = "#" + eopDDLID;
	
	//Let's wipe out the options.
	$(eopJQDDLID).html("");
	
	var eopDDL      = document.getElementById(eopDDLID);

	for(var optionKey in operandOptions) {
		 var option2          = document.createElement("option");
		 option2.value        = operandOptions[optionKey];
	     option2.text         = operandOptions[optionKey];
	     
	     eopDDL.add(option2);
	}
			
	$("#eCond_" + existingConditionalCount + "_lhs").material_select();
	$("#eCond_" + existingConditionalCount + "_operand").material_select();
			
	elhsDDChange(existingConditionalCount, null, true);
}

function elhsDDChange(instanceCount, conditionSelection, lastLoad) {
	var lhsDDListID = "#eCond_" + instanceCount + "_lhs";
	
	//Here we are assigning the operands
	var rhsDDLID        = "eCond_" + instanceCount + "_rhs";
	var rhsJQDDLID      = "#eCond_" + instanceCount + "_rhs";

	//Let's wipe out the options.
	//$(rhsJQDDLID).html("");
	
	var rhsDDL      = document.getElementById(rhsDDLID);	
	
	/************
		Beacon 
	*************/
	
	if($(lhsDDListID).val() == "Beacon") {
		
		var operandDDIDMain  = "#eCond_" + instanceCount + "_operand";
		var operandDDID      = "#eCond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2     = "#eCond_" + instanceCount + "_operand option[value='Less Than']";
		
		$(operandDDID).attr('disabled', true);
		$(operandDDID2).attr('disabled', true);
		
		$("#eCond_" + instanceCount + "_operand").material_select();
		
		var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Beacons?orderby=Name ASC";
		
		$.getJSON(RHSConditionsURL, function( data ) {
				
			$(rhsJQDDLID).html("");
			
			for(var key in data) {
				 var currentObject = data[key];
				 
				 option          = document.createElement("option");
				 option.value    = currentObject.TableRecordGUID;
			     option.text     = currentObject.Name;
			     
			     (option.value == conditionSelection) ? option.selected = true : false;
			     			
			     rhsDDL.add(option);
			}

			$("#eCond_" + instanceCount + "_rhs").material_select();
			$("#eCond_" + instanceCount + "_rhs").parent().next().html("Select Beacon");
			
			(lastLoad == true) ? loadExistingTriggerStep3() : false;
		});
	}
	
	/************
		GPS Region 
	*************/
	
	if($(lhsDDListID).val() == "GPS Region") {
		
		var operandDDIDMain  = "#eCond_" + instanceCount + "_operand";
		var operandDDID      = "#eCond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2     = "#eCond_" + instanceCount + "_operand option[value='Less Than']";
			
		$(operandDDID).attr('disabled', true);
		$(operandDDID2).attr('disabled', true);
		
		$("#eCond_" + instanceCount + "_operand").material_select();
		
		var RHSConditionsURL2 = ruIP + ruPort + listsDB + listEN + "read/geo/Region?where=\"RegionType = 'Global' AND SiteGUID = '"+UserData[0].SiteGUID+"' ORDER BY RegionName ASC\"";
		
		$.getJSON(RHSConditionsURL2, function( data2 ) {
			
			$(rhsJQDDLID).html("");
					
			for(var key in data2) {
				 var currentObject = data2[key];
				 var rhsDDLID2        = "eCond_" + instanceCount + "_rhs";	
				 var rhsJQDDLID2      = "#" + rhsDDLID2;
				 var rhsDDL2          = document.getElementById(rhsDDLID2);
				 
				 var option2          = document.createElement("option");
				 option2.value        = currentObject.RegionGUID;
				 option2.text         = currentObject.RegionName;
				 
				 (option2.value == conditionSelection) ? option2.selected = true : false;
									 
				 $(rhsJQDDLID2).append(option2); 
			}
			
			$("#eCond_" + instanceCount + "_rhs").material_select();
			$("#eCond_" + instanceCount + "_rhs").parent().next().html("Select GPS Region");
		
			(lastLoad == true) ? loadExistingTriggerStep3() : false;
		});
	}
	
	/************
		Status 
	*************/
	
	if($(lhsDDListID).val() == "Status") {
		
		var operandDDIDMain  = "#eCond_" + instanceCount + "_operand";
		var operandDDID      = "#eCond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2     = "#eCond_" + instanceCount + "_operand option[value='Less Than']";
			
		$(operandDDID).attr('disabled', true);
		$(operandDDID2).attr('disabled', true);
		
		$("#eCond_" + instanceCount + "_operand").material_select();
		
		var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_Status?orderby=SYS_Status ASC";
		
		$.getJSON(RHSConditionsURL, function( data ) {
				
			$(rhsJQDDLID).html("");
			
			for(var key in data) {
				 var currentObject = data[key];
				 
				 option          = document.createElement("option");
				 option.text     = currentObject.SYS_Status;
				 
				 (option.text == conditionSelection) ? option.selected = true : false;
								
				 rhsDDL.add(option); 
			}
						
			$("#eCond_" + instanceCount + "_rhs").material_select();
			$("#eCond_" + instanceCount + "_rhs").parent().next().html("Select Status");
				
			(lastLoad == true) ? loadExistingTriggerStep3() : false;
		});
	}
	
	/************
		WorkType
	*************/
	
	else if($(lhsDDListID).val() == "WorkType") {
		var operandDDIDMain  = "#eCond_" + instanceCount + "_operand";
		var operandDDID      = "#eCond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2     = "#eCond_" + instanceCount + "_operand option[value='Less Than']";
			
		$(operandDDID).attr('disabled', true);
		$(operandDDID2).attr('disabled', true);
		
		$("#eCond_" + instanceCount + "_operand").material_select();
		
		var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_WorkTypeName?orderby=SYS_WorkTypeName ASC";
		
		$.getJSON(RHSConditionsURL, function( data ) {
	
			$(rhsJQDDLID).html("");
										
			for(var key in data) {
				 var currentObject = data[key];
				 
				 option          = document.createElement("option");
				 option.text     = currentObject.SYS_WorkTypeName;
				 
				 (option.text == conditionSelection) ? option.selected = true : false;
							
				 rhsDDL.add(option); 
			}
			
			$("#eCond_" + instanceCount + "_rhs").material_select();
			$("#eCond_" + instanceCount + "_rhs").parent().next().html("Select WorkType");	
			
			(lastLoad == true) ? loadExistingTriggerStep3() : false;					
		});
	}
	
	/************
		GPS Speed
	*************/
	
	if($(lhsDDListID).val() == "GPS Speed") {
		var operandDDID      = "#eCond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2     = "#eCond_" + instanceCount + "_operand option[value='Less Than']";
		
		$(operandDDID).attr('disabled', false);
		$(operandDDID2).attr('disabled', false);
		
		$("#eCond_" + instanceCount + "_operand").material_select();
		
		var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_GPSSpeed";
		
		$.getJSON(RHSConditionsURL, function( data ) {
			
			$(rhsJQDDLID).html("");
			
			for(var key in data) {
				 var currentObject = data[key];
				 
				 option          = document.createElement("option");
				 option.text     = currentObject.SYS_GPSSpeed;
				 
				 rhsDDL.add(option); 
			}
			
			$(rhsJQDDLID).html($("option", $(rhsJQDDLID)).sort(function(a, b) { 
				return parseInt(a.text) == parseInt(b.text) ? 0 : parseInt(a.text) < parseInt(b.text) ? -1 : 1; 
			}));
			
			$(rhsJQDDLID).val(conditionSelection);

			$("#eCond_" + instanceCount + "_rhs").material_select();
			$("#eCond_" + instanceCount + "_rhs").parent().next().html("Select GPS Speed");	
			
			(lastLoad == true) ? loadExistingTriggerStep3() : false;
		});
	}

	if($(lhsDDListID).val() == "EventStarted") {
		var operandDDID  = "#cond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2 = "#cond_" + instanceCount + "_operand option[value='Less Than']";
		var operandDDID3 = "#cond_" + instanceCount + "_operand option[value='Not Equals']";

		$(operandDDID).attr('disabled', true);
		$(operandDDID2).attr('disabled', true);
		$(operandDDID3).attr('disabled', true);
		
		$("#eCond_" + instanceCount + "_operand").material_select();
		
		var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_EventTypes";
		
		$.getJSON(RHSConditionsURL, function( data ) {
			
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
			
			$("#eCond_" + instanceCount + "_rhs").material_select();
			$("#eCond_" + instanceCount + "_rhs").parent().next().html("Select EventStarted");					


			(lastLoad == true) ? loadExistingTriggerStep3() : false;
		});
	}
	
	if($(lhsDDListID).val() == "Sequence") {
		var operandDDID  = "#cond_" + instanceCount + "_operand option[value='Greater Than']";
		var operandDDID2 = "#cond_" + instanceCount + "_operand option[value='Less Than']";
		var operandDDID3 = "#cond_" + instanceCount + "_operand option[value='Not Equals']";

		$(operandDDID).attr('disabled', true);
		$(operandDDID2).attr('disabled', true);
		$(operandDDID3).attr('disabled', false);
		
		$("#eCond_" + instanceCount + "_operand").material_select();
		
		var currentWorkType; 
		var RHSConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SequenceType_states_worktype?where=\"work_type_name='"+ preLoadedWorkType + "'\"";
			
		$.getJSON(RHSConditionsURL, function( data ) {
			
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
			
			$(rhsJQDDLID).val(conditionSelection);
			
			$("#eCond_" + instanceCount + "_rhs").material_select();
			$("#eCond_" + instanceCount + "_rhs").parent().next().html("Select Sequence");					


			(lastLoad == true) ? loadExistingTriggerStep3() : false;
		});
	}
}

function loadExistingTriggerStep3() {
	
	var ConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/TriggerImpacts?where=\"TriggerGUID='" + $("#existingTriggersList").val() + "'\"";
		
	$.getJSON(ConditionsURL, function( data ) {
		var step3HTML	=	'<div class="row">' +
								'<div class="col s1"><div class="white-text waves-effect blue btn btn-floating">3</div></div>' +
								'<div class="col s2 white-text">Review Impacts:</div>' +
							'</div>';
		
		for(var i = 1; i<=data.length; i++) {
			step3HTML	+=	'<div class="row">' +
								'<div class="white-text col s1 offset-s1 valign-wrapper" style="height:70px"><span class="valign center-align">Change:</span></div>' +
								'<div class="white-text input-field col s3">' +
									'<select id="existingImpactOptions'+i+'" onChange="existingAdjustNextImpact(\''+ i +'\')"></select>' +
									'<label>Select Impact</label>' +
								'</div>' +
								'<div class="white-text col s1 valign-wrapper" style="height:70px"><span class="valign center-align">to</span></div>' +
								'<div class="white-text input-field col s3">' +
									'<select id="existingNextImpact'+i+'" onChange="existingNextImpactDidChange(\'' + i + '\')"></select>' +
									'<label>Select InfoScreen</label>' +
								'</div>' +
							'</div>' +
							'<div class="row">' +
								'<div class="col s6 offset-s2"><div id="existingjqxwidget' + i + '"><div id="existingjqxgrid' + i + '" style="height:400px; width:580px; display:none;"></div></div></div>' +
							'</div>' +
							'<div class="row"';
			
			(i < data.length) ? step3HTML += ' style="display:none;">' : step3HTML += '>';
			
			step3HTML += '<div class="col s2 offset-s';

	    	(i >= data.length) ? step3HTML += '8"><div style="width: 150px" class="waves-effect waves-light btn blue white-text" id="existingFaddButton' + i + '">Add</div></div><div class="col s2"><div style="width: 150px" class="waves-effect waves-light btn red white-text" id="efremoveButton' + i + '">Remove</div></div></div>' : step3HTML += '10"><div style="width: 150px" class="waves-effect waves-light btn blue white-text" id="existingFaddButton' + i + '">Add</div></div></div>';
	    }
	    
	    step3HTML	+=	'<div class="row"><div class="col s2 offset-s10"><div style="width: 150px" class="waves-effect waves-light btn black white-text" id="existingUpdateButton">UPDATE</div></div></div>';
		
	    $("#existingSection3").hide().html(step3HTML).fadeIn('slow');
	    
	    var c = 1;
	    //Here we need to bind the existing impacts
	    for(var key in data) {
	    	bindInitialExistingStep3Events(c, data[key]);
	    	c++;
	    }
	    
	    existingImpactCount = data.length;    
    });
    
   
    setTimeout(function () {
        $("#existingUpdateButton").click(function() { updateExistingTrigger(); });
    }, 1000);

}

function bindInitialExistingStep3Events(currentCount, currentObject) {

	//Here now, we need to assign all of the impact types to the change drop down box in step 3.
	itDDLID        = "existingImpactOptions" + currentCount;
	itJQDDLID      = "#" + itDDLID;
	
	//Let's wipe out the options.
	$(itJQDDLID).html("");
	
	var itDDL      = document.getElementById(itDDLID);
	     
	for(var optionKey in impactTypes) {
		option          = document.createElement("option");
	    option.text     = impactTypes[optionKey];
	     	
	    if(currentObject != "NULL") {		
			if(currentObject.TriggerImpactType == impactTypes[optionKey]) {
				option.selected = true;
				$("#existingNextImpact" + currentCount).closest(".input-field").find("label").html("Select " + impactTypes[optionKey]);
			}
			
			if(currentObject.TriggerImpactType == "RequiredDetails" || currentObject.TriggerImpactType == "OptionalDetails") {
				(impactTypes[optionKey] == "InfoScreen") ? option.selected = true : false;
			}
		}
		
	    itDDL.add(option);
	}
	
	$("#existingImpactOptions" + currentCount).material_select();
	
	//After the selection, we need to get the right side data.
	var objectToSend = (currentObject != "NULL") ? currentObject.TriggerImpact : "NULL";
	
	bindInitialExistingRightSideStep3Events(currentCount, objectToSend);
	
	var addButtonID = "#existingFaddButton" + currentCount;
	
	$(addButtonID).bind("click", function() { insertExistingImpactRow(addButtonID); });
	
	var currentRemoveButton = "#efremoveButton" + currentCount;
	
	$(currentRemoveButton).bind("click", function() {
		$("#existingSection3 .row:last-child").prev().prev().prev().prev().fadeIn(300);
		$("#existingSection3 .row:last-child").prev().prev().prev().fadeOut(300, function() { $(this).remove(); });
		$("#existingSection3 .row:last-child").prev().prev().fadeOut(300, function() { $(this).remove(); });
		$("#existingSection3 .row:last-child").prev().fadeOut(300, function() {
			$(this).remove();
		
			existingImpactCount--;
			
			existingCurrentAddButton = "#existingFaddButton" + existingImpactCount;
			
			(existingImpactCount > 1) ? existingCurrentRemoveButton = "#efremoveButton" + existingImpactCount : false;	
		 });

	});
}

function insertExistingImpactRow(addButtonID) {
	
	(existingImpactCount > 1) ? currentRemoveButton = "#efremoveButton" + existingImpactCount : false;
	
	var currentAddButton = "#existingFaddButton" + existingImpactCount;
		
	existingImpactCount++;
	
	var conditionalRowHTML = $('<div class="row">' +
									'<div class="white-text col s1 offset-s1 valign-wrapper" style="height:70px"><span class="valign center-align">Change:</span></div>' +
									'<div class="white-text input-field col s3">' +
										'<select id="existingImpactOptions' + existingImpactCount + '" onChange="existingAdjustNextImpact(\'' + existingImpactCount + '\')"></select>' +
										'<label>Select Impact</label>' +
									'</div>' +
									'<div class="white-text col s1 valign-wrapper" style="height:70px"><span class="valign center-align">to</span></div>' +
									'<div class="white-text input-field col s3">' +
										'<select id="existingNextImpact' + existingImpactCount + '" onChange="existingNextImpactDidChange(\'' + existingImpactCount + '\')"></select>' +
										'<label>Select InfoScreen</label>' +
									'</div>' +
								'</div>' +
								'<div class="row">' +
									'<div class="col s6 offset-s2"><div id="existingjqxwidget' + existingImpactCount + '"><div id="existingjqxgrid' + existingImpactCount + '" style="height:400px; width:580px; display:none;"></div></div></div>' +
								'</div>' +
								'<div class="row">' +
									'<div class="col s2 offset-s8"><div style="width: 150px" class="waves-effect waves-light btn blue white-text" id="existingFaddButton' + existingImpactCount + '">Add</div></div>' +
									'<div class="col s2"><div style="width: 150px" class="waves-effect waves-light btn red white-text" id="efremoveButton' + existingImpactCount + '">Remove</div></div>' +
								'</div>');
	conditionalRowHTML.hide();	

	$("#existingSection3 .row:last-child").prev().hide();
	$("#existingSection3 .row:last-child").before(conditionalRowHTML);
	conditionalRowHTML.fadeIn("slow");
	
	bindInitialExistingStep3Events(existingImpactCount, "NULL");
}

function bindInitialExistingRightSideStep3Events(currentCount, triggerImpact) {
	existingAdjustNextImpactInitial(currentCount, triggerImpact);
}

function existingAdjustNextImpactInitial(passedImpact, triggerImpact) {

	var jqxGridID = "#existingjqxgrid" + passedImpact;
	var jqxWidgetID = "#existingjqxwidget" + passedImpact;
	
	//Here, we're setting the variables for the "Next Impact" drop down list.
	var niDDLID        = "existingNextImpact" + passedImpact;
	var niJQDDLID      = "#" + niDDLID;
	
	var impactOptions  = "#existingImpactOptions" + passedImpact;
	
	//Let's wipe out the options.
	$(niJQDDLID).html("");
	
	var niDDL      = document.getElementById(niDDLID);
	
	if($(impactOptions).val() == "Sequence") {
		$(jqxGridID).fadeOut();

		$(niJQDDLID).html("");
		$(niJQDDLID).parent().next().html("");
		
		var  option     = document.createElement("option");
	    option.text     = "Next";
		
	    (triggerImpact == "Next") ? option.selected = true : false;
				     			
		niDDL.add(option); 
		
		var  option2     = document.createElement("option");
	    option2.text     = "Custom";
	    
	    (triggerImpact != "Next" && triggerImpact != "NULL") ? option2.selected = true : false;
				     			
		niDDL.add(option2);
			
		$(niJQDDLID).parent().next().html("Select Sequence");	
		$(niJQDDLID).material_select();
	
		$(niJQDDLID).parent().parent().css({"display":"block"});
		
		(triggerImpact != "Next" && triggerImpact != "NULL") ? showExistingSequenceGrid(passedImpact, triggerImpact) : false;			 
	}
	
	if($(impactOptions).val() == "InfoScreen") {
		$(jqxGridID).fadeOut();

		$(niJQDDLID).html("");
		$(niJQDDLID).parent().next().html("");
		
		var  option     = document.createElement("option");
		option.text     = "Required Details";					     			
		niDDL.add(option); 
		
		(triggerImpact == "Required Details") ? option.selected = true : false;
		
		var  option2     = document.createElement("option");
		option2.text     = "Optional Details";
		
		(triggerImpact == "Optional Details") ? option.selected = true : false;
								
		niDDL.add(option2);
		
		$(niJQDDLID).parent().next().html("Select InfoScreen");	
		$(niJQDDLID).material_select();
		
		$(niJQDDLID).parent().parent().css({"display":"block"});

		showExistingFormsGrid(passedImpact, triggerImpact);
	}
	
	if($(impactOptions).val() == "Status") {
		$(niJQDDLID).parent().parent().hide();
		showExistingStatusGrid(passedImpact, triggerImpact); 	
	}
}

function showExistingFormsGrid(passedImpact, triggerImpact) {

	var jqxGridID = "#existingjqxgrid" + passedImpact;
	var jqxWidgetID = "#existingjqxwidget" + passedImpact;
	
	$(jqxGridID).jqxGrid('destroy');
	$(jqxWidgetID).prepend('<div id="existingjqxgrid' + passedImpact + '"></div>');
	
    var NIConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/FormStructures?where=\"1=1 ORDER BY FormStructureName\"";

	// prepare the data
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'FormStructureGUID', type: 'string' },
			{ name: 'FormStructureName', type: 'string' },
			{ name: 'Description', type: 'string' }
		],
		url: NIConditionsURL,
		id: "FormStructureGUID"
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	$(jqxGridID).on("bindingcomplete", function (event) {
	
		if(triggerImpact != "NULL") {
			var rowIndex = $(jqxGridID).jqxGrid('getrowboundindexbyid', triggerImpact);
			$(jqxGridID).jqxGrid('selectrow', rowIndex);
		}
	}); 
	
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
        editable: false,
		enabletooltips: true,
		columns: [
			{ text: 'FormStructureGUID', datafield: 'FormStructureGUID', width: 250, hidden: true },
			{ text: 'Form Structure Name', datafield: 'FormStructureName', width: 285 },
			{ text: 'Description', datafield: 'Description', cellsalign: 'left', align: 'left', width: 285 }
		]
	});
	
	$(jqxGridID).fadeIn();
}

function showExistingStatusGrid(passedImpact, triggerImpact) {
	//We need to grab the current work type	
	for(var i = 1; i<=existingConditionalCount; i++) {	
		var lhsDDListID     = "#eCond_" + i + "_lhs";
		var rhsDDListID     = "#eCond_" + i + "_rhs";
		
		($(lhsDDListID).val() == "WorkType" && $(rhsDDListID).val().length > 1) ? existingCurrentWorkType = $(rhsDDListID).val() : false;
	}
		
	var jqxGridID = "#existingjqxgrid" + passedImpact;
	var jqxWidgetID = "#existingjqxwidget" + passedImpact;
	
	$(jqxGridID).jqxGrid('destroy');
	$(jqxWidgetID).prepend('<div id="existingjqxgrid' + passedImpact + '"></div>');
	
    var NIConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/StatusCodes_equip_worktype?where=\"work_type_name='" + existingCurrentWorkType + "' ORDER BY status ASC\"";

	// prepare the data
	var source = {
		datatype: "json",
		datafields: [
			{ name: 'TableRecordGUID', type: 'string' },
			{ name: 'work_type_name', type: 'string' },
			{ name: 'status', type: 'string' },
			{ name: 'status_reason_code', type: 'string' }       
		],
		url: NIConditionsURL,
		id: "TableRecordGUID"
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	$(jqxGridID).on("bindingcomplete", function (event) {
	
		if(triggerImpact != "NULL") {
			var rowIndex = $(jqxGridID).jqxGrid('getrowboundindexbyid', triggerImpact);
			$(jqxGridID).jqxGrid('selectrow', rowIndex);
		}
	}); 
	
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

function showExistingSequenceGrid(passedImpact, triggerImpact) {

	//We need to grab the current work type	
	for(var i = 1; i<=existingConditionalCount; i++) {	
		var lhsDDListID     = "#eCond_" + i + "_lhs";
		var rhsDDListID     = "#eCond_" + i + "_rhs";
		
		($(lhsDDListID).val() == "WorkType" && $(rhsDDListID).val().length > 1) ? existingCurrentWorkType = $(rhsDDListID).val() : false;
	}
	
	var jqxGridID = "#existingjqxgrid" + passedImpact;
	var jqxWidgetID = "#existingjqxwidget" + passedImpact;
	
	$(jqxGridID).jqxGrid('destroy');
	$(jqxWidgetID).prepend('<div id="existingjqxgrid' + passedImpact + '"></div>');
	
    var NIConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SequenceType_states_worktype?where=\"work_type_name='" + existingCurrentWorkType + "' ORDER BY sequence_type_name ASC\"";

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
		url: NIConditionsURL,
		id: "TableRecordGUID"
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	$(jqxGridID).on("bindingcomplete", function (event) {
		if(triggerImpact != "NULL") {
			var rowIndex = $(jqxGridID).jqxGrid('getrowboundindexbyid', triggerImpact);
			$(jqxGridID).jqxGrid('selectrow', rowIndex);
		}
	}); 
	
	
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

function existingNextImpactDidChange(passedImpact) {
	var nextImpactID = "#existingNextImpact" + passedImpact;
	var impactOptionsID = "#existingImpactOptions" + passedImpact;
	
	
	if($(nextImpactID).val() == "Custom" && $(impactOptionsID).val() == "Sequence" && checkExistingRequiredConditionals("Sequence") == true) {
		showExistingSequenceGrid(passedImpact, "NULL");
	}
	else if($(nextImpactID).val() == "Next" && $(impactOptionsID).val() == "Sequence" && checkExistingRequiredConditionals("Sequence") == true) {
		var jqxGridID = "#existingjqxgrid" + passedImpact;
		$(jqxGridID).fadeOut();
	}
}

function existingAdjustNextImpact(passedImpact) {

	var jqxGridID = "#existingjqxgrid" + passedImpact;
	var jqxWidgetID = "#existingjqxwidget" + passedImpact;
	
	//Here, we're setting the variables for the "Next Impact" drop down list.
	var niDDLID        = "existingNextImpact" + passedImpact;
	var niJQDDLID      = "#" + niDDLID;
	
	var impactOptions  = "#existingImpactOptions" + passedImpact;
	
	//Let's wipe out the options.
	$(niJQDDLID).html("");
	
	var niDDL      = document.getElementById(niDDLID);
	
	if($(impactOptions).val() == "Sequence") {
		if(checkExistingRequiredConditionals("Sequence", passedImpact) == true) {
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

		showExistingFormsGrid(passedImpact, "NULL");
	}
	
	if($(impactOptions).val() == "Status") {
		if(checkExistingRequiredConditionals("Status", passedImpact) == true) {
			$(niJQDDLID).parent().parent().hide();
			showExistingStatusGrid(passedImpact, "NULL");
		} 	
	}

}

function checkExistingRequiredConditionals(impact, passedImpact) {
	
	var niDDLID        = "existingNextImpact" + passedImpact;
	var niJQDDLID      = "#" + niDDLID;
	
	var impactOptions  = "#existingImpactOptions" + passedImpact;
	
	if(impact == "Sequence" || impact == "Status") {
		//Step 1 is to create new tables with a list value of 1.
		for(var i = 1; i<=existingConditionalCount; i++) {	
			var lhsDDListID     = "#eCond_" + i + "_lhs";
			var rhsDDListID     = "#eCond_" + i + "_rhs";
			
			if($(lhsDDListID).val() == "WorkType" && $(rhsDDListID).val().length > 1) {
				currentWorkType = $(rhsDDListID).val();
				return true;
			}
		}
	}
	
	$(niJQDDLID).html("");
	$(impactOptions).val("-1");
	
	DisplayAlert("Alert","A work type is required as a condition to use this impact.");
	
	return false;
}

function updateExistingTrigger() {
	recordGroupGUIDArrs = [];
	
	var ConditionsURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Triggers?where=\"TriggerGUID='" + $("#existingTriggersList").val() + "'\"";	
	
	$.getJSON(ConditionsURL, function( data ) {
		
		for(var i = 0; i<data.length; i++) {
			var currentObject = data[i];
			recordGroupGUIDArrs.push(currentObject.TableRecordGUID);
			
			(i == data.length - 1) ? updateExistingTriggerStep2() : false;
		}
	});
}

function updateExistingTriggerStep2() {
		
	var Conditions2URL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/TriggerConditions?where=\"TriggerGUID='" + $("#existingTriggersList").val() + "'\"";	
	
	$.getJSON(Conditions2URL, function( data ) {
		
		for(var i = 0; i<data.length; i++) {
			var currentObject = data[i];
			recordGroupGUIDArrs.push(currentObject.TableRecordGUID);
			
			(i == data.length - 1) ? updateExistingTriggerStep3() : false;
		}
	});
}

function updateExistingTriggerStep3() {
		
	var Conditions3URL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/TriggerImpacts?where=\"TriggerGUID='" + $("#existingTriggersList").val() + "'\"";	
	
	$.getJSON(Conditions3URL, function( data ) {
		
		for(var i = 0; i<data.length; i++) {
			var currentObject = data[i];
			recordGroupGUIDArrs.push(currentObject.TableRecordGUID);
			
			(i == data.length - 1) ? removeExistingTrigger() : false;
		}
	});
}

function removeExistingTrigger() {

	var eventBatchArray  = [];
	var fieldsDictionary = {};
	
	for(var key in recordGroupGUIDArrs) {
		var currentGUID = recordGroupGUIDArrs[key];
		
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
            submitExistingStep1Info();
        },
        error: function(){
             DisplayAlert("Alert","Unable to update details at this time. Please try again later.");
        }
	 });
}

function submitExistingStep1Info() {

	var fields      = {};	
	var mainDict    = {};
	
	existingTriggerGUID  = CreateGUID();
	
	mainDict.TriggerGUID = existingTriggerGUID;
	mainDict.TriggerName = $("#existingTriggersList option:selected").text();
	
	fields.fields = mainDict;
	
	$.ajax ({
        headers: {
             "Content-Type": "application/json"
        },
        url: ruIP + ruPort + listsDB + listEN + "create/virtual/" + UserData[0].SiteGUID + "/Triggers",
        type: "POST",
        data: JSON.stringify(fields),
        success: function(){
            submitExistingStep2Info();
        },
        error: function(){
             DisplayAlert("Alert","Unable to insert trigger details at this time. Please try again later.");
        }
	 });
}

function submitExistingStep2Info() {

	var containingObject = {};
	var mainDictionary   = [];
		
		
	//Step 1 is to create new tables with a list value of 1.
	for(var i = 1; i<=existingConditionalCount; i++) {
		var currentObject = {};

		var lhsDDListID     = "#eCond_" + i + "_lhs";
		var rhsDDListID     = "#eCond_" + i + "_rhs";
		var operandDDListID = "#eCond_" + i + "_operand";

		currentObject.TriggerConditionGUID = CreateGUID();
		currentObject.TriggerGUID          = existingTriggerGUID;
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
            submitExistingStep3Info();
        },
        error: function(){
             DisplayAlert("Alert","Unable to update trigger details at this time. Please try again later.");
        }
	 });

}

function submitExistingStep3Info() {
	
	var containingObject = {};
	var mainDictionary   = [];
		
		
	//Step 1 is to create new tables with a list value of 1.
	for(var i = 1; i<=existingImpactCount; i++) {
		var currentObject = {};

		currentObject.TriggerGUID       = existingTriggerGUID;
		currentObject.TriggerImpactGUID = CreateGUID();
		
		var currentImpactObject         = "#existingImpactOptions" + i;
		var nextImpactObject            = "#existingNextImpact" + i;
				
		var TriggerImpType = $(currentImpactObject).val();
		
		if($(currentImpactObject).val() == "InfoScreen") {
			($(nextImpactObject).val() == "Required Details") ? TriggerImpType = "RequiredDetails" : TriggerImpType = "OptionalDetails";
		}
		
		currentObject.TriggerImpactType = TriggerImpType;
		
		
		if($(currentImpactObject).val() == "Status") {
			var currentJQXGridID        = "#existingjqxgrid" + i;
			
			var getselectedrowindexes   = $(currentJQXGridID).jqxGrid('getselectedrowindexes');
			var selectedRowData         = $(currentJQXGridID).jqxGrid('getrowdata', getselectedrowindexes[0]);
				
			currentObject.TriggerImpact = selectedRowData.TableRecordGUID;
		}
		
		else if($(currentImpactObject).val() == "Sequence" && $(nextImpactObject).val() == "Custom") {
			var currentJQXGridID        = "#existingjqxgrid" + i;
			
			var getselectedrowindexes   = $(currentJQXGridID).jqxGrid('getselectedrowindexes');
			var selectedRowData         = $(currentJQXGridID).jqxGrid('getrowdata', getselectedrowindexes[0]);
				
			currentObject.TriggerImpact = selectedRowData.TableRecordGUID;
		}
		else if($(currentImpactObject).val() == "InfoScreen") {
			var currentJQXGridID        = "#existingjqxgrid" + i;
			
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
            DisplayAlert("Success!","You have successfully updated this trigger.");
            loadExistingTriggers();
        },
        error: function(){
             DisplayAlert("Alert","Unable to update trigger details at this time. Please try again later.");
        }
	 });
}



