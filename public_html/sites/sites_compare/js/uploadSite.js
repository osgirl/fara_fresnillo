/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/SITES/SITES_COMPARE/JS
	File Name:			uploadSite.js
=============================================================*/

var importTableCount	= 0;
var importTableLength	= 0;
var currTbl				= {};

function UploadFile(element) {
	
	var fileName	= element.files[0].name;
	
	var fileData = new FormData();
	fileData.append('file',element.files[0]);

  	$.ajax ({
		url: ruIP + ruPort + listsDB + listEN + "file/upload",
		type: "POST",
		data: fileData,
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		beforeSend: function() {
		},
		success: function(data) {
			importObject = JSON.parse(data);
			
			ImportSiteSequence();
		}
	});
}

function ImportSiteSequence() {
	var options = 0;
	
	for(var key in SitesArray) {
		if(SitesArray[key].SiteName == importObject.siteData[0].SiteName) {
			options++;
			dataObject.site2_guid = SitesArray[key].SiteGUID;
			dataObject.site2_name = SitesArray[key].SiteName;
		}
	}
	
	importTableLength = importObject.tables.length;
	
	if(options >= 1) {
		ImportTableMerge();
	}
	else {
		dataObject.site2_guid = CreateGUID();
		dataObject.site2_name = importObject.siteData[0].SiteName;
		createSite(dataObject.site2_guid, dataObject.site2_name, importObject.person[0].Firstname, importObject.person[0].LastName, importObject.person[0].Email);
	}
}

function ImportTableMerge() {
	if(importTableCount <= (importTableLength - 1)) {
		currTbl.struct		= importObject.tables[importTableCount].structure[0];
		currTbl.schema		= importObject.tables[importTableCount].schema;
		currTbl.records		= importObject.tables[importTableCount].records;
		currTbl.tableGroup	= importObject.tables[importTableCount].tableGroup;

		$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTables?where=\"SiteGUID = '"+ dataObject.site2_guid +"' AND MatchupTableName = '"+currTbl.struct.MatchupTableName+"' And IsActive = '1' Order By MatchupTableName ASC\"", function( table2Data ) {
			dataObject.site2_tableData = table2Data;
				
			if(table2Data.length > 0) {
				$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"SiteGUID = '"+ dataObject.site2_guid +"' AND MatchupTableGUID = '"+dataObject.site2_tableData[0].MatchupTableGUID+"' Order By Ordinal ASC\"", function( table2Schema ) {
					dataObject.site2_tableSchema = table2Schema;
					ImportSchemaMerge();
				});
			}
			else {
				ImportTableGroupCheck();
			}
		});
	}
	else {
		console.log("DONE...");
	}
}

function ImportSchemaMerge() {
	var fields			= {};
	var elementArray	= [];
	
	for(var i in currTbl.schema) {
		var el_name_t1 = currTbl.schema[i].MatchupTableElementName;
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
			elementObj.MatchupTableElementName	= currTbl.schema[i].MatchupTableElementName;
			elementObj.Ordinal					= currTbl.schema[i].Ordinal;
			elementObj.ElementControlType		= currTbl.schema[i].ElementControlType;
			elementObj.ElementDataType			= currTbl.schema[i].ElementDataType;
			elementObj.ControlVariable1			= currTbl.schema[i].ControlVariable1;
			elementObj.ControlVariable2			= currTbl.schema[i].ControlVariable2;
			elementObj.ControlVariable3			= currTbl.schema[i].ControlVariable3;
			elementObj.ControlVariable4			= currTbl.schema[i].ControlVariable4;
			elementObj.ControlVariable5			= currTbl.schema[i].ControlVariable5;
			elementObj.ControlVariable6			= currTbl.schema[i].ControlVariable6;
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
				mergeImportedRecords();
			},
			error: function() {
				importTableCount++;
				ImportTableMerge();
			}
		});
	 
	}
	else {
		mergeImportedRecords();
	}
}

function ImportTableGroupCheck() {
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+ dataObject.site2_guid +"/SYS_TableGroups?where=\SYS_TableGroups = '"+currTbl.tableGroup.SYS_TableGroups+"'\"", function( tableGroup2 ) {
		dataObject.tableGroup2 = tableGroup2[0];

		if(!dataObject.tableGroup2 && currTbl.tableGroup.SYS_TableGroups != "") {
			var dataRowObj = {};
			var newTableRecordGuid = CreateGUID();
			
			dataRowObj["SYS_TableGroups"] = currTbl.tableGroup.SYS_TableGroups;		
			
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
					
					$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+dataObject.site2_guid+"/SYS_TableGroups?where=\"SYS_TableGroups = '"+ currTbl.tableGroup.SYS_TableGroups +"'\"", function( table2Group ) {
						dataObject.tableGroup2 = table2Group[0];
						ImportStructureCopy();
					});
				}
			});
		}
		else {
			ImportStructureCopy();
		}
	});
}

function ImportStructureCopy() {
	var newTable = {};
	var tempObj = {};
	tempObj.MatchupTableGUID = CreateGUID();
	dataObject.site2_tableData.push(tempObj);

	newTable.MatchupTableGUID	= dataObject.site2_tableData[0].MatchupTableGUID;
	newTable.SiteGUID			= dataObject.site2_guid;
	newTable.MatchupTableName	= currTbl.struct.MatchupTableName;
	newTable.Description		= currTbl.struct.Description;
	newTable.TableGroup			= dataObject.tableGroup2.TableRecordGUID;
	newTable.IsList				= currTbl.struct.IsList;
	newTable.CreatedByGUID		= UserData[0].PersonGUID;
	newTable.Created			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	newTable.Modified			= moment().format("YYYY-MM-DDTHH:mm:ss.000z");
	newTable.Obsolete			= moment().format("9999-12-31T00:00:00.000z");
	newTable.IsActive			= currTbl.struct.IsActive;
	newTable.IsLocked			= currTbl.struct.IsLocked;
	newTable.IsSystemTable		= currTbl.struct.IsSystemTable;
	newTable.IsReferenceTable	= currTbl.struct.IsReferenceTable;
	newTable.Icon				= currTbl.struct.Icon;
	newTable.AvoidSync			= currTbl.struct.AvoidSync;
	
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
			ImportSchemaCopy();
		},
		error: function() {
			importTableCount++;
			ImportTableMerge();
		}
	});
}

function ImportSchemaCopy() {
			
	var fields			= {};
	var elementArray	= [];
	
	for(var i in currTbl.schema) {
		var el_name_t1 = currTbl.schema[i].MatchupTableElementName;
		var elementObj = {};

		elementObj.MatchupTableElementGUID	= CreateGUID();
		elementObj.MatchupTableGUID			= dataObject.site2_tableData[0].MatchupTableGUID;
		elementObj.SiteGUID					= dataObject.site2_guid;
		elementObj.MatchupTableElementName	= currTbl.schema[i].MatchupTableElementName;
		elementObj.Ordinal					= currTbl.schema[i].Ordinal;
		elementObj.ElementControlType		= currTbl.schema[i].ElementControlType;
		elementObj.ElementDataType			= currTbl.schema[i].ElementDataType;
		elementObj.ControlVariable1			= currTbl.schema[i].ControlVariable1;
		elementObj.ControlVariable2			= currTbl.schema[i].ControlVariable2;
		elementObj.ControlVariable3			= currTbl.schema[i].ControlVariable3;
		elementObj.ControlVariable4			= currTbl.schema[i].ControlVariable4;
		elementObj.ControlVariable5			= currTbl.schema[i].ControlVariable5;
		elementObj.ControlVariable6			= currTbl.schema[i].ControlVariable6;
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
				mergeImportedRecords();
			},
			error: function() {
				importTableCount++;
				ImportTableMerge();
			}
		});
	}
}

function mergeImportedRecords() {
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableElements?where=\"SiteGUID = '"+ dataObject.site2_guid +"' AND MatchupTableGUID = '"+dataObject.site2_tableData[0].MatchupTableGUID+"' Order By Ordinal ASC\"", function( table2Schema ) {
		dataObject.site2_tableSchema = table2Schema;
		GetImportedTableRecords();
	});
}

function GetImportedTableRecords() {
	
	if(dataObject.site2_tableData.length > 0) {
		$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/MatchupTableRecords?where=\"SiteGUID = '"+ dataObject.site2_guid +"' AND MatchupTableGUID = '"+dataObject.site2_tableData[0].MatchupTableGUID+"' And IsActive = '1' Order By RecordGroupGUID, MatchupTableElementGUID ASC\"", function( table2Records ) {
			compareImportedTableRecords(currTbl.records, table2Records);
		});
	}
	else {
		compareImportedTableRecords(currTbl.records);
	}
}

function compareImportedTableRecords(table1Records, table2Records) {
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
		
		for(var i in currTbl.schema) {
			if(table1Records[key].MatchupTableElementGUID == currTbl.schema[i].MatchupTableElementGUID) {
				elementName = currTbl.schema[i].MatchupTableElementName;
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
		InsertImportedTableRecords(finalTableRecordArray);
	}
	else {
		InsertImportedTableRecords(table1_recordObjectArray);
	}
}

function InsertImportedTableRecords(records) {
	
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
			importTableCount++;
			ImportTableMerge();
		},
		error: function(){
			importTableCount++;
			ImportTableMerge();
		}
	});
}













