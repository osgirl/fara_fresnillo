/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/CONFIG/LISTS/JS
	File Name:			main.js
=============================================================*/

var equipmentlength;
var list1Data;
var list2Data;
var list1LName;
var list1LGUID;

$(document).ready(function() {
	LoadList1();	
});

function LoadList1(){
	var jqxhrlist1 = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"IsActive = '1' AND IsList = '1' AND SiteGUID = '"+UserData[0].SiteGUID+"' ORDER BY IsSystemTable DESC, IsLocked ASC, MatchupTableName ASC\"",function(){
		list1Data = $.parseJSON(jqxhrlist1.responseText);
		var select = $("#list1-collection").html("");
		
		//Inserts all records
		for(var key in list1Data){
			var icon;
			var deleteIcon = "";
			
			if(list1Data[key].IsSystemTable == true){
				icon = '<i class="circle blue darken-2 material-icons">settings</i>';
			} else if (list1Data[key].IsLocked == true){
				icon = '<i class="circle grey darken-2 material-icons" onclick="Lock(\''+list1Data[key].MatchupTableGUID+'\',\''+0+'\')">lock_outline</i>';
				deleteIcon = '<a href="#!" onclick="deleteAlert1(\''+list1Data[key].MatchupTableGUID+'\',\''+list1Data[key].IsLocked+'\')" class="secondary-content3"><i class="material-icons">delete</i></a></li>';
			} else {
				icon = '<i class="circle green darken-2 material-icons" onclick="Lock(\''+list1Data[key].MatchupTableGUID+'\',\''+1+'\')">lock_open</i>';
				deleteIcon = '<a href="#!" onclick="deleteAlert1(\''+list1Data[key].MatchupTableGUID+'\',\''+list1Data[key].IsLocked+'\')" class="secondary-content3"><i class="material-icons">delete</i></a></li>';
			}
			
			select.append('<li class="collection-item avatar" matchup-table-guid="'+list1Data[key].MatchupTableGUID+'" onclick="LoadList2(\''+list1Data[key].MatchupTableName+'\',\''+list1Data[key].MatchupTableGUID+'\')" style="min-height: 63px">'
										+ icon
										+'<p style="margin-top: 9px"><b>'+list1Data[key].MatchupTableName+'</b><br>'
										+ deleteIcon);
		}
		
		//Add search functionality
		$('#list1_search').hideseek({nodata: 'No results found'});
		
		//Trigger click on first element
		var target = $('#list1-collection');
		$('li:first-child', target).trigger('click');
	});
}

function LoadList2(tableName, tableGUID){
	var jqxhrlist2 = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/"+tableName+"?orderby="+tableName+" ASC",function(){
		list2Data = $.parseJSON(jqxhrlist2.responseText);
		var select = $("#list2-collection").html("");
		list1LName = tableName;
		list1LGUID = tableGUID;
		
		$('.collection-item').each(function(){
			$(this).removeClass("bg-editblue");
		});
		
		$('li[matchup-table-guid="'+tableGUID+'"]').addClass("bg-editblue");
		
		for(var key in list2Data){
			if(list2Data[key].TableRecordGUID != undefined){
				var num = parseInt(key) + 1;
				select.append('<li class="collection-item avatar" table-record-guid="'+list2Data[key].TableRecordGUID+'" style="min-height: 63px">'
							+'<i class="circle orange darken-2">'+num+'</i>'
							+'<p style="margin-top: 9px"><b>'+list2Data[key][tableName]+'</b><br>'
							+'<a href="#!" onclick="deleteAlert2(\''+list2Data[key].TableRecordGUID+'\')" class="secondary-content3"><i class="material-icons">delete</i></a></li>');
			}
		}
		
		//Add search functionality
		$('#list2_search').hideseek({nodata: 'No results found'});
	});
}

function ExportList1(){
	var dataRowObj = {};
	var dataRowObj2 = {};
	var repeatFlag = 0;
	var listName = $('#add_list1').val().replace(/ +(?=)/g,'');
	
	$('#btn-addlist1').addClass('disabled');
	
	for(var key in list1Data){
		if(list1Data[key].MatchupTableName == listName){
			repeatFlag = 1;
		}
	}
	
	if($('#add_list1').val() == "" || $('#add_list1').val() == " "){
		Materialize.toast('You forgot to add a name for the list', 3000);
		$('#add_list1').focus();
		
		$('#btn-addlist1').removeClass('disabled');
	} else if (repeatFlag == 1){
		Materialize.toast('List name already added', 3000);
		$('#add_list1').focus();
		$('#btn-addlist1').removeClass('disabled');
	}
	else{
		dataRowObj.MatchupTableGUID = CreateGUID();
		dataRowObj.MatchupTableName	= listName;
		dataRowObj.SiteGUID			= UserData[0].SiteGUID;
		dataRowObj.IsActive			= 1;
		dataRowObj.IsList			= 1,
		dataRowObj.IsSystemTable	= 0;
		dataRowObj.AvoidSync		= 0;
		dataRowObj.Created			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		dataRowObj.CreatedByGUID	= UserData[0].PersonGUID;
		dataRowObj.Modified			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		dataRowObj.Obsolete			= moment().format("9999-12-31T00:00:00.000z");
		
		dataRowObj2.MatchupTableElementGUID = CreateGUID();
		dataRowObj2.MatchupTableGUID		= dataRowObj.MatchupTableGUID;
		dataRowObj2.SiteGUID				= UserData[0].SiteGUID;
		dataRowObj2.MatchupTableElementName = listName;
		dataRowObj2.Ordinal					= 1
		dataRowObj2.ElementControlType		= "textfield";
		dataRowObj2.ElementDataType			= "string";
		dataRowObj2.Created					= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		dataRowObj2.Modified				= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		dataRowObj2.Obsolete				= moment().format("9999-12-31T00:00:00.000z");
		dataRowObj2.IsActive				= 1;
		
		AddList1(dataRowObj, dataRowObj2);
	}
}

function AddList1(dataRowObj, dataRowObj2){
	var jsonData = {
		 "fields": dataRowObj
	};
	var jsonData2 = {
		"fields": dataRowObj2
	}
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/dbo/MatchupTables",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			
			$.ajax ({
				headers: {
					"Content-Type": "application/json"
				},
				url: ruIP + ruPort + listsDB + listEN + "create/dbo/MatchupTableElements",
				type: "POST",
				data: JSON.stringify(jsonData2),
				success: function(){
					Materialize.toast('List added successfully!', 4000);
					
					LoadList1();
					$('#add-list1-form').html(addform1);
				},
				error: function(){
					Materialize.toast('There was an error trying to add new list', 4000);
				}
			});
			
		},
		error: function(){
			Materialize.toast('There was an error trying to add new list', 4000);
		}
	});
}

function ExportList2() {
	var dataRowObj = {};
	var repeatFlag = 0;
	
	for(var key in list2Data){
		if(list2Data[key][list1LName] == $('#add_list2').val()){
			repeatFlag = 1;
		}
	}
	
	$('#btn-addlist2').addClass('disabled');
	
	if($('#add_list2').val() == "" || $('#add_list2').val() == " "){
		Materialize.toast('You forgot to add a name for the list', 3000);
		$('#add_list2').focus();
		
		$('#btn-addlist2').removeClass('disabled');
	} else if(repeatFlag == 1){
		Materialize.toast('List name already added', 3000);
		$('#add_list2').focus();
		$('#btn-addlist2').removeClass('disabled');
	}
	else{
		dataRowObj[list1LName]	= $('#add_list2').val();
		
		AddList2(dataRowObj);
	}
}

function AddList2(dataRowObj){
	var jsonData = {
		 "fields": dataRowObj
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/"+ list1LName,
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('List added successfully!', 4000);
			
			LoadList2(list1LName, list1LGUID);
			$('#add-list2-form').html(addform2);
		},
		error: function(){
			Materialize.toast('There was an error trying to add new list', 4000);
		}
	});
}

function deleteList1(trGUID){
	
	var jsonData = {
		"key": { "MatchupTableGUID": trGUID},
		"fields": { "IsActive": 0 }
	};
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "update/dbo/MatchupTables",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('List deleted', 4000);
			
			LoadList1();
		}
	});
}
function deleteList2(trGUID){
	
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
			Materialize.toast('List deleted', 4000);
			
			LoadList2(list1LName, list1LGUID);
		}
	});
}

function deleteAlert1(trGUID, locked){
	if(locked == "true"){
		Materialize.toast('List is locked', 3000);
	}
	else{
		DisplayConfirm("Confirm", "Are you sure you want to delete this list?", function(){
			deleteList1(trGUID);
		});
	}
}
function deleteAlert2(trGUID){
	DisplayConfirm("Confirm", "Are you sure you want to delete this list?", function(){
		deleteList2(trGUID);
	});
}

function Lock(trGUID, varLock){
	var jsonData = {};
	var lock;
	if(varLock == "1"){
		lock = "lock";
		jsonData = {
			"key": { "MatchupTableGUID": trGUID},
			"fields": { "IsLocked": 1 }
		};
	}
	else{
		lock = "unlock";
		jsonData = {
			"key": { "MatchupTableGUID": trGUID},
			"fields": { "IsLocked": 0 }
		};
	}
	
	DisplayConfirm("Confirm", "Are you sure you want to "+lock+" this list?", function(){
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "update/dbo/MatchupTables",
			type: "POST",
			data: JSON.stringify(jsonData),
			success: function(){
				Materialize.toast('List '+lock+'ed', 3000);
				
				LoadList1();
			}
		});
	});
}

function CancelEquipment(){
	$('#add-equipment').html(addform);
	LoadEquipment();
}

var addform1 = '<div class="input-field col s12"><input id="add_list1" type="text"><label for="add_list1">Add New List</label>'
								+'<a id="btn-addlist1" class="waves-effect waves-light btn orange darken-3" onclick="ExportList1();">'
								+'<i class="material-icons left">add</i>add</a></div>';
								
var addform2 = '<div class="input-field col s12"><input id="add_list2" type="text"><label for="add_list2">Add New List</label>'
								+'<a id="btn-addlist2" class="waves-effect waves-light btn orange darken-3" onclick="ExportList2();">'
								+'<i class="material-icons left">add</i>add</a></div>';
