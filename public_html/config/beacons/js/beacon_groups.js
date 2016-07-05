/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/CONFIG/BEACONS/JS
	File Name:			beacon_groups.js
=============================================================*/

var equipmentlength;
var groupArray;

function BeaconGroupsInit() {
	LoadTablesDropDown(null, null);

	LoadBeaconGroups();

	$('#group_uuid').focus();
	$('#group_name').focus();
}

function LoadTablesDropDown(tabValue, relCol) {
	var jqxhrworktypes = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"IsActive = '1' AND IsList = '0' AND SiteGUID = '"+UserData[0].SiteGUID+"' ORDER BY IsSystemTable DESC, IsLocked ASC, MatchupTableName ASC\"", function() {
		
		var worktypeData = $.parseJSON(jqxhrworktypes.responseText);
		
    var select = $('#rel_table').empty();
		
    select.append('<option value="'+null+'" disabled selected>Choose a Table</option>');
		
		for(var key in worktypeData) {
			select.append( '<option value="'
                    + worktypeData[key].MatchupTableName
                    + '">'
                    + worktypeData[key].MatchupTableName
                    + '</option>' );
		}
    
    //If there's a value set
    if(tabValue){
      $('#rel_table').val(tabValue);
      
      LoadColumnDropdown(relCol);
    }else{
      $('#display_col').material_select();
    }
		$('#rel_table').material_select();
	});
  
  $('#rel_table').unbind('change');
  $("#rel_table").change(function() {
    LoadColumnDropdown(null);
  });
}

function LoadColumnDropdown(colValue){
  
  var tablename = $("#rel_table option:selected").text();
  
  var jqxhrworktypes = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/" + tablename, function() {
		var worktypeData = $.parseJSON(jqxhrworktypes.responseText);
    
    var lengthdata = Object.keys(worktypeData[0]).length;
    var datakeys = Object.keys(worktypeData[0]);
    
    var select = $('#display_col').empty();
		
    select.append('<option value="'+null+'" disabled selected>Choose a Column</option>');
		
    for(var i = 1; i < lengthdata; i++){
      select.append( '<option value="'
                    + datakeys[i]
                    + '">'
                    + datakeys[i]
                    + '</option>' ); 
    }
     if(colValue) {
       	$('#display_col').val(colValue);
     }
		$('#display_col').material_select();
  });
}

function LoadBeaconGroups(){
	groupArray = [];
	
	var jqxhrgroups = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/BeaconGroups", function() {
		var groupsData = $.parseJSON(jqxhrgroups.responseText);
    groupArray = groupsData;
		var select = $("#bea-collection").html("");
    
		$('#group_name').val('');
		$('#rel_table').val('');
    $('#display_col').val('');
		
		for(var key in groupsData){
			var num = parseInt(key) + 1;
			select.append('<li class="collection-item avatar" table-record-guid="'+groupsData[key].TableRecordGUID+'">'
										+'<i class="circle orange darken-3">'+ num +'</i>'
										+'<p><b>Group Name:</b> '+groupsData[key].Name+' <br>'
										+'<b>R. Table:</b> '+groupsData[key].Relationship+' <br>'
                    +'<b>R. Column:</b> '+groupsData[key].DisplayName+'</p>'
										+'<a href="#!" onclick="EditBGroup(\''+groupsData[key].TableRecordGUID+'\',\''+groupsData[key].GroupUUID+'\',\''+groupsData[key].Name+'\',\''+groupsData[key].Relationship+'\',\''+groupsData[key].DisplayName+'\')" class="secondary-content"><i class="material-icons">edit</i></a>'
										+'<a href="#!" onclick="deleteAlertGroup(\''+groupsData[key].TableRecordGUID+'\',\''+groupsData[key].GroupUUID+'\')" class="secondary-content2"><i class="material-icons">delete</i></a></li>');
			
		}
		equipmentlength = groupsData.length;
    
    //Add search functionality
		$('#beacon_search').hideseek({nodata: 'No beacon group found'});
		
	});
  
  $('#btn-addbeacongroup').click(function(){
		ExportBGroup('');
	});
  
  //Set GroupUUID
  $('#group_uuid').val(CreateGUID());
}

function ExportBGroup(bGUID){
	var dataRowObj = {};
  if(validateRecordGroup(bGUID)){
    $('#btn-addequipment').addClass('disabled');
    
    dataRowObj.GroupUUID        = $('#group_uuid').val();
    dataRowObj.Name	            = $('#group_name').val();
    dataRowObj.Relationship  	  = $('#rel_table').val();
    dataRowObj.DisplayName      = $("#display_col").val();
    
    dataRowObj.IsActive = 1;
    dataRowObj.Created  = new Date();
    dataRowObj.Modified = new Date();
    
    AddBGroup(dataRowObj);
  }
}

function AddBGroup(dataRowObj){
	var jsonData = {
    "fields": dataRowObj
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/BeaconGroups",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('"'+$('#group_name').val()+'" added!', 4000);
      
		  $('#add-beacongroup').html(addformgroup);
			LoadBeaconGroups();
      LoadTablesDropDown(null, null);
		},
		error: function(){
			Materialize.toast('There was an error trying to add new beacon group', 4000);
		}
	});
}

function EditBGroup(trGUID, groupUUID, groupName, relTable, relCol){
	$('#add-title').text("Edit Beacon Group");
  
  $('#group_uuid').val(groupUUID);
	$('#group_name').val(groupName);
  LoadTablesDropDown(relTable, relCol);
	//$('#rel_table').val(relTable);
  
	//LoadColumnDropdown(relCol);
  //$('#display_col').val(relCol);
  
  $('#group_uuid').focus();
	$('#group_name').focus();
	
	$('.collection-item').each(function(){
		$(this).removeClass("bg-editblue");
	});
	
	$('li[table-record-guid="'+trGUID+'"]').addClass("bg-editblue");
	
	$('#form-btns').html('<a id="btn-updateequipment" onclick="UpdateBGroup(\''+trGUID+'\',\''+groupUUID+'\')" class="waves-effect waves-light btn blue darken-3"><i class="material-icons left">edit</i>edit beacon group</a> '
											+'<a onclick="CancelBGroup()" class="waves-effect waves-light btn grey darken-3">cancel</a>');
}

function UpdateBGroup(trGUID, groupUUID){
  if(validateRecordGroup(trGUID)){
    $('#btn-updateequipment').addClass('disabled');
      
    var jsonData = {
      "key": { "TableRecordGUID": trGUID},
      "fields": { "GroupUUID": $('#group_uuid').val(),
                  "Name": $('#group_name').val(),
                  "Relationship": $('#rel_table').val(),
                  "DisplayName": $('#display_col').val(),
                  "Modified": new Date()
      }
    };
    
    $.ajax ({
      headers: {
        "Content-Type": "application/json"
      },
      url: ruIP + ruPort + listsDB + listEN + "update/virtual/"+UserData[0].SiteGUID+"/BeaconGroups",
      type: "POST",
      data: JSON.stringify(jsonData),
      success: function(){
        Materialize.toast('"'+$('#group_name').val()+'" updated', 4000);
        
        $('#add-beacongroup').html(addformgroup);
        LoadBeaconGroups();
        LoadTablesDropDown(null, null);
      },
      error: function(){
        Materialize.toast('There was an error trying to update beacon group', 4000);
      }
    });
    
    //If Old GroupUUID is not equal to New GroupUUID, then search and modify beacon's GroupUUID
    if($('#group_uuid').val() !== groupUUID){
      var jqxhrbeacons = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Beacons", function() {
        var beaconsData = $.parseJSON(jqxhrbeacons.responseText);
        
        for(var key in beaconsData){
          if(beaconsData[key].GroupUUID == groupUUID){
            var jsonData2 = {
              "key": { "TableRecordGUID": beaconsData[key].TableRecordGUID},
              "fields": { "GroupUUID": $('#group_uuid').val() }
            };
            
            $.ajax ({
              headers: {
                "Content-Type": "application/json"
              },
              url: ruIP + ruPort + listsDB + listEN + "update/virtual/"+UserData[0].SiteGUID+"/Beacons",
              type: "POST",
              data: JSON.stringify(jsonData2),
              success: function(){
                
              }
            });
          }
        }
      });
    }
  }
}

function deleteBGroup(trGUID, groupUUID){
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
			Materialize.toast('Beacon Group deleted', 4000);
			
			$('#add-beacongroup').html(addformgroup);
      LoadBeaconGroups();
      LoadTablesDropDown(null, null);
		}
	});
  
  var jqxhrbeacons = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Beacons", function() {
		var beaconsData = $.parseJSON(jqxhrbeacons.responseText);
    
    for(var key in beaconsData){
      if(beaconsData[key].GroupUUID == groupUUID){
        var jsonData2 = {
          "key": { "TableRecordGUID": beaconsData[key].TableRecordGUID},
          "fields": { "GroupUUID": null }
        };
        
        $.ajax ({
          headers: {
            "Content-Type": "application/json"
          },
          url: ruIP + ruPort + listsDB + listEN + "update/virtual/"+UserData[0].SiteGUID+"/Beacons",
          type: "POST",
          data: JSON.stringify(jsonData2),
          success: function(){
            
          }
        });
      }
    }
  });
  
}

function deleteAlertGroup(trGUID, groupUUID){
	DisplayConfirm("Confirm", "Are you sure you want to delete this Beacon Group?", function(){
		deleteBGroup(trGUID, groupUUID);
	});
}

function CancelBGroup(){
	$('#add-beacongroup').html(addformgroup);
  LoadBeaconGroups();
  LoadTablesDropDown(null, null);
}

function validateRecordGroup(uGUID){
  
  for(var key in groupArray){
    if(groupArray[key].GroupUUID == $('#group_uuid').val() && groupArray[key].TableRecordGUID != uGUID){
      Materialize.toast('Group UUID already in use!', 4000);
      $('#group_uuid').focus();
      return false;
    }
    if(groupArray[key].Name == $('#group_name').val() && groupArray[key].TableRecordGUID != uGUID){
      Materialize.toast('Group Name already in use!', 4000);
      $('#group_name').focus();
      return false;
    }
    if($('#group_name').val().replace(/\s/g, '') == ''){
      Materialize.toast('Group Name can\'t be empty', 4000);
      $('#group_name').focus();
      return false;
    }
    if($('#rel_table').val() == null){
      Materialize.toast('Please select a Relationship Table', 4000);
      $('#rel_table').focus();
      return false;
    }
    if($('#display_col').val() == null){
      Materialize.toast('Please select a Relationship Column', 4000);
      $('#display_col').focus();
      return false;
    }
  }
  
  return true;
}

//Used for reset Add form
var addformgroup = '<div class="row"><div class="col s12"><h5 class="center-align" id="add-title">Add New Beacon Group</h5></div>'
              +'<div class="input-field col s12"><input id="group_uuid" type="text"><label for="group_uuid" class="active">Group UUID</label></div>'
              +'<div class="input-field col s12"><input id="group_name" type="text" class="validate"><label for="group_name">Group Name</label></div>'
              +'<div class="input-field col s12"><select id="rel_table"><option value="" disabled>Choose a Table</option></select><label>Relationship Table</label></div>'
              +'<div class="input-field col s12"><select id="display_col"><option value="" disabled>Choose a Column</option></select><label>Relationship Column</label></div>'
              +'<div class="right" id="form-btns"><a id="btn-addbeacongroup" class="waves-effect waves-light btn orange darken-3"><i class="material-icons left">add</i>add beacon group</a></div></div>'

