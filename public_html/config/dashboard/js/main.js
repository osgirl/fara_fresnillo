/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/CONFIG/DASHBOARD/JS
	File Name:			main.js
=============================================================*/

var dashArray = [];

$(document).ready(function() {
	LoadConfig();
	
	
	$('#btn-canceluser').click(function(){
		$('#dash_cat').val(''); $('#item_name').val(''); $( "#active_id" ).prop( "checked", true );
	});
		
});

function LoadRoles() {
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/cfg/Role?where=\"IsActive = '1' AND DisplayName != 'SuperAdmin' ORDER BY DisplayName ASC\"", function( roleData ) {

		for(var key in roleData){
			$("#user_role").append('<option value="'+roleData[key].RoleGUID+'">'+roleData[key].DisplayName+'</option>');
		}

		$('select').material_select();
	});
}

function LoadConfig() {
	dashArray = [];

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/ConfigItems?where=\"1=1 ORDER BY Category DESC\"", function( dashData ) {
		dashArray = dashData;
		
		var select = $("#dash-collection").html("");

		//Set Add fields empty
		$('#dash_cat').val(''); $('#item_name').val(''); $( "#active_id" ).prop( "checked", true );

		for(var key in dashData) {
			var num = parseInt(key) + 1;
			
			var activ = (dashData[key].Active == '1') ? 'True' : 'False';
			
			select.append
			(
				'<li class="collection-item avatar" table-record-guid="'+dashData[key].TableRecordGUID+'">'
				+'<i class="circle orange darken-3">'+num+'</i>'
				+'<p><b>Category:</b> '+dashData[key].Category+' <br>'
				+'<b>Name:</b> '+dashData[key].Name+' <br>'
				+'<b>Active:</b> '+activ+ '</p>'
				+'<a href="#!" onclick="EditConfig(\''+dashData[key].TableRecordGUID+'\',\''+dashData[key].Category+'\',\''+dashData[key].Name+'\',\''+dashData[key].Active+'\')" class="secondary-content"><i class="material-icons">edit</i></a>'
				+'<a href="#!" onclick="deleteAlert(\''+dashData[key].TableRecordGUID+'\')" class="secondary-content2"><i class="material-icons">delete</i></a></li>'
			);

		}

		//Add search functionality
		$('#dash_search').hideseek({nodata: 'No configuration found'});

		$('.collapsible').collapsible({
			accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		});
	});
	
	$('#btn-adddash').click(function(){
		ExportConfig();
	});

	$('select').material_select();
}

function ExportConfig(){
	var dataRowObj = {};
	var checkbool;
	if(validateRecord('')){
		$('#btn-adddash').addClass('disabled');
		
		if($("#active_id").prop("checked") == true){
			checkbool = '1';
		} else{
			checkbool = '0';
		}
		
		dataRowObj.Category				= $('#dash_cat').val();
		dataRowObj.Name  					= $('#item_name').val();
		dataRowObj.Active 			= checkbool;
			
		AddConfig(dataRowObj);
	}
}

function AddConfig(dataRowObj) {
	$('#btn-adddash').addClass('disabled');

	var jsonData = {
		"fields": dataRowObj
	};
	
	//We add new record in the table
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/ConfigItems",
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

function EditConfig(trGUID, catName, name, active) {
	$('#add-title').text("Edit Config Item");
	
	
	$('#dash_cat').val(catName);
	$('#item_name').val(name);
	if(active == '1'){
		$( "#active_id" ).prop( "checked", true );
	} else{
		$( "#active_id" ).prop( "checked", false );
	}
	
	FocusForm();

	$('.collection-item').each(function(){
		$(this).removeClass("bg-editblue");
	});

	$('li[table-record-guid="'+trGUID+'"]').addClass("bg-editblue");

	$('#form-btns').html('<a id="btn-updatedash" onclick="UpdateConfig(\''+trGUID+'\')" class="waves-effect waves-light btn blue darken-3"><i class="material-icons left">edit</i>edit item</a> '
	+'<a onclick="ResetForm()" class="waves-effect waves-light btn grey darken-3">cancel</a>');

	//Reset select to show new selected value                 
	$('select').material_select();
}

function UpdateConfig(trGUID){
	if(validateRecord(trGUID)){
		$('#btn-updatedash').addClass('disabled');
		var checkbool;
		if($('#active_id').prop('checked') == true){
			checkbool = '1';
		} else{
			checkbool = '0';
		}
		
		var jsonData = {
			"key": { "TableRecordGUID": trGUID},
			"fields": { "Category": $('#dash_cat').val(),
									"Name": $('#item_name').val(),
									"Active": checkbool
			}
		};
		
		jQuery.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "update/virtual/"+UserData[0].SiteGUID+"/ConfigItems",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				Materialize.toast($('#item_name').val()+' updated', 4000);		
					
				ResetForm();
			},
			error: function(){
				Materialize.toast('There was an error trying to update item', 4000);
			}
		});
	}
}

function FocusForm() {
	$('#dash_cat').focus();
	$('#item_name').focus();
	$('#active_id').focus();
}

function BlurForm() {
	$('#dash_cat').blur();
	$('#item_name').blur();
	$('#active_id').blur();
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
	$('#form-btns').html('<a id="btn-adddash" class="waves-effect waves-light btn orange darken-3"><i class="material-icons left">add</i>add item</a>');	
	$('#add-title').text("Add New Config");
	LoadConfig();
	setTimeout(function() { BlurForm(); },250)
}

function validateRecord(uGUID){
  
	if($('#dash_cat').val().replace(/\s/g, '') == ''){
		Materialize.toast('You need to select a Category', 4000);
		$('#dash_cat').focus();
		return false;
	}
	if($('#item_name').val().replace(/\s/g, '') == ''){
		Materialize.toast('Name can\'t be empty', 4000);
		$('#item_name').focus();
		return false;
	}
		  
  return true;
}

function LoadBottomSheet() {
	$("#modal-table .modal-header").html('Config Items');
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

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/ConfigItems", function( data ) {
		
		for(var key in data) {
			var formTypeObj		= {};
			formTypeObj.Category	= data[key].Category;
			formTypeObj.Name	= data[key].Name;
      formTypeObj.Active	= data[key].Active;
			formTypesArray.push(formTypeObj);
		}
	
		$("#modal-table .modal-subcontent").append($('<div id="jqxgrid"></div>'));
		
    var source = {
      localdata: formTypesArray,
      datatype: "array",
      datafields:
      [
        { name: 'Category',				type: 'string' },
        { name: 'Name',						type: 'string' },
        { name: 'Active',				type: 'string' }			
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
        { text: 'Category',		    datafield: 'Category',		hidden: false },
        { text: 'Name',			        datafield: 'Name',			hidden: false },
        { text: 'Active',   datafield: 'Active',	hidden: false }
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
