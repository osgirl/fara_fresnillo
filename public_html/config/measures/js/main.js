/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/CONFIG/MEASURES/JS
	File Name:			main.js
=============================================================*/

var measureArray = [];

$(document).ready(function() {
	LoadMeasure();
	
	
	$('#btn-cancelmeasure').click(function(){
		$('#measure_name').val(''); $('#req_wktp').prop( "checked", false ); $('#area_description').val(''); $('#area_objective').val(''); $('#area_tips').val(''); $('#measure_label').val(''); $('#type_measure').val(''); $('#area_query').val(''); $('#area_sqllite').val(''); 
	});
		
});

function LoadAwardTypes() {
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/AwardType", function( typeData ) {
		
		$("#type_measure").html("");
		
		$("#type_measure").append('<option value="">Choose an Award Type</option>');
		
		for(var key in typeData){
			$("#type_measure").append('<option value="'+typeData[key].AwardType+'">'+typeData[key].AwardType+'</option>');
		}

		$('select').material_select();
	});
}

function LoadMeasure() {
	measureArray = [];

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Measures?where=\"1=1 ORDER BY Name ASC\"", function( measureData ) {
		measureArray = measureData;
		
		var select = $("#measure-collection").html("");
		
		//Set Add fields empty
		$('#measure_name').val(''); $('#req_wktp').prop( "checked", false ); $('#area_description').val(''); $('#area_objective').val(''); $('#area_tips').val(''); $('#measure_label').val(''); $('#type_measure').val(''); $('#area_query').val(''); $('#area_sqllite').val(''); 
		
		//Reset text area size
		$('#area_query').trigger('autoresize');
		$('#area_sqllite').trigger('autoresize');
		
		for(var key in measureData) {
			var num = parseInt(key) + 1;
						
			select.append
			(
				'<li class="collection-item avatar" table-record-guid="'+measureData[key].TableRecordGUID+'">'
				+'<i class="circle orange darken-3">'+num+'</i>'
				+'<p><b>'+measureData[key].Name+'</b> <br>'
				+ measureData[key].Description+' <br>'
				+'<a href="#!" onclick="EditMeasure(\''+key+'\')" class="secondary-content"><i class="material-icons">edit</i></a>'
				+'<a href="#!" onclick="deleteAlert(\''+measureData[key].TableRecordGUID+'\')" class="secondary-content2"><i class="material-icons">delete</i></a></li>'
			);

		}

		//Add search functionality
		$('#measure_search').hideseek({nodata: 'No Measure found'});

		$('.collapsible').collapsible({
			accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		});
	});
	
	$('#btn-addmeasure').click(function(){
		ExportMeasure();
	});

	$('select').material_select();
	
	LoadAwardTypes();
}

function ExportMeasure(){
	var dataRowObj = {};
	var checkbool;
	if(validateRecord('')){
		$('#btn-addmeasure').addClass('disabled');
				
		dataRowObj.MeasureGUID			= CreateGUID();
		dataRowObj.Name					= $('#measure_name').val();
		dataRowObj.WorkType_Required	= $("#req_wktp").prop("checked").toString();
		dataRowObj.Description			= $('#area_description').val();
		dataRowObj.Objective			= $('#area_objective').val();
		dataRowObj.Tips					= $('#area_tips').val();
		dataRowObj.Label				= $('#measure_label').val();
		dataRowObj.AwardType			= $('#type_measure').val();
		dataRowObj.Query				= $('#area_query').val();
		dataRowObj.SQL_Lite				= $('#area_sqllite').val();
			
		AddMeasure(dataRowObj);
	}
}

function AddMeasure(dataRowObj) {
	$('#btn-addmeasure').addClass('disabled');
	
	var jsonData = {
		"fields": dataRowObj
	};
	
	//We add new record in the table
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/Measures",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast(dataRowObj.Name+' was added successfully!', 4000);
			ResetForm();
		},
		error: function(){
			Materialize.toast('There was an error trying to add new measure', 4000);
		}
	});
}

function EditMeasure(key) {
	$('#add-title').text("Edit Measure");
	
	var reqwktp = (measureArray[key].WorkType_Required == "true"); 
	
	$('#measure_name').val(measureArray[key].Name);
	$("#req_wktp").prop( "checked", reqwktp );
	$('#area_description').val(measureArray[key].Description);
	$('#area_objective').val(measureArray[key].Objective);
	$('#area_tips').val(measureArray[key].Tips);
	$('#measure_label').val(measureArray[key].Label);
	$('#type_measure').val(measureArray[key].AwardType);
	$('#area_query').val(measureArray[key].Query);
	$('#area_sqllite').val(measureArray[key].SQL_Lite);
	
	//Reset text area size
	$('#area_query').trigger('autoresize');
	$('#area_sqllite').trigger('autoresize');
	
	FocusForm();

	$('.collection-item').each(function(){
		$(this).removeClass("bg-editblue");
	});

	$('li[table-record-guid="'+measureArray[key].TableRecordGUID+'"]').addClass("bg-editblue");

	$('#form-btns').html('<a id="btn-updatemeasure" onclick="UpdateMeasure(\''+measureArray[key].TableRecordGUID+'\')" class="waves-effect waves-light btn blue darken-3"><i class="material-icons left">edit</i>edit measure</a> '
	+'<a onclick="ResetForm()" class="waves-effect waves-light btn grey darken-3">cancel</a>');

	//Reset select to show new selected value                 
	$('select').material_select();
}

function UpdateMeasure(trGUID) {
	if(validateRecord(trGUID)) {
		$('#btn-updatemeasure').addClass('disabled');
		var checkbool;
		
		var jsonData = {
			"key": { "TableRecordGUID": trGUID},
			"fields": { "Name": $('#measure_name').val(),
									"WorkType_Required": $('#req_wktp').prop('checked').toString(),
									"Description": $('#area_description').val(),
									"Objective": $('#area_objective').val(),
									"Tips": $('#area_tips').val(),
									"Label": $('#measure_label').val(),
									"AwardType": $('#type_measure').val(),
									"Query": $('#area_query').val(),
									"SQL_Lite": $('#area_sqllite').val()
			}
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "update/virtual/"+UserData[0].SiteGUID+"/Measures",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				Materialize.toast($('#measure_name').val()+' updated', 4000);		
					
				ResetForm();
			},
			error: function(){
				Materialize.toast('There was an error trying to update measure', 4000);
			}
		});
	}
}

function FocusForm() {
	$('#measure_name').focus();
	$("#req_wktp").focus();
	$('#area_description').focus();
	$('#area_objective').focus();
	$('#area_tips').focus();
	$('#measure_label').focus();
	$('#type_measure').focus();
	$('#area_query').focus();
	$('#area_sqllite').focus();
}

function BlurForm() {
	$('#measure_name').blur();
	$("#req_wktp").blur();
	$('#area_description').blur();
	$('#area_objective').blur();
	$('#area_tips').blur();
	$('#measure_label').blur();
	$('#type_measure').blur();
	$('#area_query').blur();
	$('#area_sqllite').blur();
}

function deleteMeasure(trGUID){
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
			Materialize.toast('Measure deleted', 4000);
			
			ResetForm();
		}
	});
}

function deleteAlert(trGUID){
	DisplayConfirm("Confirm", "Are you sure you want to delete this measure?", function(){
		deleteMeasure(trGUID);
	});
}

function ResetForm() {
	$('#form-btns').html('<a id="btn-addmeasure" class="waves-effect waves-light btn orange darken-3"><i class="material-icons left">add</i>add measure</a>');	
	$('#add-title').text("Add New Measure");
	LoadMeasure();
	setTimeout(function() { BlurForm(); },250)
}

function validateRecord(uGUID){
  
	if($('#measure_name').val().replace(/\s/g, '') == ''){
		Materialize.toast('Name can\'t be empty', 4000);
		$('#measure_name').focus();
		return false;
	}
	if($('#area_description').val().replace(/\s/g, '') == ''){
		Materialize.toast('Description can\'t be empty', 4000);
		$('#area_description').focus();
		return false;
	}
	if($('#area_objective').val().replace(/\s/g, '') == ''){
		Materialize.toast('Objective can\'t be empty', 4000);
		$('#area_objective').focus();
		return false;
	}
	if($('#measure_label').val().replace(/\s/g, '') == ''){
		Materialize.toast('Label can\'t be empty', 4000);
		$('#measure_label').focus();
		return false;
	}
	if($('#type_measure').val().replace(/\s/g, '') == ''){
		Materialize.toast('You need to select an Award Type', 4000);
		$('#type_measure').focus();
		return false;
	}
		  
  return true;
}

function LoadBottomSheet() {
	$("#modal-table .modal-header").html('Measures');
	$("#modal-table .modal-subcontent").html("");
	
	LoadBGrid();
}

function LoadBGrid() {

	var formTypesArray	= [];

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Measures", function( data ) {
		
		for(var key in data) {
			var formTypeObj					= {};
			formTypeObj.Name				= data[key].Name;
			formTypeObj.Description			= data[key].Description;
			formTypeObj.Objective			= data[key].Objective;
			formTypeObj.Tips				= data[key].Tips;
			formTypeObj.WorkType_Required	= data[key].WorkType_Required;
			formTypeObj.Label				= data[key].Label;
			formTypeObj.AwardType			= data[key].AwardType;
			formTypesArray.push(formTypeObj);
		}
	
		$("#modal-table .modal-subcontent").append($('<div id="jqxgrid"></div>'));
		
		var source = {
			localdata: formTypesArray,
			datatype: "array",
			datafields:
			[
				{ name: 'Name',					type: 'string' },
				{ name: 'Description',			type: 'string' },
				{ name: 'Objective',			type: 'string' },
				{ name: 'Tips',					type: 'string' },	
				{ name: 'WorkType_Required',	type: 'string' },	
				{ name: 'Label',				type: 'string' },	
				{ name: 'AwardType',			type: 'string' }
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
        { text: 'Name',			datafield: 'Name',				hidden: false },
        { text: 'Description',	datafield: 'Description',		hidden: false },
        { text: 'Objective',	datafield: 'Objective',			hidden: false },
		{ text: 'Tips',			datafield: 'Tips',				hidden: false },
		{ text: 'WorkType',		datafield: 'WorkType_Required',	hidden: false },
		{ text: 'Label',		datafield: 'Label',				hidden: false },
		{ text: 'Award Type',	datafield: 'AwardType',			hidden: false }
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
