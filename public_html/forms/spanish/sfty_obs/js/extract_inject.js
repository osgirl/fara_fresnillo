var startersKept   = [];

//*------------------------------------------     CONFIGURATION SETTINGS     -------------------------------------------------*/
//*===========================================================================================================================*/

/* Dynamic Table Configuration Settings */
//Required even if not using dynamic tables. Supports up to two custom tables. More can be configured if necessary, but would need to change the code. Not difficult.
var rowIndex      = 0;
var rowIndex2     = 0;
//Startkey defines the ID of the table data. Cannot use underscores in the name.
var dynamicTables = [{"startkey":"NOTHING", "endkey":"NOTHING", "rowvar":1, "fcn":"#NOTHING"}, {"startkey":"NOTHING", "endkey":"NOTHING", "rowvar":2, "fcn":"#add_row_btn2"}];

//Table configurations
var tableConfig   = {"tableSchema":"fara","tableName":"SafetyObserv"};

//Server Configurations
var rootURL       = "http://192.168.1.100:8889";

//This is to grab any data we need. 
function extractData() {
	
	startersKept = [];
	
	//This is going to extract all of our data (also known as the Extractor)
	var extractedValues = [];
	var avoidRadio = false;
	
	//Go through all inputs
	$('input').each(function() {
	
		//Here all we need is a column name (which will be the name attribute) and a value stored in a new object
		//This will return to us everything we need to keep the data.
		
		var extractObject = {};
		
		if($(this).attr("type") == "checkbox")
		{
			var newID     = $(this).attr("id");  //This is a custom addition -- Do not carryover
			newID         = "#" + newID + ":checked";
			var isChecked = $(newID).val()?true:false;

			extractObject.dataIndex = $(this).attr("id");
			var specialFunction = $(this).attr("executeSpecialFunction");
			extractObject.value     = isChecked;
			
			if(isChecked == true)
			{
				if(specialFunction == "true")
				{
					extractObject.custom    = "checkbox";
					extractObject.specialFunction = "true";
					console.log("SPECIAL FUNCTION FOUND");
				}
			}
			
			extractedValues.push(extractObject);
		}
		else if($(this).attr("type") == "radio")
		{

			var newID     = $(this).attr("id");
			var avoid     = $(this).attr("avoidAtDBPost");

			newID         = "#" + newID + ":checked";
			
			var specialFunction = $(this).attr("executeSpecialFunction");
			console.log(specialFunction);

			if($(newID).is(':checked'))
				extractObject.value = true;
			else
				extractObject.value = false;
			
			//We're going to include everything if an avoid isn't there.

				extractObject.dataIndex = $(this).attr("id");
				extractObject.custom    = "radio";
				if(avoid == "true")
				{	
					extractObject.avoidAtDBPost = "true";
				}
			
				console.log("Special Function");
				//Check for a special function
				if(specialFunction == "true")
				{
					extractObject.specialFunction = "true";
				}
					
				extractedValues.push(extractObject);
			
			
		}
		else if($(this).attr("type") != "button" && $(this).attr("type") != "submit" && $(this).attr("name") != undefined)
		{
			extractObject.dataIndex = $(this).attr("name");
			var grabID = $(this).attr("id");
			grabID     = "#" + grabID;
			extractObject.value     = $(grabID).val();
			
    		var avoid  = $(this).attr("avoid");
			if(avoid == "true")
			{	
					extractObject.avoidAtDBPost = "true";
			}
			//Check for a dynamic table to inject a header or footer
			var key   = extractObject.dataIndex.split("_");
			injectOnStartOrEnd(key, extractedValues);
			
			extractedValues.push(extractObject);
		}
	});
	
	//Go through all textareas
	$('textarea').each(function() {
		
		var extractObject = {};
		
		var grabID = $(this).attr("id");
	
		grabID     = "#" + grabID;
		extractObject.value     = $(grabID).val();
		extractObject.dataIndex = $(this).attr("name");
		extractedValues.push(extractObject);
	});
	
	//Go through all options
	$('option').each(function() {
		
		var extractObject = {};
		
		var grabID = $(this).attr("id");
		var avoid  = $(this).attr("avoid");
		
		console.log("AVOID: " + avoid);
		
		if(avoid != undefined && avoid != "true")
		{
			grabID     = "#" + grabID;
			
			if(this.selected)
				extractObject.value     = true;
			else
				extractObject.value     = false;
				
			extractObject.dataIndex = $(this).attr("id");
			extractObject.custom    = "option";
			
			extractedValues.push(extractObject);
		}
		
	});
	
	$('select').each(function() {
	
		var extractObject = {};
		
		var avoid  = $(this).attr("avoid");
		
		if(avoid != "true")
		{
			extractObject.dataIndex = $(this).attr("name");
			var grabID              = $(this).attr("id");
			grabID                  = "#" + grabID;
			
			extractObject.value     = $(grabID).val();
			
			//Check for a dynamic table to inject a header or footer
			var key   = extractObject.dataIndex.split("_");
			injectOnStartOrEnd(key, extractedValues);
			
			extractedValues.push(extractObject);
		}
	
	});
	
	return JSON.stringify(extractedValues, null, 2);
}

function injectData(dataArr)
{	
	dataArr = decodeURIComponent(dataArr);
	dataArr = JSON.parse(dataArr);
		
	for(var i = 0; i<dataArr.length; i++)
	{
	    if(dataArr[i].custom == null || dataArr[i].custom == "")
		{
			//Construct JQuery Identifiers, then set values.
			var JQueryElement = "[name=\"" + dataArr[i].dataIndex + "\"]";

			if($(JQueryElement).attr("type") == undefined)
				var JQueryElement = "#" + dataArr[i].dataIndex;
			
			if($(JQueryElement).attr("type") == "checkbox")
			{
				if(dataArr[i].value == true)
				{
					$(JQueryElement).prop('checked', true);
				}
			}
			else
			{
				$(JQueryElement).val(dataArr[i].value);
			}
		}
		else
		{
			//Dynamic Forms
			if(dataArr[i].custom == "header")
			{
				//Populates the appropriate tables
				for(var c = 0; c<dataArr[i].count; c++)
				{
					var AddButton = dataArr[i].fn;
					$(AddButton).click();
				}
			}
			
			//Radio Buttons
			if(dataArr[i].custom == "radio")
			{
				var elementID = "#" + dataArr[i].dataIndex;
								
				if(dataArr[i].specialFunction == "true" && dataArr[i]["value"] == true)
				{
					//INSERT THE SPECIAL FUNCTION Here
					addTextAreaByRadio(elementID);
				}
					
				if(dataArr[i]["value"] == true)
					$(elementID).prop('checked', true);
			}
			
			//Checkboxes
			if(dataArr[i].custom == "checkbox")
			{
				var elementID = "#" + dataArr[i].dataIndex;
				
				if(dataArr[i].specialFunction == "true")
				{
					createTextArea(elementID);
				}
				
				$(elementID).prop('checked', true);

			}
			
			//MultiSelect Options
			if(dataArr[i].custom == "option")
			{
				var elementID = "#" + dataArr[i].dataIndex;
				
				if(dataArr[i].value == true)
					$(elementID).attr("selected", "selected");
			}
		}
		
	}
	
	console.log(dataArr.length);
		
	return dataArr;
}

//This will check for a dynamic table and return the row count variable if found.
function checkForDynamicTable(key, start) {

	for(var i = 0; i<dynamicTables.length; i++)
	{
		//We're looking for the start of a dynamic table
		if(start == true)
		{
			console.log("ENTERING THE START");
			if(dynamicTables[i].startkey == key)
			{
				console.log("START KEY: " + dynamicTables[i].startkey + " KEY: " + key);
				return {"start":dynamicTables[i].rowvar, "fcn":dynamicTables[i].fcn};
			}
		}
		//We're looking for the end of a dynamic table
		else
		{
			if(dynamicTables[i].endkey == key)
				return {"end":dynamicTables[i].rowvar, "fcn":dynamicTables[i].fcn};
		}
	}
	
	return false;
}

//This will inject a header if necessary
function injectOnStartOrEnd(key, arr)
{

	//Check for a dynamic table to inject a header
	var start = checkForDynamicTable(key[0], true);
	var end   = checkForDynamicTable(key[0], false);
	
	var count = 0;
	
	console.log("START" + start);
	
	if(start != false)
	{
		console.log("FOUND A STARTER OR ENDER");
		if(start.start == 1)
			count = rowIndex;
		if(start.start == 2)
			count = rowIndex2;
			
		if(startersKept.indexOf(key[0]) == -1)
		{
			startersKept.push(key[0]);
			var header = {};
			
			header.custom = "header";
			header.count  = count;
			header.fn     = start.fcn;
			
			arr.push(header);
		}
		
		console.log(count);
	}
}

//This will be used to extract relational data
function extractRelationalData()
{
	var relationalData = [];

	//Most relational drop downs will be in a select box. As a result, we're going to look for an HTML attribute called "relational" and if any selectbox has this, 
	//we will extract it and convert the options to JSON.
	$('select').each(function() {
	
		var extractObject = {};
		
		var relational    = $(this).attr("relational");
		
		if(relational == "true")
		{
			extractObject.dataIndex = $(this).attr("name");
			
			//Here we will loop through the options of the select field and store them to the extractObject
			var select     = document.getElementById($(this).attr("id"));
			var selectData = [];
			
			for(var c = 0; c<select.options.length; c++)
			{
				var options = {};
				options.text = select.options[c].text;
				options.id   = select.options[c].value;
				
				selectData.push(options);
			}
			
			extractObject.values = selectData;
			
			relationalData.push(extractObject);
		}
	
	});
	
	return JSON.stringify(relationalData, null, 2);
}

//This will re-insert any relationships the device needed to keep for offline use.
function injectRelationalData(dataArr)
{	
	dataArr = decodeURIComponent(dataArr);
	dataArr = JSON.parse(dataArr);
	
	for(var i = 0; i<dataArr.length; i++)
	{
	    if(dataArr[i].custom == null || dataArr[i].custom == "")
		{
			//Construct JQuery Identifiers, then set values.
			var JQueryElement = "[name=\"" + dataArr[i].dataIndex + "\"]";
			var JQueryElementID = $(JQueryElement).attr("id");
			var select          = document.getElementById(JQueryElementID);
			
			//Loop through the select's options to re-inject into the form
			for(var c = 0; c<dataArr[i].values.length; c++)
			{
				selectText  = dataArr[i].values[c].text;
				selectValue = dataArr[i].values[c].id;
				
				
				select.options[c] = new Option(selectText, selectValue);
			}
		}
	}

	return "CALLED";
}

function postToDb()
{
	var jsonData            = {};
	var formValues          = extractData();

	jsonData.tableConfig    = tableConfig; 
	jsonData.formValues     = JSON.parse(formValues);
	//FormId, SiteId, CreatorId, DocumentName, DisplayName, doc_json
	//atob to decode
	jsonData.documentConfig = {"FormId": 5, "CreatorId":1, "DocumentName":"Fresnillo Safety Observation", "DisplayName":"Safety Observation", "doc_json":btoa(formValues) };
	jsonData.formConfig     = {"FormId": 5, "Site": 2, "Crew":"1", "Department":"1", "UserId": 2};
	
	$.ajax({
		url : rootURL + "/misom_forms/dev/cloud/formpost/",
		type: "POST",
		data : JSON.stringify(jsonData),
		contentType: "application/json",
		success: function(data, textStatus, jqXHR)
		{
			window.location = "idid://" + data[0];
			alert("Successfully inserted & synced the document");
		},
		error: function (jqXHR, textStatus, errorThrown)
		{
			return -1;
		}
	});
}

function updateDb(documentID)
{
	var jsonData            = {};
	var formValues          = extractData();

	jsonData.tableConfig    = tableConfig; 
	jsonData.formValues     = JSON.parse(formValues);
	
	//atob to decode
	jsonData.documentConfig = {"DocumentID": documentID, "doc_json":btoa(formValues) };
	
	$.ajax({
		url : rootURL + "/misom_forms/dev/cloud/formupdate/",
		type: "POST",
		data : JSON.stringify(jsonData),
		contentType: "application/json",
		success: function(data, textStatus, jqXHR)
		{
			alert("Successfully updated & synced the document.");
		},
		error: function (jqXHR, textStatus, errorThrown)
		{
			return -1;
		}
	});
}