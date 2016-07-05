/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/MENU/SITES_JS
	File Name:			get_sites_data.js
=============================================================*/

var dataObject				= {};
var importObject			= {};
var exportSiteObj			= {};
var exportTableArray		= [];
var exportingIndex			= 0;
var exportinglength			= 1;
var exportString			= '';
var bottomSheetDisplayed	= false;
var exportBtnString			= "Export Table";

function CheckForComparing() {
	(comparingSites) ? cancelComp(true) : ExportSite();
}

function ExportSite() {
	exportinglength = 0;
	exportBtnString = 'Export Site';
	$(".tableItem").each(function() {
		exportinglength++;
	});
	
	$(".tableItem").each(function() {
		var element = $(this);
		element.click();
	});
}

function ImportSite() {
	
	var importFormHTML = '';
	
	if(!bottomSheetDisplayed) {
		importFormHTML =	'<h5 class="center-align">Paste Base 64 Encoded JSON Data</h5>'+
							'<form action="'+ruIP + ruPort + listsDB + listEN +'/file/upload" class="col s12" method="post" enctype="multipart/form-data">'+
								'<div class="row">'+
									'<div class="input-field col s12">'+
										'<input onchange="UploadFile(this)" type="file" name="file">'+
									'</div>'+
									'<div class="input-field col s12">'+
										'<a onclick="UploadFile()" class="waves-effect waves-light btn blue darken-3"><i class="material-icons left">content_copy</i>Import Site</a>'+
									'</div>'+
								'</div>'+
							'</form>';
							  
		$("#modal-table .modal-subcontent").html(importFormHTML);
		$("#modal-table").css('height','85%');
		$("#modal-table .modal-header").css('text-align','center');
		$("#modal-table .modal-header").html('Import Site Data');
		
		DisplayBottomSheet();
	}
}

function CompareSitesValidation(table_name, canExportTable) {
	dataObject.site1_guid	= $("#select-from-site").val();
	dataObject.site2_guid	= $("#select-to-site").val();
	dataObject.site1_name	= $("#select-from-site option:selected").text();
	dataObject.site2_name	= $("#select-to-site option:selected").text();
	dataObject.tableName	= table_name;
	
	if(dataObject.site1_guid == "") {
		DisplayAlert(languagePack.message.alert,"You must select an initial site.");
	}
	else if(dataObject.site2_guid == "") {
		DisplayAlert(languagePack.message.alert,"You must select a site to compare to.");
	}
	else if(dataObject.tableName == "") {
		DisplayAlert(languagePack.message.alert,"You must select a table to compare.");
	}
	else {
		getBottomSheetData(canExportTable);
	}
}

function getBottomSheetData(canExportTable) {
	dataObject.site1_tableData = [];
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"SiteGUID = '"+ dataObject.site1_guid +"' AND MatchupTableName = '"+dataObject.tableName+"' And IsActive = '1' Order By MatchupTableName ASC\"", function( table1Data ) {
		dataObject.site1_tableData = table1Data;
		
		if(table1Data[0].TableGroup) {
			$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+ dataObject.site1_guid +"/SYS_TableGroups?where=\TableRecordGUID = '"+table1Data[0].TableGroup+"'\"", function( tableGroup1 ) {
				dataObject.tableGroup1 = tableGroup1[0];
				
				$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+ dataObject.site2_guid +"/SYS_TableGroups?where=\SYS_TableGroups = '"+dataObject.tableGroup1.SYS_TableGroups+"'\"", function( tableGroup2 ) {
					dataObject.tableGroup2 = tableGroup2[0];
					proceedWithDataGrab(canExportTable);
				});
			});
		}
		else {
			proceedWithDataGrab(canExportTable);			
		}
	});
}

function proceedWithDataGrab(canExportTable) {
	dataObject.site2_tableData		= [];
	dataObject.site1_tableSchema	= [];
	dataObject.site2_tableSchema	= [];
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"SiteGUID = '"+ dataObject.site2_guid +"' AND MatchupTableName = '"+dataObject.tableName+"' And IsActive = '1' Order By MatchupTableName ASC\"", function( table2Data ) {
		dataObject.site2_tableData = table2Data;
		
		$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"SiteGUID = '"+ dataObject.site1_guid +"' AND MatchupTableGUID = '"+dataObject.site1_tableData[0].MatchupTableGUID+"' Order By Ordinal ASC\"", function( table1Schema ) {
			dataObject.site1_tableSchema = table1Schema;
			
			if(table2Data.length > 0) {
				$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"SiteGUID = '"+ dataObject.site2_guid +"' AND MatchupTableGUID = '"+dataObject.site2_tableData[0].MatchupTableGUID+"' Order By Ordinal ASC\"", function( table2Schema ) {
					dataObject.site2_tableSchema = table2Schema;
					(canExportTable) ? ExportTable() : LoadBottomSheet(true);
				});
			}
			else {
				(canExportTable) ? ExportTable() : LoadBottomSheet(false);
			}
		});
	});
}

function LoadBottomSheet(tableExists) {
	var settingsHTML = '';
	if(tableExists) {
		settingsHTML =	'<h5 class="center-align">Merge Settings</h5>'+
						'<form class="col s12">'+
							'<p>'+
								'<input name="copyMergeSettings" type="radio" id="merge_schema" value="merge_schema" />'+
								'<label for="merge_schema">Merge Schema</label>'+
							'</p>'+
							'<p>'+
								'<input name="copyMergeSettings" type="radio" id="merge_schema_data" value="merge_schema_data" />'+
								'<label for="merge_schema_data">Merge Schema and Data</label>'+
							'</p>'+
						'</form>';
	}
	else {
		settingsHTML =	'<h5 class="center-align">Copy Settings</h5>'+
						'<form class="col s12">'+
							'<p>'+
								'<input name="copyMergeSettings" type="radio" id="copy_schema" value="copy_schema" />'+
								'<label for="copy_schema">Copy Schema</label>'+
							'</p>'+
							'<p>'+
								'<input name="copyMergeSettings" type="radio" id="copy_schema_data" value="copy_schema_data" />'+
								'<label for="copy_schema_data">Copy Schema and Data</label>'+
							'</p>'+
						'</form>';
	}
	
	var modalSubContentHTML = '';
	
	$("#modal-table").css('height','85%');
	$("#modal-table .modal-header").css('text-align','center');
	$("#modal-table .modal-header").html('Table Comparison');
	
	modalSubContentHTML	+= '<div class="row">'+
								'<div class="col s5">'+
									
									'<table style="font-size:1.3rem" class="hoverable white striped highlight bordered">'+
										'<thead>'+
											'<tr class="orange darken-1 white-text">'+
												'<th colspan="3" class="center">'+dataObject.site1_name+': '+dataObject.tableName+'</th>'+
											'</tr>'+
											'<tr>'+
												'<th>#</th>'+
												'<th>Column Name</th>'+
												'<th>Control Type</th>'+
											'</tr>'+
										'</thead>'+
										'<tbody>';
											
											for(var key in dataObject.site1_tableSchema) {
												modalSubContentHTML	+= '<tr><td>'+(parseInt(key) + 1)+'</td>';
												modalSubContentHTML	+= '<td>'+dataObject.site1_tableSchema[key].MatchupTableElementName+'</td>';
												modalSubContentHTML	+= '<td>'+dataObject.site1_tableSchema[key].ElementControlType+'</td></tr>';
											}
										modalSubContentHTML	+= '</tbody>'+
										'<tfoot>'+
											'<tr class="orange darken-1 white-text">'+
												'<td colspan="3"></td>'+
											'</tr>'+
										'</tfoot>'+
									'</table>'+
									
								'</div>'+
								'<div class="center col s2" style="margin-top:50px;">'+								
									'<div class="row">'+
										settingsHTML+
									'</div>'+
									'<a onclick="mergeCopyTable()" class="center waves-effect waves-light btn blue darken-2"><i style="font-size:2.5rem" class="material-icons center">arrow_forward</i></a>'+
								'</div>'+
								'<div class="col s5">'+
									
									'<table style="font-size:1.3rem" class="hoverable white striped highlight bordered">'+
										'<thead>'+
											'<tr class="orange darken-1 white-text">'+
												'<th colspan="3" class="center">'+dataObject.site2_name+': '+dataObject.tableName+'</th>'+
											'</tr>'+
											'<tr>';
											
											if(tableExists) {
												if(dataObject.site2_tableSchema.length > 0) {
													modalSubContentHTML	+= '<th>#</th>';
													modalSubContentHTML	+= '<th>Column Name</th>';
													modalSubContentHTML	+= '<th>Control Type</th>';
												}
											}
											else {
												modalSubContentHTML	+= '<th>'+dataObject.tableName+' does not exist.</th>';
											}
										modalSubContentHTML	+= '</thead>'+
										'<tbody>';
										
											if(tableExists) {
												if(dataObject.site2_tableSchema.length > 0) {
												
													for(var key in dataObject.site2_tableSchema) {
														modalSubContentHTML	+= '<tr><td>'+(parseInt(key) + 1)+'</td>';
														modalSubContentHTML	+= '<td>'+dataObject.site2_tableSchema[key].MatchupTableElementName+'</td>';
														modalSubContentHTML	+= '<td>'+dataObject.site2_tableSchema[key].ElementControlType+'</td></tr>';
													}
												}
												else {
													modalSubContentHTML	+= '<tr><td colspan="2">No columns exist for '+dataObject.tableName+'</td></tr>';
												}
											}
										modalSubContentHTML	+= '</tbody>'+
										'<tfoot>'+
											'<tr class="orange darken-1 white-text">'+
												'<td colspan="3"></td>'+
											'</tr>'+
										'</tfoot>'+
									'</table>'+
								'</div>'+			
							'</div>';
	
	$("#modal-table .modal-subcontent").html(modalSubContentHTML);
	$('#modal-table-close').html('Close');
	
	DisplayBottomSheet();
}

function mergeCopyTable() {
	var settingsValue = $("input:radio[name ='copyMergeSettings']:checked").val();
	$("#modal-table-close").click();
	
	switch(settingsValue) {
		case "merge_schema":
			mergeSchema(false);
		break;
		case "merge_schema_data":
			mergeSchema(true);
		break;
		case "copy_schema":
			copySchema(false);
		break;
		case "copy_schema_data":
			copySchema(true);
		break;
	}
}

function mergeSchema(merge_data) {
	var fields			= {};
	var elementArray	= [];
	
	for(var i in dataObject.site1_tableSchema) {
		var el_name_t1 = dataObject.site1_tableSchema[i].MatchupTableElementName;
		var elementExists = false;
		var elementObj = {};
		
		for(var k in dataObject.site2_tableSchema) {
			var el_name_t2 = dataObject.site2_tableSchema[k].MatchupTableElementName;
			
			(el_name_t1 == el_name_t2) ? elementExists = true : false;
		}
		
		if(!elementExists) {
			elementObj.MatchupTableElementGUID	= CreateGUID();
			elementObj.MatchupTableGUID			= dataObject.site2_tableData[0].MatchupTableGUID;
			elementObj.SiteGUID					= dataObject.site2_guid;
			elementObj.MatchupTableElementName	= dataObject.site1_tableSchema[i].MatchupTableElementName;
			elementObj.Ordinal					= dataObject.site1_tableSchema[i].Ordinal;
			elementObj.ElementControlType		= dataObject.site1_tableSchema[i].ElementControlType;
			elementObj.ElementDataType			= dataObject.site1_tableSchema[i].ElementDataType;
			elementObj.ControlVariable1			= dataObject.site1_tableSchema[i].ControlVariable1;
			elementObj.ControlVariable2			= dataObject.site1_tableSchema[i].ControlVariable2;
			elementObj.ControlVariable3			= dataObject.site1_tableSchema[i].ControlVariable3;
			elementObj.ControlVariable4			= dataObject.site1_tableSchema[i].ControlVariable4;
			elementObj.ControlVariable5			= dataObject.site1_tableSchema[i].ControlVariable5;
			elementObj.ControlVariable6			= dataObject.site1_tableSchema[i].ControlVariable6;
			elementObj.CreatedByGUID			= UserData[0].PersonGUID;
			elementObj.Created					= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			elementObj.Modified					= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
			elementObj.Obsolete					= moment().format("9999-12-31T00:00:00.000z");
			elementObj.IsActive					= true;
			
			elementArray.push(elementObj);
		}
	}
	
	if(elementArray.length > 0) {
		
	
		fields.fields = elementArray;
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "create/bulk/dbo/MatchupTableElements",
			type: "POST",
			data: JSON.stringify(fields),
			success: function(){
				(merge_data) ? mergeData() : DisplayAlert(languagePack.message.success,dataObject.site1_name +': '+ dataObject.tableName + ' schema and '+ dataObject.site2_name +': '+ dataObject.tableName + ' schema match!');
			},
			error: function(){
				DisplayAlert(languagePack.message.alert,dataObject.site2_name +': '+ dataObject.tableName + ' schema could not be updated.');
			}
		});
	 
	}
	else {
		(merge_data) ? mergeData() : DisplayAlert(languagePack.message.success,dataObject.site1_name +': '+ dataObject.tableName + ' schema and '+ dataObject.site2_name +': '+ dataObject.tableName + ' schema match!');
	}
}

function copySchema(merge_data) {

	if(!dataObject.tableGroup2) {
		var dataRowObj = {};
		var newTableRecordGuid = CreateGUID();
		
		dataRowObj["SYS_TableGroups"] = dataObject.tableGroup1.SYS_TableGroups;		
		
		var jsonData1 = {
			 "fields": dataRowObj
		};
		
		$.ajax ({
			headers: {
				"Content-Type": "application/json"
			},
			url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+dataObject.site2_guid+"/SYS_TableGroups",
			type: "POST",
			data: JSON.stringify(jsonData1),
			success: function(){
				
				$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+dataObject.site2_guid+"/SYS_TableGroups?where=\"SYS_TableGroups = '"+ dataObject.tableGroup1.SYS_TableGroups +"'\"", function( table2Group ) {
					console.log(table2Group);
					dataObject.tableGroup2 = table2Group[0];
					copySchema2(merge_data);
				});
			}
		});
	}
	else {
		copySchema2(merge_data);
	}
}

function copySchema2(merge_data) {
	
	var newTable = {};
	var tempObj = {};
	tempObj.MatchupTableGUID = CreateGUID();
	dataObject.site2_tableData.push(tempObj);

	newTable.MatchupTableGUID	= dataObject.site2_tableData[0].MatchupTableGUID;
	newTable.SiteGUID			= dataObject.site2_guid;
	newTable.MatchupTableName	= dataObject.site1_tableData[0].MatchupTableName;
	newTable.Description		= dataObject.site1_tableData[0].Description;
	newTable.TableGroup			= dataObject.tableGroup2.TableRecordGUID;
	newTable.IsList				= dataObject.site1_tableData[0].IsList;
	newTable.CreatedByGUID		= UserData[0].PersonGUID;
	newTable.Created			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	newTable.Modified			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	newTable.Obsolete			= moment().format("9999-12-31T00:00:00.000z");
	newTable.IsActive			= dataObject.site1_tableData[0].IsActive;
	newTable.IsLocked			= dataObject.site1_tableData[0].IsLocked;
	newTable.IsSystemTable		= dataObject.site1_tableData[0].IsSystemTable;
	newTable.IsReferenceTable	= dataObject.site1_tableData[0].IsReferenceTable;
	newTable.Icon				= dataObject.site1_tableData[0].Icon;
	newTable.AvoidSync			= dataObject.site1_tableData[0].AvoidSync;
	
	var jsonData2 = {
		 "fields": newTable
	};
	
	$.ajax ({
		headers: {
					"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/dbo/MatchupTables",
		type: "POST",
		data: JSON.stringify(jsonData2),
		success: function(){
			
			var fields			= {};
			var elementArray	= [];
			
			for(var i in dataObject.site1_tableSchema) {
				var el_name_t1 = dataObject.site1_tableSchema[i].MatchupTableElementName;
				var elementObj = {};

				elementObj.MatchupTableElementGUID	= CreateGUID();
				elementObj.MatchupTableGUID			= dataObject.site2_tableData[0].MatchupTableGUID;
				elementObj.SiteGUID					= dataObject.site2_guid;
				elementObj.MatchupTableElementName	= dataObject.site1_tableSchema[i].MatchupTableElementName;
				elementObj.Ordinal					= dataObject.site1_tableSchema[i].Ordinal;
				elementObj.ElementControlType		= dataObject.site1_tableSchema[i].ElementControlType;
				elementObj.ElementDataType			= dataObject.site1_tableSchema[i].ElementDataType;
				elementObj.ControlVariable1			= dataObject.site1_tableSchema[i].ControlVariable1;
				elementObj.ControlVariable2			= dataObject.site1_tableSchema[i].ControlVariable2;
				elementObj.ControlVariable3			= dataObject.site1_tableSchema[i].ControlVariable3;
				elementObj.ControlVariable4			= dataObject.site1_tableSchema[i].ControlVariable4;
				elementObj.ControlVariable5			= dataObject.site1_tableSchema[i].ControlVariable5;
				elementObj.ControlVariable6			= dataObject.site1_tableSchema[i].ControlVariable6;
				elementObj.CreatedByGUID			= UserData[0].PersonGUID;
				elementObj.Created					= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				elementObj.Modified					= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
				elementObj.Obsolete					= moment().format("9999-12-31T00:00:00.000z");
				elementObj.IsActive					= true;
				
				elementArray.push(elementObj);
			}
			
			if(elementArray.length > 0) {
				fields.fields = elementArray;
				
				$.ajax ({
					headers: {
						"Content-Type": "application/json"
					},
					url: ruIP + ruPort + listsDB + listEN + "create/bulk/dbo/MatchupTableElements",
					type: "POST",
					data: JSON.stringify(fields),
					success: function(){
						(merge_data) ? mergeData() : DisplayAlert(languagePack.message.success, dataObject.tableName + ' schema has been copied from  '+ dataObject.site1_name +' to'+ dataObject.site2_name +'.');
					},
					error: function(){
						DisplayAlert(languagePack.message.alert,dataObject.tableName + ' could not be copied from '+ dataObject.site1_name +' to'+ dataObject.site2_name +'.');
					}
				});
			}
		},
		error: function(){
			DisplayAlert(languagePack.message.alert,dataObject.tableName + ' could not be copied from '+ dataObject.site1_name +' to'+ dataObject.site2_name +'.');
		}
	});
}

function mergeData() {
	
	if(dataObject.site2_tableSchema.length <= 0) {
		$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"SiteGUID = '"+ dataObject.site2_guid +"' AND MatchupTableGUID = '"+dataObject.site2_tableData[0].MatchupTableGUID+"' Order By Ordinal ASC\"", function( table2Schema ) {
			dataObject.site2_tableSchema = table2Schema;
			GetTableRecords();
		});
	}
	else {
		GetTableRecords();
	}
}

function GetTableRecords() {
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableRecords?where=\"SiteGUID = '"+ dataObject.site1_guid +"' AND MatchupTableGUID = '"+dataObject.site1_tableData[0].MatchupTableGUID+"' And IsActive = '1' Order By RecordGroupGUID, MatchupTableElementGUID ASC\"", function( table1Records ) {
		if(dataObject.site2_tableData.length > 0) {
			$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableRecords?where=\"SiteGUID = '"+ dataObject.site2_guid +"' AND MatchupTableGUID = '"+dataObject.site2_tableData[0].MatchupTableGUID+"' And IsActive = '1' Order By RecordGroupGUID, MatchupTableElementGUID ASC\"", function( table2Records ) {
				compareTableRecords(table1Records, table2Records);
			});
		}
		else {
			compareTableRecords(table1Records);
		}
	});
}

function compareTableRecords(table1Records, table2Records) {
	var finalTableRecordArray		= [];
	var table1_recordObjectArray	= [];
	var table1_recordObject		 	= {};
	var table2_recordObjectArray	= [];
	var table2_recordObject		 	= {};
	var temp1RecordGroupGUID		= '';
	var temp2RecordGroupGUID		= '';
	var count1						= 1;
	var count2						= 1;
	
	for(var key in table1Records) {
		var elementName = 'Element_' + count1;
		
		for(var i in dataObject.site1_tableSchema) {
			if(table1Records[key].MatchupTableElementGUID == dataObject.site1_tableSchema[i].MatchupTableElementGUID) {
				elementName = dataObject.site1_tableSchema[i].MatchupTableElementName;
			}
		}
		
		if(temp1RecordGroupGUID == '' || table1Records[key].RecordGroupGUID == temp1RecordGroupGUID) {
			
			table1_recordObject[elementName] = table1Records[key].RecordValue;
			count1++;
		}
		else {
			var objString = JSON.parse(JSON.stringify(table1_recordObject));
			
			table1_recordObjectArray.push(objString);
			table1_recordObject = {};
			count1 = 1;
		
			table1_recordObject[elementName] = table1Records[key].RecordValue;
			count1++;
		}
		temp1RecordGroupGUID = table1Records[key].RecordGroupGUID;
		
		if(parseInt(key) >= table1Records.length - 1) {
			var objString = JSON.parse(JSON.stringify(table1_recordObject));			
			table1_recordObjectArray.push(objString);			
		}
	}
	
	for(var key in table2Records) {
		var elementName = 'Element_' + count2;
		
		for(var i in dataObject.site2_tableSchema) {
			if(table2Records[key].MatchupTableElementGUID == dataObject.site2_tableSchema[i].MatchupTableElementGUID) {
				elementName = dataObject.site2_tableSchema[i].MatchupTableElementName;
			}
		}
		
		if(temp2RecordGroupGUID == '' || table2Records[key].RecordGroupGUID == temp2RecordGroupGUID) {
			table2_recordObject[elementName] = table2Records[key].RecordValue;
			count2++;
		}
		else {
			var objString = JSON.parse(JSON.stringify(table2_recordObject));
			
			table2_recordObjectArray.push(objString);
			table2_recordObject = {};
			count2 = 1;
		
			table2_recordObject[elementName] = table2Records[key].RecordValue;
			count2++;
		}
		temp2RecordGroupGUID = table2Records[key].RecordGroupGUID;
		
		if(parseInt(key) >= table2Records.length - 1) {
			var objString = JSON.parse(JSON.stringify(table2_recordObject));			
			table2_recordObjectArray.push(objString);			
		}
	}
	
	if(table2Records) {
		for(var i in table1_recordObjectArray) {
			var recordGroupExists = false;
			
			for(var k in table2_recordObjectArray) {
				var exactMatch = true;
				for(var j in table2_recordObjectArray[k]) {
					(table2_recordObjectArray[k][j] != table1_recordObjectArray[i][j]) ? exactMatch = false : false;
				}
				
				(exactMatch) ? recordGroupExists = true : false;
			}
			
			(!recordGroupExists) ? finalTableRecordArray.push(table1_recordObjectArray[i]) : false;
		}
		InsertNewTableRecords(finalTableRecordArray);
	}
	else {
		InsertNewTableRecords(table1_recordObjectArray);
	}
}

function InsertNewTableRecords(records) {
	
	var RecordsArray	= [];
	var fields			= {};

	for(var i in records) {
		var recordObj		= {};
		var currentRecord	= records[i];

		recordObj.MatchupTableGUID			= dataObject.site2_tableData[0].MatchupTableGUID;
		recordObj.SiteGUID					= dataObject.site2_guid;
		recordObj.RecordGroupGUID			= CreateGUID();
		recordObj.RecordCreatedBy			= UserData[0].PersonGUID;
		recordObj.RecordLastModifiedBy		= UserData[0].PersonGUID;
		recordObj.Created					= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		recordObj.Modified					= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
		recordObj.Obsolete					= moment().format("9999-12-31T00:00:00.000z");
		recordObj.IsActive					= true;
		
		for(var k in currentRecord) {
 			recordObj.MatchupTableRecordGUID = CreateGUID();
			recordObj.MatchupTableElementGUID	= '';
			recordObj.RecordValue				= (currentRecord[k] && currentRecord != "null") ? currentRecord[k] : "";
			
			for(var j in dataObject.site2_tableSchema) {
				if(dataObject.site2_tableSchema[j].MatchupTableElementName == k) {
					recordObj.MatchupTableElementGUID = dataObject.site2_tableSchema[j].MatchupTableElementGUID;
				}
			}
			
			var newObj = {};
			
			newObj.MatchupTableGUID			= recordObj.MatchupTableGUID;
			newObj.SiteGUID					= recordObj.SiteGUID;
			newObj.RecordGroupGUID			= recordObj.RecordGroupGUID;
			newObj.RecordCreatedBy			= recordObj.RecordCreatedBy;
			newObj.RecordLastModifiedBy		= recordObj.RecordLastModifiedBy;
			newObj.Created					= recordObj.Created;
			newObj.Modified					= recordObj.Modified;
			newObj.Obsolete					= recordObj.Obsolete;
			newObj.IsActive					= recordObj.IsActive;
			newObj.MatchupTableRecordGUID	= recordObj.MatchupTableRecordGUID;
			newObj.MatchupTableElementGUID	= recordObj.MatchupTableElementGUID;
			newObj.RecordValue				= recordObj.RecordValue;
			
			RecordsArray.push(newObj);
		}
	}
	
	fields.fields = RecordsArray;
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/bulk/dbo/MatchupTableRecords",
		type: "POST",
		data: JSON.stringify(fields),
		success: function(){
			DisplayAlert(languagePack.message.success, dataObject.tableName + ' schema has been copied from  '+ dataObject.site1_name +' to'+ dataObject.site2_name +'.');
			ShowRecords();
		},
		error: function(){
			DisplayAlert(languagePack.message.alert,dataObject.tableName + ' could not be copied from '+ dataObject.site1_name +' to'+ dataObject.site2_name +'.');
		}
	});
}

function ExportTable(tableGUID) {
	
	if(!bottomSheetDisplayed) {
		exportSiteObj = {};
		exportSiteObj.siteGuid = $("#select-from-site").val();
		
		var exportFormHTML = '';
		
		exportFormHTML =	'<h5 class="center-align">Base 64 Encoded JSON Data</h5>'+
								'<form class="col s12">'+
								  '<div class="row">'+
									'<div class="input-field col s12">'+
									  '<textarea class="red-text" disabled="disabled" id="exportedData" value="" style="min-height:400px; max-width:100%"></textarea>'+
									'</div>'+
									'<div class="input-field col s12">'+
									  '<a onclick="ExportJsonFile()" class="waves-effect waves-light btn teal darken-3"><i class="material-icons left">content_copy</i>'+exportBtnString+'</a>'+
									'</div>'+
								  '</div>'+
								'</form>'+
							  '</div>';
							  
		$("#modal-table .modal-subcontent").html(exportFormHTML);
		$("#modal-table").css('height','85%');
		$("#modal-table .modal-header").css('text-align','center');
		$("#modal-table .modal-header").html($("#select-from-site option:selected").text() +' Export');
	}
	exportingIndex++;
	exportTableArray.push({"MatchupTableGUID":tableGUID});
	
	if(exportingIndex >= exportinglength) {
		exportSiteObj.TableData = exportTableArray;
		$("#exportedData").val(JSON.stringify(exportSiteObj));
		DisplayBottomSheet();
	}
}

function ExportJsonFile() {
	var fields = {};
	
	var filenamearr	= $("#select-from-site option:selected").text().split(" ");
	var filename	= '';
	
	for(var key in filenamearr) {
		filename += filenamearr[key] + '_';
	}
			
	fields.filename 	= filename + 'backup_' + moment().format('MMDDYYYY_hmm') + '.misom';
	fields.directory	= 'backups';
	fields.data 		= exportSiteObj;
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/virtual/backup",
		type: "POST",
		data: JSON.stringify(fields),
		success: function(file) {
			$("#modal-table-close").click();
			DisplayAlert("Success","File has been uploaded");

			window.location = '../backups/'+file;
		}
	});
}

function LoadImportedData() {
	var importedData = JSON.parse($("#importedData").val());
}

function showRecords(){
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "getstructure/virtual/"+ dataObject.site1_guid +"/"+ dataObject.tableName +"", function( tableStructureData ) {
		var loadURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + dataObject.site1_guid + "/" + dataObject.tableName;
		generateGridRecord(tableStructureData, loadURL, "from");
	});

	if(dataObject.site2_tableData.length > 0) {
		$.getJSON(ruIP + ruPort + listsDB + listEN + "getstructure/virtual/"+ dataObject.site2_guid +"/"+ dataObject.tableName +"", function( tableStructureData ) {
			var loadURL = ruIP + ruPort + listsDB + listEN + "read/virtual/" + dataObject.site2_guid + "/" + dataObject.tableName;
			generateGridRecord(tableStructureData, loadURL, "to");
		});
	}
	
}

function generateGridRecord(tableData, url, site) {
	var datafieldsColumnArray = [];
	
	for(var key in tableData) {
		var colType = "";
		var cellsAlign = "";
		var cellsFormat = "";

		datafieldsColumnArray.push({ name: tableData[key].MatchupTableElementName, display: tableData[key].MatchupTableElementName,
			type: tableData[key].ElementDataType, cellsalign: cellsAlign, cellsformat: cellsFormat, text: tableData[key].MatchupTableElementName,
			datafield: tableData[key].MatchupTableElementName, columntype: colType, hidden: false, editable: false
		});
	}
	
	(datafieldsColumnArray[1].datafield) ? createTable(datafieldsColumnArray, tableData, url, site) : createTable([datafieldsColumnArray[0]], tableData, url, site);
}

function createTable(dataFieldsC, tableData, url, site){
	if(site == "from"){
		//$('#from-grid').jqxGrid('destroy');
		
		$("#from-site-col").html(
			'<div class="orange darken-1 white-text center-align" style="padding: 15px; font-weight: 600; font-size: 19px">'+dataObject.site1_name+': '+dataObject.tableName+'</div>'+
			'<div id="from-grid"></div>'+
			'<div class="orange darken-1" style="padding: 15px"></div>'
		);
	}
	else{
		//$('#to-grid').jqxGrid('destroy');
		$("#to-site-col").html(
			'<div class="orange darken-1 white-text center-align" style="padding: 15px; font-weight: 600; font-size: 19px">'+dataObject.site2_name+': '+dataObject.tableName+'</div>'+
			'<div id="to-grid"></div>'+
			'<div class="orange darken-1" style="padding: 15px"></div>'
		);
	}
	
	// prepare the data
	var source = {
		datatype: "json",
		datafields: dataFieldsC,
		url: url
	};
	
	var dataAdapter = new $.jqx.dataAdapter(source);
	
	// Create jqxgrid2
	$("#"+site+"-grid").jqxGrid({
		width: "100%",
		height: "550px",
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
		columns: dataFieldsC,
	});
}

function DisplayBottomSheet() {
	bottomSheetDisplayed = true;
	
	$("#modal-table").openModal({
		dismissible:	true,
		height:			600,
		ready:			function() { ServiceComplete(); },
		complete:		function() { bottomSheetDisplayed = false; exportinglength = 1; exportingIndex = 0; exportBtnString = 'Export Table'; exportTableArray = [];}
	});
}




