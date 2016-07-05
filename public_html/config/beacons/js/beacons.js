/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/CONFIG/BEACONS/JS
	File Name:			beacons.js
=============================================================*/

var equipmentlength;
var beaconArray;
var bgroupArray;

function BeaconsInit() {
	LoadBGroupDropDown(null, null);

	LoadBeacons();
}

function LoadBGroupDropDown(tabValue, relCol) {
  bgroupArray = [];
  
	var jqxhrworktypes = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/BeaconGroups", function() {
		
		var worktypeData = $.parseJSON(jqxhrworktypes.responseText);
    bgroupArray = worktypeData;
		
    var select = $('#slct_bgroup').empty();
		
    select.append('<option value="'+null+'" disabled selected>Choose a Beacon Group</option>');
		
		for(var key in worktypeData) {
			select.append( '<option value="'
                    + worktypeData[key].GroupUUID
                    + '">'
                    + worktypeData[key].Name
                    + '</option>' );
		}
    
    //If there's a value set
    if(tabValue){
      $('#slct_bgroup').val(tabValue);
      
      //LoadValueDropdown(relCol);
    }else{
      $('#slct_value').material_select();
    }
		 $('#slct_bgroup').material_select();
	});
  
  $('#slct_bgroup').unbind('change');
  $("#slct_bgroup").change(function() {
    //LoadValueDropdown(null);
  });
}

/*function LoadValueDropdown(colValue){
  var groupuuid = $("#slct_bgroup option:selected").val();
  
  var bData = $.grep(bgroupArray, function(e){ return e.GroupUUID == groupuuid});
  
  var bRTable = bData[0].Relationship;
  var bRColumn = bData[0].DisplayName;
  
  var jqxhrworktypes = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/" + bRTable, function() {
		var worktypeData = $.parseJSON(jqxhrworktypes.responseText);
    
    var select = $('#slct_value').empty();
		
    select.append('<option value="'+null+'" disabled selected>Choose a Value</option>');
		
    for(var key in worktypeData){
      select.append( '<option value="'
                    + worktypeData[key][bRColumn]
                    + '">'
                    + worktypeData[key][bRColumn]
                    + '</option>' );
    }
    
     if(colValue) {
       	$('#slct_value').val(colValue);
     }
		$('#slct_value').material_select();
  });
}*/

function LoadBeacons(){
	beaconArray = [];
	
	var jqxhrgroups = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Beacons", function() {
		var groupsData = $.parseJSON(jqxhrgroups.responseText);
    beaconArray = groupsData;
		var select = $("#bea-collection").html("");
    
		$('#group_name').val('');
		$('#rel_table').val('');
    $('#slct_value').val('');
		
		for(var key in groupsData){
			var num = parseInt(key) + 1;
			select.append('<li class="collection-item avatar" table-record-guid="'+groupsData[key].TableRecordGUID+'">'
										+'<i class="circle orange darken-3">'+ num +'</i>'
										+'<p><b>Beacon Name:</b> '+groupsData[key].Name+' <br>'
                    +'<b>Major:</b> '+groupsData[key].Major+' <br>'
                    +'<b>Minor:</b> '+groupsData[key].Minor+'</p>'
										+'<a href="#!" onclick="EditBeacon(\''+groupsData[key].TableRecordGUID+'\')" class="secondary-content"><i class="material-icons">edit</i></a>'
										+'<a href="#!" onclick="deleteAlert(\''+groupsData[key].TableRecordGUID+'\')" class="secondary-content2"><i class="material-icons">delete</i></a></li>');
			
		}
		equipmentlength = groupsData.length;
    
    //Add search functionality
		$('#beacon_search').hideseek({nodata: 'No beacon found'});
		
	});
  
  $('#btn-addbeacon').click(function(){
		ExportBeacon('');
	});
}

function ExportBeacon(bGUID){
	var dataRowObj = {};
  if(validateRecord(bGUID)){
    $('#btn-addbeacon').addClass('disabled');
    
    dataRowObj.GroupUUID        = $('#slct_bgroup').val();
    dataRowObj.Name	            = $('#beacon_name').val();
    //dataRowObj.RValue  	        = $('#slct_value').val();
    dataRowObj.Major            = $("#major_val").val();
    dataRowObj.Minor            = $("#minor_val").val();
    
    dataRowObj.IsActive = 1;
    dataRowObj.Created  = new Date();
    dataRowObj.Modified = new Date();
    
    AddBeacon(dataRowObj);
  }
}

function AddBeacon(dataRowObj){
	var jsonData = {
    "fields": dataRowObj
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/Beacons",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('"'+$('#beacon_name').val()+'" added!', 4000);
      
		  $('#add-beacon').html(addform);
			LoadBeacons();
      LoadBGroupDropDown(null, null);
		},
		error: function(){
			Materialize.toast('There was an error trying to add new beacon', 4000);
		}
	});
}

function EditBeacon(trGUID){
  
  var bData = $.grep(beaconArray, function(e){ return e.TableRecordGUID == trGUID});
  
	$('#add-title').text("Edit Beacon");
	$('#slct_bgroup').val(bData[0].GroupUUID);
  //$('#slct_value').val(bData[0].RValue);
  $('#beacon_name').val(bData[0].Name);
  $('#major_val').val(bData[0].Major);
  $('#minor_val').val(bData[0].Minor);
  
  LoadBGroupDropDown(bData[0].GroupUUID, bData[0].RValue);
  
	$('#beacon_name').focus();
  $('#major_val').focus();
  $('#minor_val').focus();
	
	$('.collection-item').each(function(){
		$(this).removeClass("bg-editblue");
	});
	
	$('li[table-record-guid="'+trGUID+'"]').addClass("bg-editblue");
	
	$('#form-btns').html('<a id="btn-updatebeacon" onclick="UpdateBeacon(\''+trGUID+'\')" class="waves-effect waves-light btn blue darken-3"><i class="material-icons left">edit</i>edit beacon</a> '
											+'<a onclick="CancelBeacon()" class="waves-effect waves-light btn grey darken-3">cancel</a>');
}

function UpdateBeacon(trGUID){
  if(validateRecord(trGUID)){
    $('#btn-updatebeacon').addClass('disabled');
      
    var jsonData = {
      "key": { "TableRecordGUID": trGUID},
      "fields": { "GroupUUID": $('#slct_bgroup').val(),
                  "Name": $('#beacon_name').val(),
                  "RValue": $('#slct_value').val(),
                  "Major": $('#major_val').val(),
                  "Minor": $('#minor_val').val(),
                  "Modified": new Date()
      }
    };
    
    $.ajax ({
      headers: {
        "Content-Type": "application/json"
      },
      url: ruIP + ruPort + listsDB + listEN + "update/virtual/"+UserData[0].SiteGUID+"/Beacons",
      type: "POST",
      data: JSON.stringify(jsonData),
      success: function(){
        Materialize.toast('"'+$('#beacon_name').val()+'" updated', 4000);
        
        $('#add-beacon').html(addform);
        LoadBeacons();
        LoadBGroupDropDown(null, null);
      },
      error: function(){
        Materialize.toast('There was an error trying to update beacon', 4000);
      }
    });
  }
}

function deleteBeacon(trGUID){
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
			Materialize.toast('Beacon deleted', 4000);
			
			$('#add-beacon').html(addform);
      LoadBeacons();
      LoadBGroupDropDown(null, null);
		}
	});
}

function deleteAlert(trGUID){
	DisplayConfirm("Confirm", "Are you sure you want to delete this Beacon?", function(){
		deleteBeacon(trGUID);
	});
}

function CancelBeacon(){
	$('#add-beacon').html(addform);
  LoadBeacons();
  LoadBGroupDropDown(null, null);
}

function validateRecord(uGUID){
  
  for(var key in beaconArray){
    if(beaconArray[key].Name == $('#beacon_name').val() && beaconArray[key].TableRecordGUID != uGUID){
      Materialize.toast('Beacon Name already in use!', 4000);
      $('#beacon_name').focus();
      return false;
    }
    if($('#beacon_name').val().replace(/\s/g, '') == ''){
      Materialize.toast('Beacon Name can\'t be empty', 4000);
      $('#beacon_name').focus();
      return false;
    }
    if($('#slct_bgroup').val() == null){
      Materialize.toast('Please select a Beacon Group', 4000);
      $('#slct_bgroup').focus();
      return false;
    }
    /*if($('#slct_value').val() == null){
      Materialize.toast('Please select a Value', 4000);
      $('#slct_value').focus();
      return false;
    }*/
    if($('#major_val').val().replace(/\s/g, '') == ''){
      Materialize.toast('Major value can\'t be empty', 4000);
      $('#major_val').focus();
      return false;
    }
    if($('#minor_val').val().replace(/\s/g, '') == ''){
      Materialize.toast('Minor value can\'t be empty', 4000);
      $('#minor_val').focus();
      return false;
    }
  }
  
  return true;
}

//Used for reset Add form
var addform = '<div class="row"><div class="col s12"><h5 class="center-align" id="add-title">Register Beacon</h5></div>'
              +'<div class="input-field col s12"><select id="slct_bgroup"><option value="" disabled>Choose a Beacon Group</option></select><label>Select Beacon Group</label></div>'
              +'<div class="input-field col s12"><input id="beacon_name" type="text" class="validate"><label for="beacon_name">Beacon Name</label></div>'
              +'<div class="input-field col s6"><input id="major_val" type="text" class="validate"><label for="major_val">Major</label></div>'
              +'<div class="input-field col s6"><input id="minor_val" type="text" class="validate"><label for="minor_val">Minor</label></div>'
              +'<div class="right" id="form-btns"><a id="btn-addbeacon" class="waves-effect waves-light btn orange darken-3"><i class="material-icons left">add</i>add beacon</a></div></div>';
