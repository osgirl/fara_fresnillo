/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/CONFIG/BEACONS/JS
	File Name:			script.js
=============================================================*/

$(document).ready(function() {
	$('ul.tabs').tabs();
	loadConfig('beacon_groups', 'BeaconGroupsInit()');
});

function loadConfig(screen, init_funct) {
	$('#content-load').load('../config/beacons/'+screen+'.html', function() {
		eval(init_funct);
	});
}

function LoadBottomSheet() {
	$("#modal-table .modal-header").html('Beacons');
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

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/Beacons", function( data ) {
		
		for(var key in data) {
			var formTypeObj		= {};
			formTypeObj.Name	= data[key].Name;
			formTypeObj.GroupUUID	= data[key].GroupUUID;
      formTypeObj.RValueDisplayName	= data[key].RValueDisplayName;
      formTypeObj.Major	= data[key].Major;
      formTypeObj.Minor	= data[key].Minor;
			formTypesArray.push(formTypeObj);
		}
	
		$("#modal-table .modal-subcontent").append($('<div id="jqxgrid"></div>'));
		
    var source = {
      localdata: formTypesArray,
      datatype: "array",
      datafields:
      [
        { name: 'GroupUUID',			type: 'string' },
        { name: 'Name',				type: 'string' },
        { name: 'RValueDisplayName',	type: 'string' },
        { name: "Major",				type: "string" },
        { name: "Minor",				type: "string" }
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
        { text: 'GroupUUID',		    datafield: 'GroupUUID',		hidden: false },
        { text: 'Name',			        datafield: 'Name',			hidden: false },
        { text: 'Assigned Value',   datafield: 'RValueDisplayName',	hidden: false },
        { text: 'Major',			      datafield: 'Major',			hidden: false },
        { text: 'Minor',			      datafield: 'Minor',			hidden: false }
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