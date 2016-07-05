/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			matchuptable_elements_jqxgrid_load.js
=============================================================*/

function getURLBeforeLoad() {
}

function LoadGrid(url) {

	$('#jqxgrid').jqxGrid('destroy');
	$('#jqxgrid2').jqxGrid('destroy');
	$("#jqxWidget").prepend('<div id="jqxgrid2"></div>');
	$("#jqxWidget").prepend('<div id="jqxgrid"></div>');
	
	setTimeout(function() {
		// prepare the data
		var source = {
			datatype: "json", 
			/*updaterow: function(rowid, rowdata, commit) {
				// synchronize with the server - send update command
				// call commit with parameter true if the synchronization with the server is successful
				// and with parameter false if the synchronization failed.
			
			}*/
			datafields: [
				{ name: 'MatchupTableElementGUID', display: 'MatchupTableElementGUID', type: 'string' },
				{ name: 'MatchupTableGUID', display: 'MatchupTableGUID', type: 'string' },
				{ name: 'SiteGUID', display: 'SiteGUID', type: 'string' },
				{ name: 'MatchupTableElementName', display: 'MatchupTableElementName', type: 'string' },
				{ name: 'Ordinal', display: 'Ordinal', type: 'int' },
				{ name: 'ElementControlType', display: 'ElementControlType', type: 'string' },
				{ name: 'ElementDataType', display: 'ElementDataType', type: 'string' },
				{ name: 'ControlVariable1', display: 'ControlVariable1', type: 'string' },
				{ name: 'ControlVariable2', display: 'ControlVariable2', type: 'string' },
				{ name: 'ControlVariable3', display: 'ControlVariable3', type: 'string' },
				{ name: 'ControlVariable4', display: 'ControlVariable4', type: 'string' },
				{ name: 'ControlVariable5', display: 'ControlVariable5', type: 'string' },
				{ name: 'ControlVariable6', display: 'ControlVariable6', type: 'string' },
				{ name: 'CreatedByGUID', display: 'CreatedByGUID', type: 'string' },
				{ name: 'Created', display: 'Created', type: 'string' },
				{ name: 'Modified', display: 'Modified', type: 'string' },
				{ name: 'Obsolete', display: 'Obsolete', type: 'string' },
				{ name: 'IsActive', display: 'IsActive', type: 'int' }
			],
			url: url
		};
		
		var dataAdapter = new $.jqx.dataAdapter(source);

		// Create jqxgrid
		$("#jqxgrid").jqxGrid({
			width: "100%",
			height: "400px",
			source: dataAdapter,
			theme: 'metro',
			showstatusbar: true,
			renderstatusbar: function (statusbar) {
				// appends buttons to the status bar.
				var container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>");
				statusbar.append(container);
			},
			columnsresize: true,
			columnsreorder: true,
			filterable: true,
			sortable: true,
			groupable: true,
			editable: true,
			enabletooltips: true,
			columns: [
				{ text: 'MatchupTableElementGUID', datafield: 'MatchupTableElementGUID', hidden: true },
				{ text: 'MatchupTableGUID', editable: false, datafield: 'MatchupTableGUID', hidden: true },
				{ text: 'SiteGUID', editable: false, datafield: 'SiteGUID', hidden: true },
				{ text: 'MatchupTableElementName', editable: false, datafield: 'MatchupTableElementName' },
				{ text: 'Ordinal', editable: false, datafield: 'Ordinal' },
				{ text: 'ElementControlType', editable: false, datafield: 'ElementControlType' },
				{ text: 'ElementDataType', editable: false, datafield: 'ElementDataType' },
				{ text: 'ControlVariable1', editable: false, datafield: 'ControlVariable1' },
				{ text: 'ControlVariable2', editable: false, datafield: 'ControlVariable2' },
				{ text: 'ControlVariable3', editable: false, datafield: 'ControlVariable3' },
				{ text: 'ControlVariable4', editable: false, datafield: 'ControlVariable4' },
				{ text: 'ControlVariable5', editable: false, datafield: 'ControlVariable5' },
				{ text: 'ControlVariable6', editable: false, datafield: 'ControlVariable6' },
				{ text: 'CreatedByGUID', editable: false, datafield: 'CreatedByGUID', hidden: true },
				{ text: 'Created', editable: false, datafield: 'Created', hidden: true },
				{ text: 'Modified', editable: false, datafield: 'Modified', hidden: true },
				{ text: 'Obsolete', editable: false, datafield: 'Obsolete', hidden: true },
				{ text: 'IsActive', editable: false, datafield: 'IsActive', hidden: true }
			],
		});
	},750);
	
	/*===================================================
					Listener Events
	====================================================*/
	

}