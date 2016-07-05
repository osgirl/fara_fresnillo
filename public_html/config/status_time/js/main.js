/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/CONFIG/STATUS_TIME/JS
	File Name:			main.js
=============================================================*/

var statusData	= [];
var timesData	= [];
var timeStatusData = [];

$(document).ready(function() {
	$("#status-collection").hide();
	$("#add-time-type").hide();
	
	GetDataForDropDowns();
	
	$('#btn-cancel-time-type').click(function(){
		$('#type_of_time').val('');
	});
	
});

function GetDataForDropDowns() {
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_Status", function( data1 ) {
		statusData = data1;
		
		$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_TypeOfTime", function( data2 ) {
			timesData = data2;
			
			var select = $('#select-status').empty();		
			select.append('<option value="'+null+'" disabled selected>Choose a Status</option>');
			
			for(var key in statusData) {
				select.append( '<option value="'+ statusData[key].TableRecordGUID + '">' + statusData[key].SYS_Status + '</option>' );
			}
		
			$('#select-status').material_select();
			
			var select = $('#type_of_time').empty();		
			select.append('<option value="'+null+'" disabled selected>Choose a Type of Time</option>');
			
			for(var key in timesData) {
				select.append( '<option value="'+ timesData[key].TableRecordGUID + '">' + timesData[key].SYS_TypeOfTime + '</option>' );
			}
		
			$('#type_of_time').material_select();
			
			$("#select-status").unbind('change');
			$("#select-status").change(function() {
				LoadTimeType();
			});
		});
	});
}

function LoadTimeType() {
	timeStatusData = [];

	var status = $("#select-status :selected").text();
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/TypeOfTime_Status?where=\"Status = '"+ status +"'\"", function( data ) {
		timeStatusData = data;
		if(timeStatusData.length > 0) {
			var collection = $("#status-collection").html("");
			
			$("#status-collection").show();
			$("#add-time-type").show();
			
			$('#stat-title').html(status + " Type of Time List");
			
			$('#add-title').html("Add New Type of Time to "+ status);
			console.log(timeStatusData);
			for(var key in timeStatusData) {
				
				var tsd_trguid	= (timeStatusData[key].TableRecordGUID)	? timeStatusData[key].TableRecordGUID	: "";
				var tsd_tot		= (timeStatusData[key].Type_of_Time)	? timeStatusData[key].Type_of_Time		: "";
				
				var num = parseInt(key) + 1;
				collection.append('<li class="collection-item avatar" table-record-guid="'+tsd_trguid+'">'
									+'<i class="circle orange darken-3">'+ num +'</i>'
									+'<p><b>Status:</b> '+status+' <br>'
									+'<b>Type of Time:</b> '+tsd_tot+'</p>'
									+'<a href="#!" onclick="deleteTypeOfTime(\''+tsd_trguid+'\')" class="secondary-content2"><i class="material-icons">delete</i></a></li>');
				
			}
		}
		else {
			$("#status-collection").html("");
			$("#add-time-type").show();
			$("#status-collection").show();
			$("#status-collection").append('<li class="collection-item">There are currently no "status - type of time" matchups.</li>');
		}
	});	
}

function AddStatusTimeMatchup() {
	
	var dataRowObj = {};
	
	dataRowObj.Status = $("#select-status :selected").text();
	dataRowObj.Type_of_Time = $('#type_of_time :selected').text();

	dataRowObj.IsActive = 1;
	dataRowObj.Created  = new Date();
	dataRowObj.Modified = new Date();
	
	var jsonData = {
		 "fields": dataRowObj
	};
	
	var canCreate = true;
	console.log(jsonData);
	for(var key in timeStatusData) {
		(timeStatusData[key].Status == dataRowObj.Status && timeStatusData[key].Type_of_Time == dataRowObj.Type_of_Time) ? canCreate = false : false;
	}
	
	if(canCreate) {
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/TypeOfTime_Status",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				Materialize.toast('Type of Time added to '+$("#select-status :selected").text()+' successfully!', 4000);
				
				$('#add-equipment').html(addform);
				LoadTimeType();
			},
			error: function(){
				Materialize.toast('There was an error trying to add new Type of Time', 4000);
			}
		});
	}
	else {
		Materialize.toast(dataRowObj.Type_of_Time + ' is already mapped to ' + dataRowObj.Status, 4000);
	}
}

function deleteTypeOfTime(trGUID){
	DisplayConfirm("Confirm", "Are you sure you want to delete this type of time?", function() {
		
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
				Materialize.toast('Type of Time deleted', 4000);
				
				LoadTimeType();
			}
		});
	});
}

function LoadBottomSheet() {
	$("#modal-table .modal-header").html('Status - Type of Time');
	$("#modal-table .modal-subcontent").html("");
	
	LoadBGrid();
}

function LoadBGrid() {

	var formTypesArray	= [];

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/TypeOfTime_Status", function( data ) {
		
		for(var key in data) {
			var formTypeObj		= {};
			formTypeObj.Status			= data[key].Status;
			formTypeObj.Type_of_Time	= data[key].Type_of_Time;
			formTypesArray.push(formTypeObj);
		}

		$("#modal-table .modal-subcontent").append($('<div id="jqxgrid"></div>'));

		var source = {
			localdata: formTypesArray,
			datatype: "array",
			datafields:
			[
				{ name: 'Status',	type: 'string' },
				{ name: 'Type_of_Time',	type: 'string' }
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
				{ text: 'Status',		datafield: 'Status',		hidden: false },
				{ text: 'Type of Time',	datafield: 'Type_of_Time',	hidden: false }
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

var addform =	'<div class="row">'
					+'<div class="col s12"><h5 class="center-align" id="add-title"></h5></div>'
					+'<div class="input-field col s12">'
						+'<select id="type_of_time" type="text" class="validate"></select>'
						+'<label for="type_of_time">Type of Time</label>'
					+'</div>'
					+'<div class="right" id="form-btns">'
						+'<a  id="btn-add-time-type" onclick="AddStatusTimeMatchup()" class="waves-effect waves-light btn orange darken-3"><i class="material-icons left">add</i>Add Type of Time</a>'
					+'</div>'
				+'</div>';
							
							
							
							
							
							
							