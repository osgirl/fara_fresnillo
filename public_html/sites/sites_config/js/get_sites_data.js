/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/MENU/SITES_JS
	File Name:			get_sites_data.js
=============================================================*/

var EmailsArray					= [];
var SitesArray					= [];
var UserSiteArray				= [];
var ExistingTables2			= [];
var ExistingTables2Bckup = [];


LoadSites();

function LoadSites() {
	
	EmailsArray		= [];
	SitesArray		= [];
	UserSiteArray	= [];

	var jqxhrEmailArr = $.getJSON(ruIP + ruPort + listsDB + listEN + "read/cfg/Person?where=\"IsActive = '1'\"", function() {
			
		var emailData = jQuery.parseJSON(jqxhrEmailArr.responseText);
		
		for(var key in emailData) {
			EmailsArray.push(emailData[key].Email);
		}

		$.getJSON(ruIP + ruPort + listsDB + listEN + "read/org/Sites?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function( sitesData ) {
			SitesArray = sitesData;
			$.getJSON(ruIP + ruPort + listsDB + listEN + "read/web/v_Person?where=\"IsActive = '1' AND RoleDisplayName = 'SuperAdmin' ORDER BY DisplayName ASC\"", function( userSiteData ) {
				UserSiteArray = userSiteData;
				LoadSitesCollection();
			});
			
			var select = $('#select-site').empty();
		
			select.append('<option value="'+null+'" disabled selected>Choose a Site</option>');
			
			for(var key in SitesArray) {
				select.append( '<option value="'
													+ SitesArray[key].SiteGUID
													+ '">'
													+ SitesArray[key].SiteName
													+ '</option>' ); 
			}
			
			$('#select-site').material_select();
		});
	});
}

$("#select-site").change(function() {
	LoadModalTables();
});

function LoadModalTables(){
	ExistingTables2 = [];
	$("#modal-table .modal-header").html('Copy Data from the following Tables: '+$("#select-site :selected").text());
	$("#modal-table .modal-subcontent").html(
		'<div class="row" style="margin-top: -15px">'+
			'<div class="col s6">'+
				'<div class="orange darken-2">'+
					'<p class="center-align" style="color: #fff; font-weight: 600">Matchup Tables</p>'+
				'</div>'+
				'<div class="row" style="margin-top: -15px">'+
					'<div id="tablist-1" class="col m6 l4"></div>'+
					'<div id="tablist-2" class="col m6 l4"></div>'+
					'<div id="tablist-3" class="col m6 l4"></div>'+
				'</div>'+
			'</div>'+
			'<div class="col s6">'+
				'<div class="orange darken-2">'+
					'<p class="center-align" style="color: #fff; font-weight: 600">Lists</p>'+
				'</div>'+
				'<div class="row" style="margin-top: -15px">'+
					'<div id="tablist-4" class="col m6 l4"></div>'+
					'<div id="tablist-5" class="col m6 l4"></div>'+
					'<div id="tablist-6" class="col m6 l4"></div>'+
				'</div>'+
			'</div>'+
			
		'</div>'
	);
	$('#modal-table-close').html('Save & Close');
	
	//This grabs your JSON object of people.
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"SiteGUID = '"+ $("#select-site :selected").val() +"' AND IsActive = '1' ORDER BY MatchupTableName ASC\"", function( data ) {
		var length     = data.length;
		
		if(data.length == 0){
			$("#modal-table .modal-subcontent").html('<h5 class="center-align" style="margin-top: 170px">Site "'+$("#select-site :selected").text()+'" has no tables to duplicate</h5>');
		}
		else{
			var lcount = 0;
			var tcount = 0;
			
			for(var key = 0; key < length; key++) {
				var num;
				if(data[key].IsList == 0){
					if(tcount >= 0 && tcount < 10){
						num = 1;
					} else if(tcount >= 10 && tcount < 20){
						num = 2;
					} else {
						num = 3;
					}
					
					tcount++;
				}
				else{
					if(lcount >= 0 && lcount < 10){
						num = 4;
					} else if(lcount >= 10 && lcount < 20){
						num = 5;
					} else {
						num = 6;
					}
					
					lcount++;
				}
				
				/*if(key >= 0 && key < 10){
					num = 1;
				} else if(key >= 10 && key < 21){
					num = 2;
				} else if(key >= 21 && key < 32){
					num = 3;
				} else if(key >= 32 && key < 43){
					num = 4;
				} else if(key >= 43 && key < 54){
					num = 5;
				}
				else {
					num = 6;
				}*/
				
				$("#tablist-"+num+"").append(
					'<p>'+
						'<input type="checkbox" id="'+data[key].MatchupTableName+'" onclick="changeCB(this);" checked="checked" />'+
						'<label for="'+data[key].MatchupTableName+'">'+data[key].MatchupTableName+'</label>'+
					'</p>'
				)
			}
			
			for(var key in data) {
				/*var currentObject = {};
				currentObject.dataTable           = data[key];
				currentObject.tableStructureArray = [];
				currentObject.oldGUID             = ""; 
				currentObject.oldValues           = [];
				currentObject.GUID 								= data[key].MatchupTableGUID;
				ExistingTables2.push(currentObject);
				ExistingTables2Bckup.push(currentObject);
				*/
				ExistingTables2.push(data[key].MatchupTableName);
			}
		}

	});
		
	DisplayBottomSheet();
}

function changeCB(cb){
	if(cb.checked == false){
		for( i=ExistingTables2.length-1; i>=0; i--) {
			if( ExistingTables2[i] == cb.id ){
				ExistingTables2.splice(i,1);
			} 
		}
	} else if(cb.checked == true){
		//var objtb = $.grep(ExistingTables2Bckup, function(e){ return e.GUID == cb.id; });
		ExistingTables2.push(cb.id);
		console.log(cb.id);
	}
}

function LoadSitesCollection() {
	
	var siteList = $("#site-collection").html("");
	
	//Set Add fields empty
	$('#site_name').val('');
	$('#first_name').val('');
	$('#last_name').val('');
	$('#email').val('');
	
	for(var site in SitesArray) {
		var num = parseInt(site) + 1;
		var siteDetailsHTMl = "";
		
		for(var user in UserSiteArray) {
			
			if(UserSiteArray[user].SiteGUID == SitesArray[site].SiteGUID) {
				siteDetailsHTMl	+= '<b>Super Admin:</b> '+UserSiteArray[user].DisplayName+'<br>'
								+ '<b>Email:</b> '+UserSiteArray[user].Email+'<br>';
			}
		}
		
		siteList.append('<li class="collection-item avatar" site-guid="'+SitesArray[site].SiteGUID+'">'
		+ '<div class="collapsible-header"><i class="circle orange darken-3">'+ num +'</i>'
		+ '<p><b>Site Name:</b> '+SitesArray[site].SiteName+'</p>'
		+ '<a href="#!" onclick="confirmSiteDelete(\''+SitesArray[site].SiteGUID+'\',\''+SitesArray[site].SiteName+'\')" class="secondary-content"><i class="material-icons">delete</i></a>'
		+ '<a href="#!" onclick="confirmBackup(\''+SitesArray[site].SiteGUID+'\',\''+SitesArray[site].SiteName+'\')" class="secondary-content2"><i class="material-icons">backup</i></a></div>'
		+ '<div class="collapsible-body"><p>'
		+ siteDetailsHTMl
		+ '</p></div></li>');
	}

	//Add search functionality
	$('#site_search').hideseek({nodata: 'No sites found'});

	$('.collapsible').collapsible({
		accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	});
	
	ServiceComplete();
	ClosePreloader();
}

function NewSiteValidation() {
	var newEntry	= $.trim($("#site_name").val());
	var firstName	= $.trim($("#first_name").val());
	var lastName	= $.trim($("#last_name").val());
	var email		= $.trim($("#email").val());
	var entryExists	= false;
	var emailExists	= false;
	
	for(var key in SitesArray) {
		(newEntry.toUpperCase() == SitesArray[key].SiteName.toUpperCase()) ?  entryExists = true : false;
	}
	
	for(var key in EmailsArray) {
		(email.toUpperCase() == EmailsArray[key].toUpperCase()) ? emailExists = true : false;
	}
	
	if(entryExists) {
		DisplayAlert(languagePack.message.alert,newEntry + " " + languagePack.message.entryExists);
	}
	else if(emailExists) {
		DisplayAlert(languagePack.message.alert, languagePack.message.theEmail + " " + email + " " + languagePack.message.emailInUse);
	}
	else if(newEntry == "") {
		DisplayAlert(languagePack.message.alert,languagePack.message.enterSiteName);
	}
	else if(firstName == "") {
		DisplayAlert(languagePack.message.alert,languagePack.message.enterFirstName);
	}
	else if(lastName == "") {
		DisplayAlert(languagePack.message.alert,languagePack.message.enterLastName);
	}
	else if(email == "") {
		DisplayAlert(languagePack.message.alert,languagePack.message.enterEmailAddress);
	}
	else {
		createSite(newEntry, firstName, lastName, email);
	}
}

function UpdateProgressBar(tableName, tableNumber, length) {
	loadingValue = ((tableNumber / length) * 100);
	
	DisplayPreloader("Loading - " + tableName, loadingValue);
}

function confirmBackup(siteGUID, siteName){
	DisplayConfirm("Confirm Backup", "Do you want to <b>BACKUP</b> the site: "+siteName+"?",
		function() {
			backupSite(siteGUID);
		}
	);
}

function backupSite(siteGUID){
	var inputParams = [];
	LockForService('Creating Backup...');
      
  var param1 = {"paramName":"SiteGUID", "paramType":"varchar", "paramValue":siteGUID}
  var param2 = {"paramName":"BackupName", "paramType":"varchar", "paramValue":"Backup-"+new Date()}
	var param3 = {"paramName":"BackupDescription", "paramType":"varchar", "paramValue": UserData[0].DisplayName}
  
  inputParams.push(param1);
	inputParams.push(param2);
	inputParams.push(param3);
  
  var inputParamsContainer         = {};
	inputParamsContainer.inputParams = inputParams;
  
	$.ajax({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "exec/procedure/dbo.BACKUP_TOT_SITE",
		type: "POST",
		data: JSON.stringify(inputParamsContainer),
		success: function(data){
			dataTest = data;
      
      ServiceComplete();
		},
		error: function(){
			
		}
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