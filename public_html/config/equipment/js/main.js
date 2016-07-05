/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/CONFIG/EQUIPMENT/JS
	File Name:			main.js
=============================================================*/

var equipmentlength;

$(document).ready(function() {
	$("#equ-collection").hide();
	$("#add-equipment").hide();
	LoadWorkTypesDropDown();
	
	$('#btn-addequipment').click(function(){
		ExportEquipment();
	});
	
	$('#btn-cancelequipment').click(function(){
		$('#equipment_name').val('');
		$('#equipment_model').val('');
		$('#load_capacity_kg').val('');
		$('#load_capacity_m3').val('');
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
	LoadEquipment();
});

function LoadEquipment(){
	var namesArray = [];
	var modelsArray = [];
	var worktype = $("#select-worktype :selected").text();
	
	var jqxhrequipment = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/EquipmentByWorkType?where=\"work_type_name = '"+ worktype +"'\"", function() {
		var equipmentData = $.parseJSON(jqxhrequipment.responseText);
		var select = $("#equ-collection").html("");
		
		$("#equ-collection").show();
		$("#add-equipment").show();
		$('#equipment_name').val('');
		$('#equipment_model').val('');
		$('#load_capacity_kg').val('');
		$('#load_capacity_m3').val('');
		
		$('#equ-title').html(worktype + " Equipment List");
		
		$('#add-title').html("Add New Equipment to "+ worktype);
		
		for(var key in equipmentData){
			
			var ed_trguid	= (equipmentData[key].TableRecordGUID)	? equipmentData[key].TableRecordGUID	: "";
			var ed_en		= (equipmentData[key].equipment_name)	? equipmentData[key].equipment_name		: "";
			var ed_em		= (equipmentData[key].equipment_model)	? equipmentData[key].equipment_model	: "";
			var ed_lck		= (equipmentData[key].load_capacity_kg)	? equipmentData[key].load_capacity_kg	: "";
			var ed_lcm		= (equipmentData[key].load_capacity_m3)	? equipmentData[key].load_capacity_m3	: "";
			
			var num = parseInt(key) + 1;
			select.append('<li class="collection-item avatar" table-record-guid="'+ed_trguid+'">'
										+'<i class="circle orange darken-3">'+ num +'</i>'
										+'<p><b>Equipment Number:</b> '+ed_en+' <br>'
										+'<b>Equipment Model:</b> '+ed_em+'</p>'
										+'<a href="#!" onclick="EditEquipment(\''+ed_trguid+'\',\''+ed_en+'\',\''+ed_em+'\',\''+ed_lck+'\',\''+ed_lcm+'\')" class="secondary-content"><i class="material-icons">edit</i></a>'
										+'<a href="#!" onclick="deleteAlert(\''+ed_trguid+'\')" class="secondary-content2"><i class="material-icons">delete</i></a></li>');
			
			namesArray.push(equipmentData[key].equipment_name);
			modelsArray.push(equipmentData[key].equipment_model);
		}
		equipmentlength = equipmentData.length;
		
	});	
}

function ExportEquipment(){
	var dataRowObj = {};
	$('#btn-addequipment').addClass('disabled');
	
	dataRowObj.equipment_name	= $('#equipment_name').val();
	dataRowObj.equipment_model	= $('#equipment_model').val();
	dataRowObj.load_capacity_kg	= $('#load_capacity_kg').val();
	dataRowObj.load_capacity_m3	= $('#load_capacity_m3').val();
	dataRowObj.work_type_name	= $("#select-worktype :selected").text();
	
	dataRowObj.IsActive = 1;
	dataRowObj.Created  = new Date();
	dataRowObj.Modified = new Date();
	
	AddEquipment(dataRowObj);
}

function AddEquipment(dataRowObj){
	var jsonData = {
		 "fields": dataRowObj
	};
	var jsonEquipmentName = {
		"fields": { "SYS_EquipmentName": dataRowObj.equipment_name}
	}
	var jsonEquipmentModel = {
		"fields": { "SYS_EquipmentModel": dataRowObj.equipment_model}
	}
	//We're going to get a list of the Equipment Names and compare them to see if it exists or not.
	//If it doesn't exist, it's going to create a new record
	$.get(ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/SYS_EquipmentName", function(data){
		var found = false;
		for(var key in data){
			if(data[key].SYS_EquipmentName == dataRowObj.equipment_name){
				found = true;
			}
		}
		if(found == false){
			$.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/SYS_EquipmentName",
				type: "POST",
				data: JSON.stringify(jsonEquipmentName),
				success: function(){
					
				},
				error: function(){
					Materialize.toast('There was an error trying to add new equipment name', 4000);
				}
			});
			
		}
	});
	
	//We're going to get a list of the Equipment Models and compare them to see if it exists or not.
	//If it doesn't exist, it's going to create a new record
	$.get(ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/SYS_EquipmentModel", function(data){
		var found = false;
		for(var key in data){
			if(data[key].SYS_EquipmentModel == dataRowObj.equipment_model){
				found = true;
			}
		}
		if(found == false){
			$.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/SYS_EquipmentModel",
				type: "POST",
				data: JSON.stringify(jsonEquipmentModel),
				success: function(){
					
				},
				error: function(){
					Materialize.toast('There was an error trying to add new equipment model', 4000);
				}
			});
			
		}
	});
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/EquipmentByWorkType",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('Equipment added to '+$("#select-worktype :selected").text()+' successfully!', 4000);
			
			LoadEquipment();
			$('#add-equipment').html(addform);
		},
		error: function(){
			Materialize.toast('There was an error trying to add new equipment', 4000);
		}
	});
}

function EditEquipment(trGUID, equipmentName, equipmentModel, loadCapacityKg, loadCapacityM3){
	$('#add-title').text("Edit Equipment");
	$('#equipment_name').val(equipmentName);
	$('#equipment_model').val(equipmentModel);
	$('#load_capacity_kg').val(loadCapacityKg);
	$('#load_capacity_m3').val(loadCapacityM3);
	
	$('#equipment_name').focus();
	$('#equipment_model').focus();
	$('#load_capacity_kg').focus();
	$('#load_capacity_m3').focus();
	$('#equipment_name').focus();
	
	$('.collection-item').each(function(){
		$(this).removeClass("bg-editblue");
	});
	
	$('li[table-record-guid="'+trGUID+'"]').addClass("bg-editblue");
	
	$('#form-btns').html('<a id="btn-updateequipment" onclick="UpdateEquipment(\''+trGUID+'\')" class="waves-effect waves-light btn blue darken-3"><i class="material-icons left">edit</i>edit equipment</a> '
											+'<a onclick="CancelEquipment()" class="waves-effect waves-light btn grey darken-3">cancel</a>');
}

function UpdateEquipment(trGUID){
	$('#btn-updateequipment').addClass('disabled');
	
	var jsonData = {
		"key": { "TableRecordGUID": trGUID},
		"fields": { "equipment_name": $('#equipment_name').val(),
								"equipment_model": $('#equipment_model').val(),
								"load_capacity_kg": $('#load_capacity_kg').val(),
								"load_capacity_m3": $('#load_capacity_m3').val()
		}
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "update/virtual/"+UserData[0].SiteGUID+"/EquipmentByWorkType",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('Equipment updated', 4000);
			
			$('#add-equipment').html(addform);
			LoadEquipment();
		},
		error: function(){
			Materialize.toast('There was an error trying to update equipment', 4000);
		}
	});
}

function deleteEquipment(trGUID){
	var jsonData = {
		"key": { "RecordGroupGUID": trGUID},
		"fields": { "IsActive": 0 }
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "update/dbo/MatchupTableRecords",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('Equipment deleted', 4000);
			
			LoadEquipment();
		}
	});
}

function deleteAlert(trGUID){
	DisplayConfirm("Confirm", "Are you sure you want to delete this equipment?", function(){
		deleteEquipment(trGUID);
	});
}

function CancelEquipment(){
	$('#add-equipment').html(addform);
	LoadEquipment();
}

function LoadBottomSheet() {
	$("#modal-table .modal-header").html('Equipments');
	$("#modal-table .modal-subcontent").html("");
	
  /*var navBar	=	$('<nav>' +
                    '<div class="nav-wrapper grey darken-4 white-text">' +
                      '<h4>Beacons</h4>' +
                    '</div>' +
                  '</nav>');

  $("#modal-table .modal-subcontent").append(navBar);
	*/
	/*for(var key in tabs) {
		$("#modal-table #nav-bottomsheet").append($('<li class="'+tabs[key].active+'"><a style="cursor:pointer" onclick="'+tabs[key].link+'">'+tabs[key].label+'</a></li>'));		
	}*/
	
  LoadBGrid();
}

function LoadBGrid() {

	var formTypesArray	= [];

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/EquipmentByWorkType", function( data ) {
		
		for(var key in data) {
			var formTypeObj		= {};
			formTypeObj.equipment_model		= data[key].equipment_model;
			formTypeObj.load_capacity_kg	= data[key].load_capacity_kg;
			formTypeObj.load_capacity_m3	= data[key].load_capacity_m3;
			formTypeObj.work_type_name		= data[key].work_type_name;
			formTypeObj.equipment_name		= data[key].equipment_name;
			formTypesArray.push(formTypeObj);
		}
	
		$("#modal-table .modal-subcontent").append($('<div id="jqxgrid"></div>'));
		
    var source = {
      localdata: formTypesArray,
      datatype: "array",
      datafields:
      [
        { name: 'equipment_model',	type: 'string' },
        { name: 'work_type_name',	type: 'string' },
        { name: 'equipment_name',	type: 'string' },
        { name: 'load_capacity_kg',	type: 'string' },
        { name: 'load_capacity_m3',	type: 'string' }
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
        { text: 'Equipment Model',		datafield: 'equipment_model',	hidden: false },
        { text: 'Work Type',			datafield: 'work_type_name',	hidden: false },
        { text: 'Equipment Name',		datafield: 'equipment_name',	hidden: false },
        { text: 'Load Capacity (kg)',	datafield: 'load_capacity_kg',	hidden: false },
        { text: 'Load Capacity (m3)',	datafield: 'load_capacity_m3',	hidden: false }
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
							+'<div class="input-field col s12"><input id="equipment_name" type="text" class="validate"><label for="equipment_name">Equipment Number</label></div>'
							+'<div class="input-field col s12"><input id="equipment_model" type="text" class="validate"><label for="equipment_model">Equipment Model</label></div>'
							+'<div class="input-field col s12">'
							+'<input id="load_capacity_kg" type="text" class="validate">'
							+'<label for="load_capacity_kg">Load Capacity (Kg)</label>'
							+'</div>'
							+'<div class="input-field col s12">'
							+'<input id="load_capacity_m3" type="text" class="validate">'
							+'<label for="load_capacity_m3">Load Capacity (m3)</label>'
							+'</div>'
							+'<div class="right" id="form-btns"><a id="btn-addequipment" onclick="ExportEquipment()" class="waves-effect waves-light btn orange darken-3"><i class="material-icons left">add</i>add equipment</a> </div></div>';
							
							
							
							
							
							
							