/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/CONFIG/DASHBOARD/JS
	File Name:			main.js
=============================================================*/

var goalsArray		= [];
var measuresArray	= [];
var workTypeArray	= [];
var awardeeArray	= [];
var operatorArray	= [];

$(document).ready(function() {
	LockForService("Loading...");
	LoadMeasures();
});

function LoadMeasures() {
	goalsArray		= [];
	measuresArray	= [];
	workTypeArray	= [];
	awardeeArray	= [];
	operatorArray	= [];
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Goals?where=\"1=1 ORDER BY Name ASC\"", function( goalsData ) {
		goalsArray = goalsData;
	
		$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Measures?where=\"1=1 ORDER BY Name ASC\"", function( measuresData ) {
			measuresArray = measuresData;
			
			$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_WorkTypeName?where=\"1=1 ORDER BY SYS_WorkTypeName ASC\"", function( workTypeData ) {
				workTypeArray = workTypeData;
				
				$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Awardee?where=\"1=1 ORDER BY Awardee ASC\"", function( awardeeData ) {
					awardeeArray = awardeeData;
					
					$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Operator?where=\"1=1 ORDER BY Operator ASC\"", function( operatorData ) {
						operatorArray = operatorData;
						
						//Clean lists
						$('#operator_list').html("");
						$('#awardee_list').html("");
						$('#worktype_list').html("");
						$('#measures_list').html("");
						
						for(var key in operatorArray){
							$("#operator_list").append('<option value="'+operatorArray[key].Operator+'">'+operatorArray[key].Operator+'</option>');
						}
						
						for(var key in awardeeArray){
							$("#awardee_list").append('<option value="'+awardeeArray[key].Awardee+'">'+awardeeArray[key].Awardee+'</option>');
						}
						
						for(var key in workTypeArray){
							$("#worktype_list").append('<option value="'+workTypeArray[key].SYS_WorkTypeName+'">'+workTypeArray[key].SYS_WorkTypeName+'</option>');
						}
						
						$('#measures_list').append('<option value="0">Choose a Measure</option>');
						for(var key in measuresArray){
							$("#measures_list").append('<option value="'+measuresArray[key].MeasureGUID+'">'+measuresArray[key].Name+'</option>');
						}

						$('select').material_select();
						
						if(goalsArray.length > 0) {
							LoadConfig();
						}
						else {
							var select = $("#goals-collection").html("");
							
							select.html("");
							$("#add-goal").show();
							select.show();
							select.append('<li class="collection-item">There are currently no goals.</li>');
						}
	
						$("#measures_list").on("change", function() {
							var value		= $(this).val();
							var measureObj	= {};
							var foundValue	= false;

							for(var key in measuresArray) {
								if(value == measuresArray[key].MeasureGUID) {
									measureObj = measuresArray[key];
									foundValue = true;
								}
							}
							
							(foundValue) ? $("#sub-form").show() : $("#sub-form").hide();
							(measureObj.WorkType_Required == "true") ? $("#worktype_list").attr("disabled", false) : $("#worktype_list").attr("disabled", true);
							
							if(measureObj.AwardType == "Basic") {
								$("#operator_list").attr("disabled", true);
								$("#num_goal").attr("disabled", true);
							}
							else {
								$("#operator_list").attr("disabled", true);
								$("#num_goal").attr("disabled", true);			
							}

							$('select').material_select();
						});
						
						ServiceComplete();
					});
				});
			});
		});
	});
}

function LoadConfig() {
	
	var select = $("#goals-collection").html("");

	//Set Add fields empty
	$('#measures_list').val('');
	$('#goal_name').val('');
	$('#worktype_list').val('');
	$('#awardee_list').val('');
	$('#num_points').val('');
	$('#operator_list').val('');
	$('#num_goal').val('');

	for(var key in goalsArray) {
		var num = parseInt(key) + 1;
		var measureName = '';
		var awardtype = '';
		var reqwt = '';
		
		for(var option in measuresArray) {
			(measuresArray[option].MeasureGUID == goalsArray[key].MeasureGUID) ? measureName = measuresArray[option].Name : false;
			(measuresArray[option].MeasureGUID == goalsArray[key].MeasureGUID) ? awardtype = measuresArray[option].AwardType : false;
			(measuresArray[option].MeasureGUID == goalsArray[key].MeasureGUID) ? reqwt = measuresArray[option].WorkType_Required : false;
		}

		select.append
		(
			'<li class="collection-item avatar" table-record-guid="'+goalsArray[key].TableRecordGUID+'">'
			+'<i class="circle orange darken-3">'+num+'</i>'
			+'<p><b>Measure:</b> '+measureName+' <br>'
			+'<b>Name:</b> '+goalsArray[key].Name+' <br>'
			+'<b>Points Awarded:</b> '+goalsArray[key].Points_Awarded+ '</p>'
			+'<a href="#!" onclick="EditConfig(\''+goalsArray[key].TableRecordGUID+'\',\''+goalsArray[key].Awardee+'\',\''+goalsArray[key].MeasureGUID+'\',\''+goalsArray[key].Name+'\',\''+goalsArray[key].Operator+'\',\''+goalsArray[key].Points_Awarded+'\',\''+goalsArray[key].Worktype+'\',\''+awardtype+'\',\''+reqwt+'\',\''+goalsArray[key].Threshold_Goal+'\')" class="secondary-content"><i class="material-icons">edit</i></a>'
			+'<a href="#!" onclick="deleteAlert(\''+goalsArray[key].TableRecordGUID+'\')" class="secondary-content2"><i class="material-icons">delete</i></a></li>'
		);

	}

	//Add search functionality
	$('#goals_search').hideseek({nodata: 'No configuration found'});

	$('.collapsible').collapsible({
		accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	});
	
	$('select').material_select();
}

function ExportConfig() {
	var dataRowObj = {};
	var checkbool;
	if(validateRecord('')) {
		
		dataRowObj.GoalGUID					= CreateGUID();
		dataRowObj.MeasureGUID			= $('#measures_list').val();
		dataRowObj.Name							= $('#goal_name').val();
		dataRowObj.Worktype					= $('#worktype_list').val();
		dataRowObj.Awardee					= $('#awardee_list').val();
		dataRowObj.Points_Awarded		= $('#num_points').val();
		dataRowObj.Operator					= $('#operator_list').val();
		dataRowObj.Threshold_Goal		= $('#num_goal').val();

		AddConfig(dataRowObj);
	}
}

function AddConfig(dataRowObj) {

	var jsonData = {
		"fields": dataRowObj
	};
	
	//We add new record in the table
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/Goals",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast(dataRowObj.Name+' was added successfully!', 4000);
			ResetForm();
		},
		error: function(){
			Materialize.toast('There was an error trying to add new item', 4000);
		}
	});
}

function EditConfig(trGUID, awardee, measure, name, operator, points_awarded, worktype, awardtype, reqwt, num_goal) {
	$('#add-title').text("Edit Goals Item");
	
	$("#sub-form").show();
	
	$('#measures_list').val(measure);
	$('#goal_name').val(name);
	$('#worktype_list').val(worktype);
	$('#awardee_list').val(awardee);
	$('#num_points').val(points_awarded);
	$('#operator_list').val(operator);
	$('#num_goal').val(num_goal);
	
	FocusForm();
	
	//Check Worktype Required
	(reqwt == "true") ? $("#worktype_list").attr("disabled", false) : $("#worktype_list").attr("disabled", true);
	
	//Check Award Type
	if(awardtype == "Basic") {
		$("#operator_list").attr("disabled", true);
		$("#num_goal").attr("disabled", true);
	}
	else {
		$("#operator_list").attr("disabled", false);
		$("#num_goal").attr("disabled", false);			
	}
	
	$('.collection-item').each(function(){
		$(this).removeClass("bg-editblue");
	});

	$('li[table-record-guid="'+trGUID+'"]').addClass("bg-editblue");

	$('#form-btns').html('<a id="btn-updategoal" onclick="UpdateConfig(\''+trGUID+'\')" class="waves-effect waves-light btn blue darken-3"><i class="material-icons left">edit</i>edit item</a> '
	+'<a onclick="ResetForm()" class="waves-effect waves-light btn grey darken-3">cancel</a>');

	//Reset select to show new selected value                 
	$('select').material_select();
}

function UpdateConfig(trGUID){
	if(validateRecord(trGUID)){
		$('#btn-updategoal').addClass('disabled');
		
		var dataRowObj = {};
		
		dataRowObj.MeasureGUID			= $('#measures_list').val();
		dataRowObj.Name							= $('#goal_name').val();
		dataRowObj.Worktype					= $('#worktype_list').val();
		dataRowObj.Awardee					= $('#awardee_list').val();
		dataRowObj.Points_Awarded		= $('#num_points').val();
		dataRowObj.Operator					= $('#operator_list').val();
		dataRowObj.Threshold_Goal		= $('#num_goal').val();
		
		var jsonData = {
			"key": { "TableRecordGUID": trGUID},
			"fields": dataRowObj
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "update/virtual/"+UserData[0].SiteGUID+"/Goals",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				Materialize.toast('Goal updated', 4000);
				
				ResetForm();
			},
			error: function(){
				Materialize.toast('There was an error trying to update item', 4000);
			}
		});
	}
}

function FocusForm() {
	$('#measures_list').focus();
	$('#goal_name').focus();
	$('#worktype_list').focus();
	$('#awardee_list').focus();
	$('#num_points').focus();
	$('#operator_list').focus();
	$('#num_goal').focus();
}

function BlurForm() {
	$('#measures_list').blur();
	$('#goal_name').blur();
	$('#worktype_list').blur();
	$('#awardee_list').blur();
	$('#num_points').blur();
	$('#operator_list').blur();
	$('#num_goal').blur();
}

function deleteConfig(trGUID){
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
			Materialize.toast('Item deleted', 4000);
			
			ResetForm();
		}
	});
}

function deleteAlert(trGUID){
	DisplayConfirm("Confirm", "Are you sure you want to delete this item?", function(){
		deleteConfig(trGUID);
	});
}

function ResetForm() {
	LockForService("Loading...");
	$('#form-btns').html('<a id="btn-adddash" class="waves-effect waves-light btn orange darken-3"><i class="material-icons left">add</i>add item</a>');	
	$('#add-title').text("Add New Goal");
	
	$('#measures_list').val('0');
	$('#goal_name').val('');
	$('#worktype_list').val('0');
	$('#awardee_list').val('0');
	$('#num_points').val('');
	$('#operator_list').val('0');
	$('#num_goal').val('');
	
	$('select').material_select();
	
	$("#sub-form").hide();
	
	LoadMeasures();
	setTimeout(function() { BlurForm(); },250)
}

function validateRecord(uGUID){
	
	$("#measures_list")
  
	if($('#measures_list').val().replace(/\s/g, '') == ''){
		Materialize.toast('You need to select a Measure', 4000);
		$('#measures_list').focus();
		return false;
	}
	if($('#goal_name').val().replace(/\s/g, '') == ''){
		Materialize.toast('Name can\'t be empty', 4000);
		$('#goal_name').focus();
		return false;
	}
		  
	return true;
}

function LoadBottomSheet() {
	$("#modal-table .modal-header").html('Config Items');
	$("#modal-table .modal-subcontent").html("");
	
	LoadBGrid();
}

function LoadBGrid() {

	var formTypesArray	= [];

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Goals", function( data ) {
		
		for(var key in data) {
			var formTypeObj			= {};
			
			formTypeObj.MeasureGUID			= data[key].MeasureGUID;
			formTypeObj.Name			= data[key].Name;
			formTypeObj.Worktype		= data[key].Worktype;
			formTypeObj.Points_Awarded	= data[key].Points_Awarded;
			formTypeObj.Awardee			= data[key].Awardee;
			formTypeObj.Operator		= data[key].Operator;
			
			formTypesArray.push(formTypeObj);
		}
	
		$("#modal-table .modal-subcontent").append($('<div id="jqxgrid"></div>'));
		
    var source = {
      localdata: formTypesArray,
      datatype: "array",
      datafields:
		[
			{ name: 'MeasureGUID',			type: 'string' },
			{ name: 'Name',				type: 'string' },			
			{ name: 'Worktype',			type: 'string' },
			{ name: 'Points_Awarded',	type: 'string' },
			{ name: 'Awardee',			type: 'string' },
			{ name: 'Operator',			type: 'string' }			
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
        { text: 'MeasureGUID',	datafield: 'MeasureGUID',					hidden: false },
        { text: 'Worktype',	datafield: 'Worktype',					hidden: false },
        { text: 'Name',	datafield: 'Name',							hidden: false },
        { text: 'Points_Awarded',	datafield: 'Points_Awarded',	hidden: false },
        { text: 'Awardee',	datafield: 'Awardee',					hidden: false },
        { text: 'Operator',	datafield: 'Operator',					hidden: false }
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
