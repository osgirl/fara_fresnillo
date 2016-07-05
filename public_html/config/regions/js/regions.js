/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			ZAC CARTER
	Application Name:	FARA
	Directory:			FARA/CONFIG/REGIONS/JS
	File Name:			regions.js
=============================================================*/

$(document).ready(function() {
	LoadRegionGroups();
});

function LoadRegionGroups() {
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+UserData[0].SiteGUID+"/RegionGroup?orderby=RegionGroup ASC", function( data ) {
		loadRegions(data);
	});
}

function loadRegions(regionGroups) {

	//This grabs your JSON object of people.
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/geo/Region?where=\"IsActive='1' AND SiteGUID = '"+UserData[0].SiteGUID+"'\"", function( data ) {
		
    	$("#region_list thead").append("<tr><th>#</th><th>Region Name</th><th>Region Group</th><th style='text-align:center'>Is Global</th></tr>");

		for(var key in data) {			 
			var currentRegion = data[key];			
			//var checkBox = (currentRegion.RegionType == "Global") ? "<input type='checkbox' id='" + currentRegion.RegionGUID + "' checked><label for='" + currentRegion.RegionGUID + "'></label>" : "<input type='checkbox' id='" + currentRegion.RegionGUID + "'><label for='" + currentRegion.RegionGUID + "'></label>";
			var checkBox	= (currentRegion.RegionType == "Global") ? "<div class='switch'><label>No<input type='checkbox' id='" + currentRegion.RegionGUID + "' checked><span class='lever'></span>Yes</label></div>" : "<div class='switch'><label>No<input type='checkbox'><span class='lever'></span>Yes</label></div>";
			var selectBox	= "<select class='browser-default'>";
			
			selectBox += "<option value='0'>-- Select --</option>";
			
			for(var option in regionGroups) {
				var selectedOption = "";

				selectedOption = (data[key].RegionGroup == regionGroups[option]["RegionGroup"]) ? "selected='selected'" : "";
				
				selectBox += "<option "+selectedOption+" value="+regionGroups[option].RegionGroup+">"+regionGroups[option].RegionGroup+"</option>";
			}
			
			selectBox += "</select>";
			
			$("#region_list").append("<tr class='regionRow' RegionGUID="+currentRegion.RegionGUID+"><td>"+(parseInt(key) + 1)+"</td><td>"+currentRegion.RegionName+"</td><td style='text-align:center'>"+selectBox+"</td><td style='text-align:center'>"+checkBox+"</td></tr>");
		}
	});
}

function UpdateRegions() {
	var mainDictionary = {};
	var batchArray     = [];
	
	$(".regionRow").each(function() {
		var row = $(this);
		var regionDict = {};
		
		regionDict.APIKEY		= { "RegionGUID":row.attr("RegionGUID") };
		regionDict.RegionType	= row.find('input').is(":checked") == true ? "Global" : "Personal";
		regionDict.RegionGroup	= null;

		(row.find('select').val() != "0") ? regionDict.RegionGroup = row.find('select').val() : regionDict.RegionGroup = null;
		
		batchArray.push(regionDict);			
	});

	mainDictionary.fields = batchArray;
	
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "update/bulk/geo/Region",
		type: "POST",
		data: JSON.stringify(mainDictionary),
		success: function(){
			DisplayAlert("Success!","Successfully updated Regions.");
		},
		error: function(){
			DisplayAlert("Error!","Unable to insert trigger details at this time. Please try again later.");
		}
	});
}


