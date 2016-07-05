/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/CONFIG/SEQUENCES/JS
	File Name:			main.js
=============================================================*/

var sequenceslength;

$(document).ready(function() {
	$("#seq-collection").hide();
	$("#add-sequence").hide();
	$('#div-updateorder').hide();
	LoadWorkTypesDropDown();
	
	$('#btn-addsequence').click(function(){
		ExportSequence();
	});
	
	$('#btn-cancelsequence').click(function(){
		$('#sequence_state').val('');
		$('#sequence_name').val('');
		$("#sequence_productive").prop("checked", false);
		$("#sequence_movement_focused").prop("checked", false);
	});
	
	$('#div-updateorder').click(function(){
		ExportOrder();
	});
	
});

function LoadWorkTypesDropDown() {
	var jqxhrworktypes = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/WorkType", function() {
		
		var worktypeData = $.parseJSON(jqxhrworktypes.responseText);
		
    var select = $('#select-worktype').empty();
		
    select.append('<option value="'+null+'" disabled selected>Choose a Work Type</option>');
		
		for(var key in worktypeData) {
			select.append( '<option value="'
				+ worktypeData[key].TableRecordGUID
				+ '">'
				+ worktypeData[key].work_type_name
				+ '</option>' ); 
		}
    
		$('#select-worktype').material_select();
	});
}

$("#select-worktype").change(function() {
	LoadSequences();
});

function LoadSequences(){
	var namesArray = [];
	var statesArray = [];
	var worktype = $("#select-worktype :selected").text();
	
	var jqxhrsequences = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SequenceType_states_worktype?where=\"work_type_name = '"+ worktype +"' ORDER BY seq_no ASC\"", function() {
		var sequencesData = $.parseJSON(jqxhrsequences.responseText);
		var select = $("#seq-collection").html("");
		
		$("#seq-collection").show();
		$("#add-sequence").show();
		$('#div-updateorder').hide();
		$('#sequence_state').val('');
		$('#sequence_name').val('');
		$("#sequence_productive").prop("checked", false);
		$("#sequence_movement_focused").prop("checked", false);
		
		$('#seq-title').html(worktype + " Sequences List");
		
		$('#add-title').html("Add New Sequence to "+ worktype);
		
		for(var key in sequencesData){
			
			var sd_trguid	= (sequencesData[key].TableRecordGUID)				? sequencesData[key].TableRecordGUID			: 0;
			var sd_seq_no	= (sequencesData[key].seq_no)						? sequencesData[key].seq_no						: 0;
			var sd_ssn		= (sequencesData[key].sequence_state_name)			? sequencesData[key].sequence_state_name		: 0;
			var sd_stn		= (sequencesData[key].sequence_type_name)			? sequencesData[key].sequence_type_name			: 0;
			var sd_p		= (sequencesData[key].sequence_productive)			? sequencesData[key].sequence_productive		: 0;
			var sd_mf		= (sequencesData[key].sequence_movement_focused)	? sequencesData[key].sequence_movement_focused	: 0;
			
			select.append('<li class="collection-item avatar" table-record-guid="'+sd_trguid+'">'
										+'<i class="circle orange darken-3">'+sequencesData[key].seq_no+'</i>'
										+'<b>Sequence State:</b> '+sd_ssn+'</p>'
										+'<p><b>State EndPoint:</b> '+sd_stn+' <br>'
										+'<a href="#!" onclick="EditSequence(\''+sd_trguid+'\',\''+sd_stn+'\',\''+sd_ssn+'\',\''+sd_p+'\',\''+sd_mf+'\')" class="secondary-content"><i class="material-icons">edit</i></a>'
										+'<a href="#!" onclick="deleteAlert(\''+sd_trguid+'\')" class="secondary-content2"><i class="material-icons">delete</i></a></li>');
			
			namesArray.push(sequencesData[key].sequence_type_name);
			statesArray.push(sequencesData[key].sequence_state_name);
		}
		sequenceslength = sequencesData.length;
		initAutocomplete(namesArray, statesArray);
		
		$( "#seq-collection" ).sortable({
			revert: true,
			stop: function( ) {
				$('.circle').each(function(index){
					$(this).html(index + 1);
					$(this).removeClass("orange darken-3").addClass("blue darken-3");
				});
				
				$('#div-updateorder').show();
			}
		});
		$( "#seq-collection" ).disableSelection();
	});
	
	initAutocomplete();
}

function ExportSequence(){
	var dataRowObj = {};
	$('#btn-addsequence').addClass('disabled');
	
	dataRowObj.seq_no						= (sequenceslength + 1).toString();
	dataRowObj.sequence_state_name			= $('#sequence_state').val();
	dataRowObj.sequence_type_name  			= $('#sequence_name').val();
	dataRowObj.work_type_name				= $("#select-worktype :selected").text();
	dataRowObj.sequence_productive			= $("#sequence_productive").prop("checked").toString();
	dataRowObj.sequence_movement_focused	= $("#sequence_movement_focused").prop("checked").toString();
	
	dataRowObj.IsActive = 1;
	dataRowObj.Created  = new Date();
	dataRowObj.Modified = new Date();
	
	AddSequence(dataRowObj);
}

function AddSequence(dataRowObj){
	var jsonData = {
		 "fields": dataRowObj
	};
	var jsonSequenceName = {
		"fields": { "SYS_Sequence_State_Name": dataRowObj.sequence_state_name}
	}
	var jsonSequenceType = {
		"fields": { "SYS_Sequence_Type_Name": dataRowObj.sequence_type_name}
	}
	
	//We're going to get a list of the Sequence State Names and compare them to see if it exists or not.
	//If it doesn't exist, it's going to create a new record
	$.get(ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/SYS_Sequence_State_Name", function(data){
		var found = false;
		for(var key in data){
			if(data[key].SYS_Sequence_State_Name == dataRowObj.sequence_state_name){
				found = true;
			}
		}
		if(found == false){
			$.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/SYS_Sequence_State_Name",
				type: "POST",
				data: JSON.stringify(jsonSequenceName),
				success: function(){
					
				},
				error: function(){
					Materialize.toast('There was an error trying to add new sequence name', 4000);
				}
			});
			
		}
	});
	
	//We're going to get a list of the Sequence Type Names and compare them to see if it exists or not.
	//If it doesn't exist, it's going to create a new record
	$.get(ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/SYS_Sequence_Type_Name", function(data){
		var found = false;
		for(var key in data){
			if(data[key].SYS_Sequence_Type_Name == dataRowObj.sequence_type_name){
				found = true;
			}
		}
		if(found == false){
			$.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/SYS_Sequence_Type_Name",
				type: "POST",
				data: JSON.stringify(jsonSequenceType),
				success: function(){
					
				},
				error: function(){
					Materialize.toast('There was an error trying to add new equipment model', 4000);
				}
			});
			
		}
	});
	
	//We add new record in the table
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/SequenceType_states_worktype",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('Sequence added to '+$("#select-worktype :selected").text()+' successfully!', 4000);
			
			LoadSequences();
			$('#add-sequence').html(addform);
		},
		error: function(){
			Materialize.toast('There was an error trying to add new sequence', 4000);
		}
	});
}

function UpdateOrder(sequenceArray){
	var jsonData = {
		 "fields": sequenceArray
	};
	
	jQuery.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "update/bulk/virtual/"+UserData[0].SiteGUID+"/SequenceType_states_worktype",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('Sequences order updated', 4000);
			
			LoadSequences();
			$('#add-sequence').html(addform);
			
			$('#btn-updateorder').removeClass('disabled');
		},
		error: function(){
			Materialize.toast('There was an error trying to update sequences order', 4000);
		}
	});
}

function ExportOrder(){
	var dataRowObj = {};
	var sequenceArray = [];
	var tableRecordArray = [];
	var sequenceNumArray = [];
	
	$('#btn-updateorder').addClass('disabled');
	
	$('.collection-item').each(function(){
		tableRecordArray.push($(this).attr("table-record-guid"));
		sequenceNumArray.push($(this).children('.circle').text());
	});
	
	for(var key in tableRecordArray){
		dataRowObj = {};
	
		dataRowObj.TableRecordGUID	= tableRecordArray[key];
		dataRowObj.seq_no			= sequenceNumArray[key];
		dataRowObj.Modified			= new Date();
		
		sequenceArray.push(dataRowObj);
	}
				
	UpdateOrder(sequenceArray);
}

function EditSequence(trGUID, typeName, typeState, productive, movement_focused) {
	(productive == '0' || productive == 'false') ? productive = false : productive = true;
	(movement_focused == '0' || movement_focused == 'false') ? movement_focused = false : movement_focused = true;

	$('#add-title').text("Edit Sequence");
	$('#sequence_name').val(typeName);
	$('#sequence_state').val(typeState);
	$('#sequence_productive').prop("checked", productive);
	$('#sequence_movement_focused').prop("checked", movement_focused);
	
	$('#sequence_name').focus();
	$('#sequence_state').focus();
	$('#sequence_name').focus();
	
	$('.collection-item').each(function(){
		$(this).removeClass("bg-editblue");
	});
	
	$('li[table-record-guid="'+trGUID+'"]').addClass("bg-editblue");
	
	$('#form-btns').html('<a id="btn-updatesequence" onclick="UpdateSequence(\''+trGUID+'\')" class="waves-effect waves-light btn blue darken-3"><i class="material-icons left">edit</i>edit sequence</a> '
											+'<a onclick="CancelSequence()" class="waves-effect waves-light btn grey darken-3">cancel</a>');
}

function UpdateSequence(trGUID){
	$('#btn-updatesequence').addClass('disabled');
	
	var jsonData = {
		"key": { "TableRecordGUID": trGUID},
		"fields": { "sequence_state_name":			$('#sequence_state').val(),
					"sequence_type_name":			$('#sequence_name').val(),
					"sequence_productive":			$('#sequence_productive').prop("checked").toString(),
					"sequence_movement_focused":	$('#sequence_movement_focused').prop("checked").toString()
		}
	};
	
	console.log(jsonData);
	
	jQuery.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "update/virtual/"+UserData[0].SiteGUID+"/SequenceType_states_worktype",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('Sequence updated', 4000);
			
			$('#add-sequence').html(addform);
			LoadSequences();
		},
		error: function(){
			Materialize.toast('There was an error trying to update sequence', 4000);
		}
	});
}

function deleteSequence(trGUID){
	var jsonData = {
		"key": { "RecordGroupGUID": trGUID},
		"fields": { "IsActive": 0 }
	};
	
	jQuery.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "update/dbo/MatchupTableRecords",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('Sequence deleted', 4000);
			
			LoadSequences();
		}
	});
}

function deleteAlert(trGUID){
	DisplayConfirm("Confirm", "Are you sure you want to delete this sequence?", function(){
		deleteSequence(trGUID);
	});
}

function CancelSequence(){
	$('#add-sequence').html(addform);
	LoadSequences();
}

function initAutocomplete(namesArray, statesArray){
	$('#sequence_name').autoComplete({
		minChars: 2,
		source: function(term, suggest){
				term = term.toLowerCase();
				var choices = namesArray;
				var matches = [];
				for (i=0; i<choices.length; i++)
						if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
				suggest(matches);
		}
	});
	
	$('#sequence_state').autoComplete({
		minChars: 2,
		source: function(term, suggest){
				term = term.toLowerCase();
				var choices = statesArray;
				var matches = [];
				for (i=0; i<choices.length; i++)
						if (~choices[i].toLowerCase().indexOf(term)) matches.push(choices[i]);
				suggest(matches);
		}
	});
}

function LoadBottomSheet() {
	$("#modal-table .modal-header").html('Sequences');
	$("#modal-table .modal-subcontent").html("");
	
	LoadBGrid();
}

function LoadBGrid() {

	var formTypesArray	= [];

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SequenceType_states_worktype", function( data ) {
		
		for(var key in data) {
			var formTypeObj		= {};
			formTypeObj.work_type_name				= data[key].work_type_name;
			formTypeObj.seq_no						= data[key].seq_no;
			formTypeObj.sequence_type_name			= data[key].sequence_type_name;
			formTypeObj.sequence_state_name			= data[key].sequence_state_name;
			formTypeObj.sequence_productive			= data[key].productive;
			formTypeObj.sequence_movement_focused	= data[key].movement_focused;
			formTypesArray.push(formTypeObj);
		}
	
		$("#modal-table .modal-subcontent").append($('<div id="jqxgrid"></div>'));
		
    var source = {
      localdata: formTypesArray,
      datatype: "array",
      datafields:
      [
        { name: 'work_type_name',				type: 'string' },
        { name: 'seq_no',						type: 'string' },
        { name: 'sequence_type_name',			type: 'string' },
        { name: 'sequence_state_name',			type: 'string' },
        { name: 'sequence_productive',			type: 'string' },
        { name: 'sequence_movement_focused',	type: 'string' }
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
        { text: 'Work Type',		datafield: 'work_type_name',			hidden: false },
        { text: 'Seq. No.',			datafield: 'seq_no',					hidden: false },
        { text: 'State EndPoint',	datafield: 'sequence_type_name',		hidden: false },
        { text: 'Sequence State',   datafield: 'sequence_state_name',		hidden: false },
        { text: 'Productive',		datafield: 'sequence_productive',		hidden: false },
        { text: 'Movement Focused',	datafield: 'sequence_movement_focused',	hidden: false }
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


var addform = '<div class="row"><div class="col s12"><h5 class="center-align" id="add-title"></h5></div>'
							+'<div class="input-field col s12"><input id="sequence_state" type="text" class="validate"><label for="sequence_state">Sequence State</label></div>'
							+'<div class="input-field col s12"><input id="sequence_name" type="text" class="validate"><label for="sequence_name">State EndPoint</label></div>'
							+'<div class="row">'
							+'<div class="center col s6">'
							+'<label>Productive</label>'
							+'<div class="switch">'
							+'<label>Off<input id="sequence_productive" type="checkbox"><span class="lever"></span>On</label>'
							+'</div>'
							+'</div>'
							+'<div class="center col s6">'
							+'<label>Assign Movement Focused</label>'
							+'<div class="switch">'
							+'<label>Off<input id="sequence_movement_focused" type="checkbox"><span class="lever"></span>On</label>'
							+'</div>'
							+'</div>'
							+'</div>'
							+'<div class="right" id="form-btns"><a id="btn-addsequence" onclick="ExportSequence()" class="waves-effect waves-light btn orange darken-3"><i class="material-icons left">add</i>add sequence</a> </div></div>';