/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/DBA/JS
	File Name:			matchuptable_records_jqxgrid_load.js
=============================================================*/

var RecordGUID = "";


function GetTableStructure(isRef) {
	var CurrentTableName = $("#matchup_table_tree").jqxTree('getSelectedItem').label;
	$.getJSON(ruIP + ruPort + listsDB + listEN + "getstructure/virtual/"+ UserData[0].SiteGUID +"/"+ CurrentTableName +"", function( tableStructureData ) {
		var loadURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/" + CurrentTableName;
		PrepareColumnsForGrid(tableStructureData, loadURL, isRef);
	});
}

function PrepareColumnsForGrid(tableStructure, url, isRef) {
	
	var datafieldsColumnArray = [];
	
	if(!isRef) {
		datafieldsColumnArray.push({ name: 'TableRecordGUID', display: 'TableRecordGUID', type: 'string', text: 'TableRecordGUID', datafield: 'TableRecordGUID', hidden: true, editable: false });	

		for(var key in tableStructure) {
			var colType = "";
			var cellsAlign = "";
			var cellsFormat = "";
			
			if(tableStructure[key].ElementControlType == "ddl") {
				colType = 'dropdownlist';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "table") {
				colType = 'dropdownlist';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "ref") {
				colType = 'dropdownlist';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "textarea") {
				colType = 'text';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "guid") {
				colType = 'text';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "textfield") {
				colType = 'text';
				cellsFormat = '';
				cellsAlign = 'left';
			}
			if(tableStructure[key].ElementControlType == "checkbox") {
				colType = 'checkbox';
				cellsAlign = 'center';
			}
			if(tableStructure[key].ElementControlType == "date") {
				colType = 'datetimeinput';
				cellsAlign = 'right';
				cellsFormat = 'MM/dd/yyyy';
			}
			if(tableStructure[key].ElementControlType == "datetime") {
				colType = 'datetimeinput';
				cellsAlign = 'right';
				cellsFormat = 'MM/dd/yyyy hh:mm';
			}

			datafieldsColumnArray.push({ name: tableStructure[key].MatchupTableElementName, display: tableStructure[key].MatchupTableElementName,
				type: tableStructure[key].ElementDataType, cellsalign: cellsAlign, cellsformat: cellsFormat, text: tableStructure[key].MatchupTableElementName,
				datafield: tableStructure[key].MatchupTableElementName, columntype: colType, hidden: false, editable: false,
				cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
					if (newvalue == "") return oldvalue;
				}
			});
		}
	}
	else {
		for(var prop in tableStructure) {
			datafieldsColumnArray.push({ name: tableStructure[prop], display: tableStructure[prop], type: 'string', text: tableStructure[prop], datafield: tableStructure[prop], hidden: false, editable: false });	
		}
	}
	
	(datafieldsColumnArray[1].datafield) ? LoadRecordsGrid(datafieldsColumnArray, tableStructure, url) : LoadRecordsGrid([datafieldsColumnArray[0]], tableStructure, url);
}

function LoadRecordsGrid(datafieldsArray, tableStructure, url) {
	$('#jqxgrid').jqxGrid('destroy');
	$('#jqxgrid2').jqxGrid('destroy');
	$("#jqxWidget").prepend('<div id="jqxgrid2"></div>');
	$("#jqxWidget").prepend('<div id="jqxgrid"></div>');

	// prepare the data
	var source = {
		datatype: "json",
		datafields: datafieldsArray,
		url: url
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);

	// Create jqxgrid2
	$("#jqxgrid2").jqxGrid({
		width: "100%",
		height: "400px",
		source: dataAdapter,
		editmode: 'dblclick',
		showstatusbar: true,
		theme: 'metro',
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
		columns: datafieldsArray,
	});

	
	
	
	/*===================================================
					Listener Events
	====================================================*/
	
	
	$('#jqxgrid2').on('rowselect', function (event) {
		// event arguments.
		var args = event.args;
		// row's bound index.
		var rowBoundIndex = args.rowindex;
		// row's data. The row's data object or null(when all rows are being selected or unselected with a single action). If you have a datafield called "firstName", to access the row's firstName, use var firstName = rowData.firstName;
		var rowData = args.row;
		console.log(rowData);
		
		RecordGUID = rowData.TableRecordGUID;
		
		$("#table_record_remove_button").removeClass("disabled");
		for(var key in tableStructure) {
			var elementControl = tableStructure[key].ElementControlType;
			var elementName = tableStructure[key].MatchupTableElementName;
			LoadFormInputByType(elementControl, rowData[elementName], elementName);
		}
	});
}

function LoadFormInputByType(elementControl, value, elementName) {
	var element = $("#" + elementName);

	if(elementControl == 'textfield' || elementControl == 'textarea' || elementControl == 'date' || elementControl == 'guid') {
		
		element.val(value);
		element.next().addClass("active");
	}
	else if(elementControl == 'ddl') {
		if(value == null || value == "" || value == "null" || $("#" + elementName + " option:contains('"+value+"')").length <= 0) {
			$("#" + elementName).val("-- Choose --");
		}
		else {
			var realVal = $("#" + elementName + " option:contains('"+value+"')").val();
			$("#" + elementName).val(realVal);
		}
	}
	else if(elementControl == 'table' || elementControl == 'ref') {
		var ddButton = "#" + elementName + "ddbutton";
		
		var dropDownContent = (value) ? '<div style="position: relative; margin-left: 3px; margin-top: 5px;">'+value+'</div>' : '<div style="position: relative; margin-left: 3px; margin-top: 5px;"></div>';
        $(ddButton).jqxDropDownButton('setContent', dropDownContent);
	}
	else if(elementControl == 'ref2') {
		if(value == null || value == "" || value == "null" || $("#" + elementName + " option:contains('"+value+"')").length <= 0) {
			$("#" + elementName).val("-- Choose --");
		}
		else {
			var realVal = $("#" + elementName + " option:contains('"+value+"')").val();
			$("#" + elementName).val(realVal);
		}
	}
	else if(elementControl == 'checkbox' || elementControl == 'switch') {
		element.prop('checked', (value == 1));
	}
	else if(elementControl == 'datetime') {
		element.val(value);
	}
	else if(elementControl == 'date') {
	}
	else if(elementControl == 'auto') {
		element.val(value);		
	}
}