/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/CONFIG/BEACONS/JS
	File Name:			beacon_assignments.js
=============================================================*/

var equipmentlength;
var beaconArray;
var bgroupArray;
var ebeaconArray;

function BeaconAssignmentsInit() {
	LoadBeaconsDropDown(null);

	LoadBeaconAssign();

	LoadBGroup();
}

function LoadBeaconsDropDown(trGUID) {
  beaconArray = [];
  
	var jqxhrworktypes = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Beacons?where=\"RValue IS NULL\"", function() {
		
		var worktypeData = $.parseJSON(jqxhrworktypes.responseText);
    beaconArray = worktypeData;
		
    var select = $('#slct_beacon').empty();
    
    select.append('<option value="'+null+'" disabled selected>Choose a Beacon</option>');
		
		for(var key in worktypeData) {
			select.append( '<option value="'
                    + worktypeData[key].TableRecordGUID
                    + '">'
                    + worktypeData[key].Name
                    + '</option>' );
		}
    
    //If there's a value set
    if(trGUID){
      $('#slct_beacon').val(trGUID);
      
      LoadValueDropdown(trGUID);
    }else{
      $('#slct_value').material_select();
    }
		 $('#slct_beacon').material_select();
	});
  
  $('#slct_beacon').unbind('change');
  $("#slct_beacon").change(function() {
    LoadValueDropdown(null);
  });
}

//Alternate function when loading edit
function LoadBeaconEdit(trGUID, bName, vName){
  
    var select = $('#slct_beacon').empty();
    
		for(var key in ebeaconArray) {
			select.append( '<option value="'
                    + trGUID
                    + '">'
                    + bName
                    + '</option>' );
		}
      
      LoadValueDropdown(vName, 1);

		 $('#slct_beacon').material_select();
}

function LoadBGroup() {
  bgroupArray = [];
  
	var jqxhrworktypes = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/BeaconGroups", function() {
    var worktypeData = $.parseJSON(jqxhrworktypes.responseText);
    bgroupArray = worktypeData;
  });
}

function LoadValueDropdown(colValue, flag){
  var trguid = $("#slct_beacon").val();
  var bData;
  
  if(flag == 1){
    bData = $.grep(ebeaconArray, function(e){ return e.TableRecordGUID == trguid});
  } else {
    bData = $.grep(beaconArray, function(e){ return e.TableRecordGUID == trguid});
  }

  var bgData = $.grep(bgroupArray, function(e){ return e.GroupUUID == bData[0].GroupUUID});
  
  var bRTable = bgData[0].Relationship;
  var bRColumn = bgData[0].DisplayName;
  
  var jqxhrworktypes = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/" + bRTable, function() {
		var worktypeData = $.parseJSON(jqxhrworktypes.responseText);
    
    var select = $('#slct_value').empty();
		
    select.append('<option value="'+null+'" disabled selected>Choose an Assignment</option>');
		
    for(var key in worktypeData){
      if(worktypeData[key].TableRecordGUID){
        select.append( '<option value="'
                    + worktypeData[key].TableRecordGUID
                    + '">'
                    + worktypeData[key][bRColumn]
                    + '</option>' );
      }
      else{
        select.append( '<option value="'
                    + worktypeData[key][bRColumn]
                    + '">'
                    + worktypeData[key][bRColumn]
                    + '</option>' );
      }
      
    }
    
     if(colValue) {
       	$('#slct_value').val(colValue);
     }
		$('#slct_value').material_select();
  });
}

function LoadBeaconAssign(){
	ebeaconArray = [];
	
	var jqxhrgroups = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Beacons?where=\"RValue IS NOT NULL\"", function() {
		var groupsData = $.parseJSON(jqxhrgroups.responseText);
    ebeaconArray = groupsData;
		var select = $("#bea-collection").html("");
    
		$('#group_name').val('');
		$('#rel_table').val('');
    $('#slct_value').val('');
		
		for(var key in groupsData){
			var num = parseInt(key) + 1;
			select.append('<li class="collection-item avatar" table-record-guid="'+groupsData[key].TableRecordGUID+'">'
										+'<i class="circle orange darken-3">'+ num +'</i>'
										+'<p><b>Beacon Name:</b> '+groupsData[key].Name+' <br>'
										+'<b>Assignment:</b> '+groupsData[key].RValueDisplayName+' <br></p>'
										+'<a href="#!" onclick="EditBeaconAssign(\''+groupsData[key].TableRecordGUID+'\',\''+groupsData[key].Name+'\',\''+groupsData[key].RValue+'\')" class="secondary-content"><i class="material-icons">edit</i></a>'
										+'<a href="#!" onclick="deleteAlertAssign(\''+groupsData[key].TableRecordGUID+'\')" class="secondary-content2"><i class="material-icons">delete</i></a></li>');
		}
		equipmentlength = groupsData.length;
    
    //Add search functionality
		$('#beacon_search').hideseek({nodata: 'No beacon - assignment found'});
		
	});
  
  $('#btn-addbeaconassign').click(function(){
		ExportBeaconAssign($("#slct_beacon").val());
	});
}

function ExportBeaconAssign(bGUID){
  if(validateRecordAssign(bGUID)){
    $('#btn-addbeaconassign').addClass('disabled');
    
    AddBeaconAssign(bGUID);
  }
}

function AddBeaconAssign(trGUID){
  
  var tempRValue = '';
  tempRValue =  ($('#slct_value').val() != 'undefined') ? $('#slct_value').val() : $("#slct_value option:selected").text();
  
	var jsonData = {
      "key": { "TableRecordGUID": trGUID},
      "fields": { "RValue": tempRValue,
                  "RValueDisplayName": $("#slct_value option:selected").text()
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
			Materialize.toast('"'+$("#slct_beacon option:selected").text()+'" assignment added!', 4000);
      
		  $('#add-beaconassign').html(addform);
      
			LoadBeaconsDropDown(null);
      LoadBeaconAssign();
      LoadBGroup();
		},
		error: function(){
			Materialize.toast('There was an error trying to add new beacon assignment', 4000);
		}
	});
}

function EditBeaconAssign(trGUID, bName, vName){
	$('#add-title').text("Edit Beacon Assignment");
  $('#slct_beacon').attr("disabled", true);
  
  LoadBeaconEdit(trGUID, bName, vName);
  
	$('#slct_beacon').focus();
  $('#slct_value').focus();
	
	$('.collection-item').each(function(){
		$(this).removeClass("bg-editblue");
	});
	
	$('li[table-record-guid="'+trGUID+'"]').addClass("bg-editblue");
	
	$('#form-btns').html('<a id="btn-updatebeaconassign" onclick="UpdateBeaconAssign(\''+trGUID+'\')" class="waves-effect waves-light btn blue darken-3"><i class="material-icons left">edit</i>edit assignment</a> '
											+'<a onclick="CancelBeaconAssign()" class="waves-effect waves-light btn grey darken-3">cancel</a>');
}

function UpdateBeaconAssign(trGUID){
  if(validateRecordAssign(trGUID)){
    $('#btn-updatebeaconassign').addClass('disabled');
    
      var tempRValue = '';
      tempRValue =  ($('#slct_value').val() != 'undefined') ? $('#slct_value').val() : $("#slct_value option:selected").text();
  
      
    var jsonData = {
      "key": { "TableRecordGUID": trGUID},
      "fields": { "RValue": tempRValue,
                  "RValueDisplayName": $("#slct_value option:selected").text()
      }
    };
    console.log(jsonData);
    $.ajax ({
      headers: {
        "Content-Type": "application/json"
      },
      url: ruIP + ruPort + listsDB + listEN + "update/virtual/"+UserData[0].SiteGUID+"/Beacons",
      type: "POST",
      data: JSON.stringify(jsonData),
      success: function(){
        Materialize.toast('"'+$("#slct_beacon option:selected").text()+'" updated', 4000);
        
        $('#add-beaconassign').html(addform_assign);
        
        LoadBeaconsDropDown(null);
        LoadBeaconAssign();
        LoadBGroup();
      },
      error: function(){
        Materialize.toast('There was an error trying to update assignment', 4000);
      }
    });
  }
}

function deleteBeaconAssign(trGUID){
	var jsonData = {
		"key": { "TableRecordGUID": trGUID},
		"fields": { "RValue": null,
                "RValueDisplayName": null
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
			Materialize.toast('Beacon assignment removed', 4000);
			
			$('#add-beaconass').html(addform_assign);
      
      LoadBeaconsDropDown(null);
      LoadBeaconAssign();
      LoadBGroup();
		}
	});
}

function deleteAlertAssign(trGUID){
	DisplayConfirm("Confirm", "Are you sure you want to remove the assignment to this beacon?", function(){
    deleteBeaconAssign(trGUID);
	});
}

function CancelBeaconAssign(){
	$('#add-beaconassign').html(addform_assign);
  
  LoadBeaconsDropDown(null);
  LoadBeaconAssign();
  LoadBGroup();
}

function validateRecordAssign(uGUID){
  
  for(var key in beaconArray){
    if($('#slct_beacon').val() == null){
      Materialize.toast('Please select a Beacon', 4000);
      $('#slct_beacon').focus();
      return false;
    }
    if($('#slct_value').val() == null){
      Materialize.toast('Please select an Assignment Value', 4000);
      $('#slct_value').focus();
      return false;
    }
  }
  
  return true;
}

//Used for reset Add form
var addform_assign = '<div class="row"><div class="col s12"><h5 class="center-align" id="add-title">Add Beacon Assignment</h5></div>'
              +'<div class="input-field col s12"><select id="slct_beacon"><option value="" disabled>Choose a Beacon</option></select><label>Select Beacon</label></div>'
              +'<div class="input-field col s12"><select id="slct_value"><option value="" disabled>Choose an Assignment</option></select><label>Select Value</label></div>'
              +'<div class="right" id="form-btns"><a id="btn-addbeaconassign" class="waves-effect waves-light btn orange darken-3"><i class="material-icons left">add</i>add assignment</a></div></div>';
