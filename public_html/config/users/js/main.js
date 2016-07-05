/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/CONFIG/USERS/JS
	File Name:			main.js
=============================================================*/

var usersArray = [];

$(document).ready(function() {
	LoadUsers();

	$('#btn-adduser').click(function(){
		ExportUser('0','');
	});

	$('#btn-canceluser').click(function(){
		$('#user_role').val(''); $('#personnel_id').val(''); $('#first_name').val(''); $('#middle_name').val(''); $('#last_name').val(''); $('#display_name').val(''); $('#email_txt').val(''); $('#username_txt').val(''); $('#password_txt').val(''); 
	});

	$("#user_site").focus();
	$("#user_site").val(UserData[0].SiteDisplayName);
	
});

function LoadRoles() {
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/cfg/Role?where=\"IsActive = '1' AND DisplayName != 'SuperAdmin' ORDER BY DisplayName ASC\"", function( roleData ) {

		for(var key in roleData){
			$("#user_role").append('<option value="'+roleData[key].RoleGUID+'">'+roleData[key].DisplayName+'</option>');
		}

		$('select').material_select();
	});
}

function LoadUsers() {
	usersArray = [];

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/web/v_Person?where=\"IsActive = '1' AND SiteGUID = '"+UserData[0].SiteGUID+"' AND RoleDisplayName != 'SuperAdmin' ORDER BY DisplayName ASC\"", function( userData ) {
		usersArray = userData;
		
		var select = $("#user-collection").html("");

		//Set Add fields empty
		$('#user_role').val(''); $('#personnel_id').val(''); $('#first_name').val(''); $('#middle_name').val(''); $('#last_name').val(''); $('#display_name').val(''); $('#email_txt').val(''); $('#username_txt').val(''); $('#password_txt').val(''); 

		for(var key in userData) {
			var num = parseInt(key) + 1;
			var mname = userData[key].MiddleName;
			var setname;

			//If Middle Name exists, then show it up
			if(userData[key].MiddleName == null){
				setname = '<p><b>Name:</b> '+userData[key].Firstname+' '+userData[key].LastName+'<br>';
			}else{
				setname = '<p><b>Name:</b> '+userData[key].Firstname+' '+userData[key].MiddleName+' '+userData[key].LastName+'<br>'
			}

			select.append('<li class="collection-item avatar" person-guid="'+userData[key].PersonGUID+'">'
			+'<div class="collapsible-header"><i class="circle orange darken-3">'+ num +'</i>'
			+ setname
			+'<b>Email:</b> '+userData[key].Email+'</p>'
			+'<a href="#!" onclick="EditUser(\''+userData[key].PersonGUID+'\')" class="secondary-content"><i class="material-icons">edit</i></a>'
			+'<a href="#!" onclick="deleteAlert(\''+userData[key].PersonGUID+'\')" class="secondary-content2"><i class="material-icons">delete</i></a></div>'
			+'<div class="collapsible-body">'
			+'<p><b>PersonnelId:</b> '+userData[key].PersonnelId+'<br>'
			+'<b>Site:</b> '+userData[key].SiteDisplayName+'<br>'
			+'<b>Role:</b> '+userData[key].RoleDisplayName+'<br>'
			+'<b>UserName:</b> '+userData[key].AppUserName+'</p>'
			+'</div></li>');
		}

		//Add search functionality
		$('#user_search').hideseek({nodata: 'No user found'});

		$('.collapsible').collapsible({
			accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		});			
		LoadRoles();
	});

	//Set Site value again
	$("#user_site").focus();
	$("#user_site").val(UserData[0].SiteDisplayName);

	$('select').material_select();
}

function ExportUser(flag, uGUID){
	var dataRowObj = {};

	if(validateRecord(uGUID)){
		if(flag == '0'){
			dataRowObj.PersonGUID			= CreateGUID();
			dataRowObj.SiteGUID				= UserData[0].SiteGUID;
			dataRowObj.RoleGUID				= $('#user_role').val();
			dataRowObj.PersonnelId			= $('#personnel_id').val();
			dataRowObj.Firstname			= $('#first_name').val().replace(/\s/g, '');
			dataRowObj.MiddleName			= $("#middle_name").val().replace(/\s/g, '');
			dataRowObj.LastName				= $("#last_name").val().replace(/\s/g, '');
			dataRowObj.DisplayName			= $("#display_name").val();
			dataRowObj.Email				= $("#email_txt").val();
			dataRowObj.AppUserName			= $("#username_txt").val();
			dataRowObj.AppPassword			= $("#password_txt").val();
			dataRowObj.IsLDAPUser			= false;
			dataRowObj.LDAPUserName			= $("#username_txt").val();
			dataRowObj.WebUser				= true;
			dataRowObj.iOSUser				= true;
			dataRowObj.IsLicenseAccepted	= false;
			dataRowObj.IsActive 			= 1;
			dataRowObj.Created  			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataRowObj.Modified 			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			dataRowObj.Obsolete				= moment().format("9999-12-31T00:00:00.000z");
			dataRowObj.ProcessFlag			= 0;
			dataRowObj.TabletUUID			= null;
			dataRowObj.ShowInTracker		= null;

			AddUser(dataRowObj);
		}
		else if(flag == '1') {
			var apiKeyObj = {};

			apiKeyObj.PersonGUID	= uGUID;
      
			dataRowObj.RoleGUID		= $('#user_role').val();
			dataRowObj.PersonnelId	= $('#personnel_id').val();
			dataRowObj.Firstname	= $('#first_name').val();
			dataRowObj.MiddleName	= $("#middle_name").val();
			dataRowObj.LastName		= $("#last_name").val();
			dataRowObj.DisplayName	= $("#display_name").val();
			dataRowObj.Email		= $("#email_txt").val();
			dataRowObj.AppUserName	= $("#username_txt").val();
			dataRowObj.AppPassword	= $("#password_txt").val();
			dataRowObj.LDAPUserName	= $("#username_txt").val();
			dataRowObj.Modified		= moment().format("YYYY-MM-DDTHH:mm:ss.000z");

			UpdateUser(apiKeyObj, dataRowObj);
		}
	}
}

function AddUser(dataRowObj) {
	$('#btn-adduser').addClass('disabled');

	var jsonData = {
		"fields": dataRowObj
	};

	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/cfg/Person",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast(dataRowObj.AppUserName+' was added successfully!', 4000);
			ResetForm();
		},
			error: function(){
			Materialize.toast('There was an error trying to add '+ dataRowObj.AppUserName, 4000);
		}
	});
}

function EditUser(trGUID) {
	$('#add-title').text("Edit User");

	var userData = $.grep(usersArray, function(e){ return e.PersonGUID == trGUID});

	$('#user_site').val(userData[0].SiteDisplayName);
	$('#user_role').val(userData[0].RoleGUID);
	$('#personnel_id').val(userData[0].PersonnelId);
	$('#first_name').val(userData[0].Firstname);
	$('#middle_name').val(userData[0].MiddleName);
	$('#last_name').val(userData[0].LastName);
	$('#display_name').val(userData[0].DisplayName);
	$('#email_txt').val(userData[0].Email);
	$('#username_txt').val(userData[0].AppUserName);
	$('#password_txt').val(userData[0].AppPassword);
	
	FocusForm();

	$('.collection-item').each(function(){
		$(this).removeClass("bg-editblue");
	});

	$('li[person-guid="'+trGUID+'"]').addClass("bg-editblue");

	$('#form-btns').html('<a id="btn-updateuser" onclick="ExportUser(\''+1+'\',\''+trGUID+'\')" class="waves-effect waves-light btn blue darken-3"><i class="material-icons left">edit</i>edit user</a> '
	+'<a onclick="ResetForm()" class="waves-effect waves-light btn grey darken-3">cancel</a>');

	//Reset select to show new selected value                 
	$('select').material_select();
}

function FocusForm() {
	$('#user_site').focus();
	$('#user_role').focus();
	$('#personnel_id').focus();
	$('#first_name').focus();
	$('#middle_name').focus();
	$('#last_name').focus();
	$('#display_name').focus();
	$('#email_txt').focus();
	$('#username_txt').focus();
	$('#password_txt').focus();
	$('#personnel_id').focus();	
}

function BlurForm() {
	$('#user_site').blur();
	$('#user_role').blur();
	$('#personnel_id').blur();
	$('#first_name').blur();
	$('#middle_name').blur();
	$('#last_name').blur();
	$('#display_name').blur();
	$('#email_txt').blur();
	$('#username_txt').blur();
	$('#password_txt').blur();
	$('#personnel_id').blur();	
}

function UpdateUser(apiKeyObj, dataRowObj) {
	$('#btn-updateuser').addClass('disabled');
  
	var jsonData = {
		"key": apiKeyObj,
		"fields": dataRowObj
	};

	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "update/cfg/Person",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast(dataRowObj.Email+' updated', 4000);			
			ResetForm();
		},
			error: function(){
			Materialize.toast('There was an error trying to update user', 4000);
		}
	});
}

function deleteUser(trGUID) {
	var jsonData = {
		"key": { "PersonGUID": trGUID},
		"fields": { "IsActive": 0 }
	};

	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "update/cfg/Person",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('User deleted', 4000);
			ResetForm();
		}
	});
}

function deleteAlert(trGUID){
	DisplayConfirm("Confirm", "Are you sure you want to delete this user?", function(){
		deleteUser(trGUID);
	});
}

function ResetForm() {
	$('#form-btns').html('<a id="btn-adduser" class="waves-effect waves-light btn orange darken-3"><i class="material-icons left">add</i>add user</a>');	
	$('#add-title').text("Add New User");
	LoadUsers();
	setTimeout(function() { BlurForm(); },250)
}

function validateRecord(uGUID){
  
  for(var key in usersArray){
    if(usersArray[key].PersonnelId == $('#personnel_id').val() && usersArray[key].PersonGUID != uGUID){
      Materialize.toast(languagePack.message.personnelIdExists, 4000);
      $('#personnel_id').focus();
      return false;
    }
    if(usersArray[key].Email == $('#email_txt').val() && usersArray[key].PersonGUID != uGUID){
      Materialize.toast(languagePack.users.emailInUse, 4000);
      $('#email_txt').focus();
      return false;
    }
    if(usersArray[key].AppUserName == $('#username_txt').val() && usersArray[key].PersonGUID != uGUID){
      Materialize.toast('Username already in use!', 4000);
      $('#username_txt').focus();
      return false;
    }
    if($('#email_txt').val().replace(/\s/g, '') == ''){
      Materialize.toast('Email can\'t be empty', 4000);
      $('#email_txt').focus();
      return false;
    }
    if($('#personnel_id').val().replace(/\s/g, '') == ''){
      Materialize.toast('Personnel ID can\'t be empty', 4000);
      $('#personnel_id').focus();
      return false;
    }
    if($('#username_txt').val().replace(/\s/g, '') == ''){
      Materialize.toast('Username can\'t be empty', 4000);
      $('#username_txt').focus();
      return false;
    }
    if($('#password_txt').val().replace(/\s/g, '') == ''){
      Materialize.toast('Password can\'t be empty', 4000);
      $('#password_txt').focus();
      return false;
    }
  }
  
  return true;
}

function LoadBottomSheet() {
	$("#modal-table .modal-header").html('Users');
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

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/web/v_Person?where=\"IsActive = '1' AND SiteGUID = '"+UserData[0].SiteGUID+"' ORDER BY DisplayName ASC\"", function( data ) {
		
		for(var key in data) {
			var formTypeObj		= {};
			formTypeObj.PersonnelId	= data[key].PersonnelId;
			formTypeObj.Firstname	= data[key].Firstname;
      formTypeObj.MiddleName	= data[key].MiddleName;
      formTypeObj.LastName	= data[key].LastName;
      formTypeObj.DisplayName	= data[key].DisplayName;
      formTypeObj.Email	= data[key].Email;
      formTypeObj.AppUserName	= data[key].AppUserName;
      formTypeObj.RoleDisplayName	= data[key].RoleDisplayName;
      formTypeObj.SiteDisplayName	= data[key].SiteDisplayName;
			formTypesArray.push(formTypeObj);
		}
	
		$("#modal-table .modal-subcontent").append($('<div id="jqxgrid"></div>'));
		
    var source = {
      localdata: formTypesArray,
      datatype: "array",
      datafields:
      [
        { name: 'PersonnelId',			type: 'string' },
        { name: 'Firstname',				type: 'string' },
        { name: 'MiddleName',	type: 'string' },
        { name: 'LastName',	type: 'string' },
        { name: 'DisplayName',	type: 'string' },
        { name: 'Email',	type: 'string' },
        { name: 'AppUserName',	type: 'string' },
        { name: 'RoleDisplayName',	type: 'string' },
        { name: 'SiteDisplayName',	type: 'string' }
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
        { text: 'Personnel Id',		    datafield: 'PersonnelId',		hidden: false },
        { text: 'First Name',			        datafield: 'Firstname',			hidden: false },
        { text: 'Middle Name',   datafield: 'MiddleName',	hidden: false },
        { text: 'Last Name',   datafield: 'LastName',	hidden: false },
        { text: 'Display Name',   datafield: 'DisplayName',	hidden: false },
        { text: 'Email',   datafield: 'Email',	hidden: false },
        { text: 'Username',   datafield: 'AppUserName',	hidden: false },
        { text: 'Role',   datafield: 'RoleDisplayName',	hidden: false },
        { text: 'Site',   datafield: 'SiteDisplayName',	hidden: false }
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
