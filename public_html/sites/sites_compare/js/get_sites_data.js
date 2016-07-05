/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/MENU/SITES_JS
	File Name:			get_sites_data.js
=============================================================*/

var FromTablesArray			= [];
var FromTablesGUID			= [];
var FromElements			= [];
var SitesArray				= [];
var ToTablesArray			= [];
var ToTablesGUID			= [];
var ToElements				= [];
var ToElementNames			= [];
var ExistingTables2			= [];
var ExistingTables2Bckup	= [];
var comparingSites			= false;

LoadSitesFrom();

function LoadSitesFrom(){
	EmailsArray		= [];
	SitesArray		= [];

		$.getJSON(ruIP + ruPort + listsDB + listEN + "read/org/Sites?where=\"IsActive = '1' ORDER BY DisplayName ASC\"", function( sitesData ) {
			SitesArray = sitesData;
			
			var select = $('#select-from-site').empty();
			var select2 = $('#select-to-site').empty();
		
			select.append('<option value="'+null+'" disabled selected>Choose a Site</option>');
			select2.append('<option value="'+null+'" disabled selected>Choose a Site</option>');
			
			for(var key in SitesArray) {
				select.append( '<option value="'
													+ SitesArray[key].SiteGUID
													+ '">'
													+ SitesArray[key].SiteName
													+ '</option>' ); 
				select2.append( '<option value="'
													+ SitesArray[key].SiteGUID
													+ '">'
													+ SitesArray[key].SiteName
													+ '</option>' ); 
			}
			$('#select-from-site').val(UserData[0].SiteGUID);
			
			$('#select-from-site').material_select();
			$('#select-to-site').material_select();
			
			LoadTableListCollection('from');
			getTableElements($("#select-from-site :selected").val(), 'from');
		});
}

$("#select-from-site").change(function() {
	LoadTableListCollection('from');
	getTableElements($("#select-from-site :selected").val(), 'from');
});
$("#select-to-site").change(function() {
	LoadTableListCollection('to');
	getTableElements($("#select-to-site :selected").val(), 'to');
});

function getTableElements(siteguid, side){
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"SiteGUID = '"+ siteguid +"' AND IsActive = '1' \"", function(tdata){
		
		for(var key in tdata){
			if(side == 'from'){
				FromElements.push({Name: tdata[key].MatchupTableElementName, MatchupTableGUID: tdata[key].MatchupTableGUID});
			} else if(side == 'to'){
				ToElements.push({Name: tdata[key].MatchupTableElementName, MatchupTableGUID: tdata[key].MatchupTableGUID});
				ToElementNames.push(tdata[key].MatchupTableElementName);
			}
		}
	});
}

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

function LoadTableListCollection(dir, canExport){
	if(dir == "to"){ ToTablesArray = []; ToTablesGUID = []; } else if(dir == "from"){ FromTablesArray = []; FromTablesGUID = []; }
	
	var tabnum = 1;
	var listnum = 1;
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"SiteGUID = '"+ $("#select-"+dir+"-site :selected").val() +"' AND IsActive = '1' ORDER BY MatchupTableName ASC\"", function( tablesData ) {
		
		var select = $("#"+dir+"site-collection").html("");
		$('#'+dir+'site-collection').append('<li class="collection-header"><h5 class="list-title blue darken-3">Matchup Tables</h5></li><div id="'+dir+'-tablelist" style="margin-top: -10px;"></div>');
		$('#'+dir+'site-collection').append('<li class="collection-header"><h5 class="list-title blue darken-3">Lists</h5></li><div id="'+dir+'-listlist" style="margin-top: -10px;"></div>');
		
		for(var key in tablesData) {
			var expbtn;
			if(dir == "to"){
				listname = tablesData[key].MatchupTableName;
				ToTablesArray.push( tablesData[key].MatchupTableName );
				ToTablesGUID.push( { guid: tablesData[key].MatchupTableGUID, islist: tablesData[key].IsList, name: tablesData[key].MatchupTableName } );
				expbtn = '';
			} else {
				listname = '<a href="#!" onclick="CompareSitesValidation(\''+tablesData[key].MatchupTableName+'\')">'+tablesData[key].MatchupTableName + '</a>';
				FromTablesArray.push( tablesData[key].MatchupTableName );
				FromTablesGUID.push( { guid: tablesData[key].MatchupTableGUID, islist: tablesData[key].IsList, name: tablesData[key].MatchupTableName } );
				expbtn = '<a href="#!" class="tableItem secondary-content teal-text text-darken-2" onclick="ExportTable(\''+tablesData[key].MatchupTableGUID+'\')"><i class="material-icons">content_copy</i></a>';
			}
			
			if(tablesData[key].IsList == 0){
				var classbg;
				if(tabnum % 2 != 0){
					classbg = "bg-oddcolor";
				} else { classbg = ""; }
				
				$('#'+dir+'-tablelist').append
				(
					'<li class="collection-item '+classbg+'" id="'+tablesData[key].MatchupTableGUID+'">'
					+'<div>'
					+'<div class="num-circle white-text blue darken-2">'+tabnum +"</div> " + listname
					+expbtn
					+'</div></li>'
				)
				tabnum += 1;
			}
			else{
				var classbg;
				if(listnum % 2 != 0){
					classbg = "bg-oddcolor";
				} else { classbg = ""; }
				
				$('#'+dir+'-listlist').append
				(
					'<li class="collection-item '+classbg+'" id="'+tablesData[key].MatchupTableGUID+'">'
					+'<div>'
					+'<div class="num-circle white-text blue darken-2">'+listnum +"</div> " + listname
					+expbtn
					+'</div></li>'
				)
				listnum += 1;
			}
			
		}
		
		//Add search functionality
		//$('#'+dir+'site_search').hideseek({nodata: 'No tables/lists found'});
		
		$('.collapsible').collapsible({
			accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		});
		
		(canExport) ? ExportSite() : false;
	});
}

function LoadSitesCollection() {
	
	var siteList = $("#site-collection").html("");

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
		+ '<a href="#!" onclick="DeleteSite(\''+SitesArray[site].SiteGUID+'\')" class="secondary-content"><i class="material-icons">delete</i></a></div>'
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

function compareSites(){
	comparingSites = true;
	
	if(FromTablesArray.length == 0 || ToTablesArray.length == 0){
		Materialize.toast("You need to select both sites to compare", 4000);
	}
	else{
		var tabnum = 1; var listnum = 1;
		
		$('#comp-btns').html(
			'<a class="waves-effect waves-light btn blue darken-3 disabled"><i class="material-icons left">compare_arrows</i>Compare</a> '+
			'<a class="waves-effect waves-light btn grey darken-3" onclick="cancelComp();"><i class="material-icons left">cancel</i>Cancel</a>'
		)
		
		LockForService("Loading...");
		
		for(var key in FromTablesArray){
			$('#'+FromTablesGUID[key].guid).html('');
			
			if($.inArray(FromTablesArray[key], ToTablesArray) !== -1){
				for(var key2 in ToTablesGUID){
					if(FromTablesArray[key] == ToTablesGUID[key2].name){
						
						var fromElementsVar = $.grep(FromElements, function(e){ return e.MatchupTableGUID == FromTablesGUID[key].guid; });
						var toElementsVar = $.grep(ToElements, function(e){ return e.MatchupTableGUID == ToTablesGUID[key2].guid; });
						
						var flag = true;
						for(var key3 in fromElementsVar){
							if($.inArray(fromElementsVar[key3]["Name"], ToElementNames) === -1){
								if(flag != false){
									flag = false;
								
									if(FromTablesGUID[key].islist == 0){
										$('#'+FromTablesGUID[key].guid).html(
											'<div>'
											+'<div class="num-circle white-text purple darken-2">'+tabnum +'</div> '
											+'<a href="#!" onclick="CompareSitesValidation(\''+FromTablesArray[key]+'\')">'+FromTablesArray[key] + '</a>'
											+'<a href="#!" class="secondary-content tooltipped purple-text text-darken-2" data-position="top" data-delay="50" data-tooltip="Different Schema"><i class="material-icons">priority_high</i></a>'
											+'</div>'
										);
										
										(tabnum%2 == 0) ? $('#'+FromTablesGUID[key].guid).removeClass("bg-oddcolor") : $('#'+FromTablesGUID[key].guid).addClass("bg-oddcolor");
										tabnum += 1;
									}
									else{
										$('#'+FromTablesGUID[key].guid).html(
											'<div>'
											+'<div class="num-circle white-text purple darken-2">'+listnum +"</div> "
											+'<a href="#!" onclick="CompareSitesValidation(\''+FromTablesArray[key]+'\')">'+FromTablesArray[key] + '</a>'
											+'<a href="#!" class="secondary-content tooltipped purple-text text-darken-2" data-position="top" data-delay="50" data-tooltip="Different Schema"><i class="material-icons">priority_high</i></a>'
											+'</div>'
										);
										
										(listnum%2 == 0) ? $('#'+FromTablesGUID[key].guid).removeClass("bg-oddcolor") : $('#'+FromTablesGUID[key].guid).addClass("bg-oddcolor");
										listnum += 1;
									}
								}
								
							}
						}
						
						if(flag === true){
							$('#'+FromTablesGUID[key].guid).remove();
							/*
							if(FromTablesGUID[key].islist == 0){
								$('#'+FromTablesGUID[key].guid).html(
									'<div>'
									+'<div class="num-circle white-text green darken-2">'+tabnum +"</div> "
									+'<a href="#!" onclick="CompareSitesValidation(\''+FromTablesArray[key]+'\')">'+FromTablesArray[key] + '</a>'
									+'</div>'
								)
								tabnum += 1;
							}
							else{
								$('#'+FromTablesGUID[key].guid).html(
									'<div>'
									+'<div class="num-circle white-text green darken-2">'+listnum +"</div> "
									+'<a href="#!" onclick="CompareSitesValidation(\''+FromTablesArray[key]+'\')">'+FromTablesArray[key] + '</a>'
									+'</div>'
								)
								listnum += 1;
							}*/
						}
								
					}
				}
				
			}
			else{
				if(FromTablesGUID[key].islist == 0){
					$('#'+FromTablesGUID[key].guid).html(
						'<div>'
						+'<div class="num-circle white-text red darken-2">'+tabnum +"</div> "
						+'<a href="#!" onclick="CompareSitesValidation(\''+FromTablesArray[key]+'\')">'+FromTablesArray[key] + '</a>'
						+'<a href="#!" class="secondary-content tooltipped red-text text-darken-2" data-position="top" data-delay="50" data-tooltip="Table not found"><i class="material-icons">priority_high</i></a>'
						+'</div>'
					);
					(tabnum%2 == 0) ? $('#'+FromTablesGUID[key].guid).removeClass("bg-oddcolor") : $('#'+FromTablesGUID[key].guid).addClass("bg-oddcolor");
					tabnum += 1;
				}
				else{
					$('#'+FromTablesGUID[key].guid).html(
						'<div>'
						+'<div class="num-circle white-text red darken-2">'+listnum +"</div> "
						+'<a href="#!" onclick="CompareSitesValidation(\''+FromTablesArray[key]+'\')">'+FromTablesArray[key] + '</a>'
						+'<a href="#!" class="secondary-content tooltipped red-text text-darken-2" data-position="top" data-delay="50" data-tooltip="Table not found"><i class="material-icons">priority_high</i></a>'
						+'</div>'
					);
					
					(listnum%2 == 0) ? $('#'+FromTablesGUID[key].guid).removeClass("bg-oddcolor") : $('#'+FromTablesGUID[key].guid).addClass("bg-oddcolor");
					listnum += 1;
				}
			}
		
		}
		
		$('.tooltipped').tooltip({delay: 50});
		
		ServiceComplete();
	}
}

function cancelComp(canExport){
	comparingSites = false;
	
	$('#comp-btns').html(
		'<a onclick="compareSites()" class="waves-effect waves-light btn blue darken-3"><i class="material-icons left">compare_arrows</i>Compare</a>'
	)
	
	LoadTableListCollection('from', canExport);
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


function DisplayBottomSheet() {
	bottomSheetDisplayed = true;
	
	$("#modal-table").openModal({
		dismissible:	true,
		height:			600,
		ready:			function() { ServiceComplete(); },
		complete:		function() { bottomSheetDisplayed = false; }
	});
}