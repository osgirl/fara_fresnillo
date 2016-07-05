/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			ZAC CARTER
	Application Name:	FARA
	Directory:			FARA/SCHEDULER
	File Name:			scheduler.js
=============================================================*/

var submitButtonShowing = false;
var scheduleRecords    = [];
var configRecords      = {};
var timeArr            = [];
var dataArr            = [];
var patternGUID		   = "";
var timeZone           = "America/Phoenix";
var flagError          = false;
var filtersShowing	   = false;
var hasGrabbedSchedule = false;
var foundError         = false;
var needsReset         = false;
var appendGUID         = "";
var errorMessage;
var savedBeginTime;
var savedEndTime;

$(document).ready(function() {

	$("#dateInputStart").jqxDateTimeInput({ width: '300px', height: '25px', formatString: 'MM-dd-yyyy' });
	$("#dateInputEnd").jqxDateTimeInput({ width: '300px', height: '25px', formatString: 'MM-dd-yyyy' });
	$("#widgetInputStart").jqxDateTimeInput({ width: '300px', height: '25px', formatString: 'MM-dd-yyyy' });
	$("#widgetInputEnd").jqxDateTimeInput({ width: '300px', height: '25px', formatString: 'MM-dd-yyyy' });
    $("#timeInput").jqxDateTimeInput({formatString: "T", showCalendarButton: false, width: '300px', height: '25px' });
 	$("#hours").jqxNumberInput({ width: '250px', height: '25px', min: 0, max: 24, inputMode: 'simple', decimalDigits:0});
 	$("#daysOn").jqxNumberInput({ width: '250px', height: '25px', min: 0, max: 365, inputMode: 'simple', decimalDigits:0});
 	$("#daysOff").jqxNumberInput({ width: '250px', height: '25px', min: 0, max: 365, inputMode: 'simple', decimalDigits:0});
	
	$("#category").change(function () {
	
		var select = $("#selectExisting");
		select.html("");
		
		//This grabs your JSON object of people.
		$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/ScheduleConfigs?where=\"Category='"+ $("#category option:selected").text() +"'\"", function(data) {
		
			var select = $("#selectExisting");
			select.append($("<option></option>").val("-1").html("--- Select Existing Pattern ---"));
			
			for(var key in data) {
			
				if(data[key].AppendGUID == null || data[key].AppendGUID == "")
					select.append($("<option></option>").val(data[key].PatternGUID).html(data[key].Name));
			}
			
			select.material_select();
		});
		
		updateTimelineForCategory();
	
	});
	
	$("#createNewPattern").click(function () {
		$("#existingPattern").attr("style", "display:none");
		$("#namePattern").removeAttr("style");
	});
	
	$("#appendExistingPattern").click(function () {
		$("#namePattern").attr("style", "display:none");
		$("#existingPattern").removeAttr("style");
	});
	
	
	//This grabs your JSON object of people.
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/" + UserData[0].SiteGUID + "/SYS_ScheduleCategories", function(data) {
	
		var select = $("#category");
		
		select.append($("<option></option>").val("-1").html("--- Select Category ---"));
		
		for(var key in data) {
			select.append($("<option></option>").val(data[key].TableRecordGUID).html(data[key].SYS_ScheduleCategories));
		}
		
		select.material_select();
	
	});
});

function generatePattern() {
	
	$(".generatePattern").val("Loading...One Moment");
	$(".generatePattern").attr("disabled", "true");
	
	needsReset     = false;
	checkValidations();
	
}

function adjustChart() {
			
	timeArr        = [];
	
	savedBeginTime = $("#widgetInputStart").jqxDateTimeInput('getDate').toISOString();
	savedEndTime   = $("#widgetInputEnd").jqxDateTimeInput('getDate').toISOString();
	
	grabSchedule(scheduleRecords);	
}

function checkValidations() {

	//The first thing we're going to check is the Named Pattern and ensure there isn't another name like this taken within the specified time period.
	var namedPattern = $("#patternName").val();
	var gridURL = ruIP + ruPort + listsDB + listEN + "read/lfms/SchedulePatterns?where=\"StartDate >= '" + $("#dateInputStart").jqxDateTimeInput('getDate').toISOString() + "' AND EndDate <= '" + $("#dateInputEnd").jqxDateTimeInput('getDate').toISOString() +"' AND ScheduleCategory = '" + $("#category option:selected").text() + "' AND SiteGUID = '" + UserData[0].SiteGUID + "' AND Name = '" + namedPattern + "'\"";
		
	foundError   = false;
		
	//This grabs your JSON object of people.
	$.getJSON(gridURL, function(data) {
	
		if(data.length > 0 && $("#createNewPattern").is(':checked')) {
			errorMessage = "There is an existing pattern named " + namedPattern + " under the selected category and time range.";		
			foundError   = true;
		}
		
		if($("#dateInputStart").jqxDateTimeInput('getDate').getTime() > $("#dateInputEnd").jqxDateTimeInput('getDate').getTime()) {
			errorMessage    = "Your start date must not be greater than your end date.";
			foundError      = true;
		}
	
	
		if(foundError == true) {
			DisplayAlert("Alert!",errorMessage);
		}
		else {
			patternGUID          = CreateGUID();
			appendGUID           = CreateGUID();

			flagError            = false;
				
			$("#widgetInputStart").jqxDateTimeInput('setDate', $("#dateInputStart").jqxDateTimeInput('getDate'));
			$("#widgetInputEnd").jqxDateTimeInput('setDate', $("#dateInputEnd").jqxDateTimeInput('getDate'));
					
			generatePattern();
		}
	
	});
}

function generatePattern() {

	scheduleRecords        = [];
	
	var startDate          = moment($("#dateInputStart").jqxDateTimeInput('getDate')); 
	var endDate            = moment($("#dateInputEnd").jqxDateTimeInput('getDate'));
	var startTime          = $("#timeInput").jqxDateTimeInput('getDate');
	var hours              = $("#hours").val();
	var daysOn             = $("#daysOn").val();
	var daysOff            = $("#daysOff").val();
	var patternName        = $("#patternName").val();
	
	var isOnActiveDays     = true;

	//Let's get the number of days to run the script for and we will do one for loop for each pattern.
	var daysToRun          = endDate.diff(startDate, 'days');
		
	var onOffToggle        = 0;
	
	var beginningStartTime = moment($("#dateInputStart").jqxDateTimeInput('getDate'));
	
	var beginningHours     = startTime.getHours(); //0-23
	var beginningMinutes   = startTime.getMinutes(); //0-59
	var beginningSeconds   = startTime.getSeconds(); //0-59
	
	for(var i = 1; i<=daysToRun; i++) {
		var schedule       = {};
		
		if(isOnActiveDays) {
			beginningStartTime    = moment(beginningStartTime);
			
			schedule.ScheduleGUID = CreateGUID;
			schedule.PatternGUID  = $("#createNewPattern").is(':checked') ? patternGUID : $("#selectExisting").val();
			
			//Set Start Time
			beginningStartTime.hours(beginningHours);
			beginningStartTime.minutes(beginningMinutes);
			beginningStartTime.seconds(beginningSeconds);
			
			schedule.StartDate = beginningStartTime.toDate();
			schedule.SiteGUID  = UserData[0].SiteGUID;
			
			schedule.ScheduleCategoryGUID = $("#category").val();
			schedule.ScheduleCategory     = $("#category option:selected").text();
			
			//Set the End Time
			schedule.EndDate   = moment(beginningStartTime).add(parseInt(hours), "hours").toDate();
			
			//Set the Schedule Meta Data
			schedule.Name      = $("#createNewPattern").is(':checked') ? patternName : $("#selectExisting option:selected").text();
			schedule.AppendGUID = $("#createNewPattern").is(':checked') ? "" : appendGUID;
			
			
			scheduleRecords.push(schedule);
		}
		
		//Footer Duties
		onOffToggle++;
		
		if(shouldSwitchToggle(onOffToggle, isOnActiveDays, daysOn, daysOff)) {
			onOffToggle    = 0;	
			isOnActiveDays = !isOnActiveDays;
		}
		
		beginningStartTime = moment(beginningStartTime).add(1, "day");
	}
	
	
	configRecords = {};
	
	configRecords.PatternGUID = $("#createNewPattern").is(':checked') ? patternGUID : $("#selectExisting").val();
	configRecords.Name        = $("#createNewPattern").is(':checked') ? patternName : $("#selectExisting option:selected").text();;
	configRecords.StartDate   = startDate.toDate();
	configRecords.StartTime   = $("#timeInput").val();
	configRecords.EndDate     = endDate.toDate();
	configRecords.Hours       = hours.toString();
	configRecords.DaysOn      = daysOn.toString();
	configRecords.DaysOff     = daysOff.toString();
	configRecords.Category    = $("#category option:selected").text();
	configRecords.AppendGUID  = $("#createNewPattern").is(':checked') ? "" : appendGUID;
	
	if(hasGrabbedSchedule == true)
		checkForDateConflicts(dataArr, scheduleRecords);
		

	showScheduleResults(scheduleRecords, configRecords);
	$("#step2").parent().parent().removeAttr("style");
	
    $(".generatePattern").val("Create Pattern");
    $(".generatePattern").removeAttr("disabled");
}


function shouldSwitchToggle(onOffToggle, isOnActiveDays, daysOn, daysOff) {

	if(isOnActiveDays) {
		if(onOffToggle == daysOn)
			return true;
	}
	else {
		if(onOffToggle == daysOff)
			return true;
	}
	
	return false;

}

function showScheduleResults(records, cr) {
	
	var source =
    {
        localdata: records,
        datatype: "array",
        datafields:
        [
            { name: 'StartDate', type: 'string' },
            { name: 'EndDate', type: 'string' },
            { name: 'Name', type: 'string' },
            { name: 'ScheduleCategory', type: 'string' }
        ]
    };
    
    var dataAdapter = new $.jqx.dataAdapter(source);
    
    //Show the grid.
    $("#schedule").jqxGrid({
        width: '99%',
        height: '100%',
        source: dataAdapter,
        altrows: true,
        columnsresize: true,
        rowsheight: 50,
        groupable: true,
        columns: [
          { text: 'Category', datafield: 'ScheduleCategory', width:'15%' },
          { text: 'Name', datafield: 'Name', width:'10%' },
          { text: 'Start Time', datafield: 'StartDate', width:'35%', cellsalign: 'left' },
          { text: 'EndTime', datafield: 'EndDate', width:'40%', cellsalign: 'left'}
        ]
    });
    
    $('#schedule').jqxGrid('render'); 
    
    //Show the timeline chart.
    grabSchedule(records);
    
    if(submitButtonShowing == false) {
	    $("#scheduleTable").append('<tr><td colspan="2" style="text-align:center"><a href="#" onclick="sendData()" class="blue-grey darken-2 white-text waves-effect waves-light btn"><i class="material-icons right">backup</i>Send to Database</a></td></tr>');
		submitButtonShowing = true; 
    }
}

function sendData() {
	if(needsReset == false) {
		needsReset = true;
    	var mainDictionary      = {};
    	var configDictionary    = {};
    	mainDictionary.fields   = scheduleRecords;
 
    	configDictionary.fields = configRecords;
    	
    	if(flagError == false && foundError == false) {
	    	$.ajax ({
		        headers: {
		             "Content-Type": "application/json"
		        },
		        url: ruIP + ruPort + listsDB + listEN + "create/bulk/lfms/SchedulePatterns",
		        type: "POST",
		        data: JSON.stringify(mainDictionary),
		        success: function() {
		             $.ajax ({
				        headers: {
				             "Content-Type": "application/json"
				        },
				        url: ruIP + ruPort + listsDB + listEN + "create/virtual/" + UserData[0].SiteGUID + "/ScheduleConfigs",
				        type: "POST",
				        data: JSON.stringify(configDictionary),
				        success: function() {
				             DisplayAlert("Alert!","Schedule Created!");
				             
   			                flagError          = false;
							filtersShowing	   = false;
							hasGrabbedSchedule = false;
							foundError         = false;
		        
				        },
				        error: function(){
				        	 needsReset = false;
				             DisplayAlert("Alert!","Unable to Create Schedule!");
						}
					});		        
		        },
		        error: function(){
		        	 needsReset = false;
		             DisplayAlert("Alert!","Unable to Create Schedule!");
		        }
			 });
		 }
		 else if(foundError == true) {
		 	needsReset = false;
		 	DisplayAlert("Alert!","Cannot submit this pattern. RE: " + errorMessage);
		 }
		 else {
		 	needsReset = false;
		 	DisplayAlert("Alert!","There's a scheduling conflict. This pattern cannot be submitted.");
		 }

	 }
	 else {
	 	DisplayAlert("Alert!","This pattern was already submitted. Please make a new one.");
	 }
}


function grabSchedule(records) {

	if(hasGrabbedSchedule == false) {
	
		hasGrabbedSchedule = true;
		
		var gridURL;
		timeArr = [];
		
		
		if(filtersShowing == false)
			gridURL = ruIP + ruPort + listsDB + listEN + "read/lfms/SchedulePatterns?where=\"ScheduleCategory = '" + $("#category option:selected").text() +"' AND SiteGUID = '" + UserData[0].SiteGUID + "'\"";
		else
			gridURL = ruIP + ruPort + listsDB + listEN + "read/lfms/SchedulePatterns?where=\"StartDate >= '" + savedBeginTime + "' AND EndDate <= '" + savedEndTime +"' AND ScheduleCategory = '" + $("#category option:selected").text() + "' AND SiteGUID = '" + UserData[0].SiteGUID + "'\"";
			
		//This grabs your JSON object of people.
		$.getJSON(gridURL, function(data) {
		
			dataArr = data.slice();
			
			var date = new Date();
			date.getTimezoneOffset();
			
			for(var key in data) {
				var currentObject      = data[key];
				
				var singleStatusChange = [];
				
				singleStatusChange[0]  = currentObject.Name; 
				singleStatusChange[1]  = currentObject.Name; 
				singleStatusChange[2]  = new Date(currentObject.StartDate); 
				singleStatusChange[3]  = new Date(currentObject.EndDate);
				
				if(singleStatusChange[3] != "" && singleStatusChange[2] != "" && singleStatusChange[2] != null && singleStatusChange[3] != null)
					timeArr.push(singleStatusChange); 
			}
			
			savedBeginTime = $("#widgetInputStart").jqxDateTimeInput('getDate').getTime();
		    savedEndTime   = $("#widgetInputEnd").jqxDateTimeInput('getDate').getTime();
					
			//Let's combine the new data now.
			for(var key2 in records) {
				var currentObject      = scheduleRecords[key2];
				
				if(filtersShowing == false) {
					var singleStatusChange = [];
					
					singleStatusChange[0]  = currentObject.Name; 
					singleStatusChange[1]  = currentObject.Name; 
					singleStatusChange[2]  = new Date(currentObject.StartDate); 
					singleStatusChange[3]  = new Date(currentObject.EndDate);
					
					if(singleStatusChange[3] != "" && singleStatusChange[2] != "" && singleStatusChange[2] != null && singleStatusChange[3] != null)
						timeArr.push(singleStatusChange); 
				}
				else {
				
					if(new Date(currentObject.StartDate).getTime() > savedBeginTime && new Date(currentObject.StartDate).getTime() < savedEndTime) {
						var singleStatusChange = [];
						
						singleStatusChange[0]  = currentObject.Name; 
						singleStatusChange[1]  = currentObject.Name; 
						singleStatusChange[2]  = new Date(currentObject.StartDate); 
						singleStatusChange[3]  = new Date(currentObject.EndDate);
						
						if(singleStatusChange[3] != "" && singleStatusChange[2] != "" && singleStatusChange[2] != null && singleStatusChange[3] != null)
							timeArr.push(singleStatusChange); 
					}
				
				}
			}
			
			checkForDateConflicts(data, records);
			
			$("#showFilter").removeAttr("style");
			filtersShowing = true;
			google.load('visualization', '1', {packages:['timeline'], callback: drawChart});
			
		});
	
	}
	
	else {
		timeArr = [];
		filterSchedule(records);
	}
}	


function updateTimelineForCategory() {

	timeArr = [];
	
	var gridURL = ruIP + ruPort + listsDB + listEN + "read/lfms/SchedulePatterns?where=\"ScheduleCategory = '" + $("#category option:selected").text() +"' AND SiteGUID = '"+ UserData[0].SiteGUID +"'\"";
	
		
	//This grabs your JSON object of people.
	$.getJSON(gridURL, function(data) {
	
		dataArr = data.slice();
		
		var date = new Date();
		date.getTimezoneOffset();
		
		for(var key in data) {
			var currentObject      = data[key];
			
			var singleStatusChange = [];
			
			singleStatusChange[0]  = currentObject.Name; 
			singleStatusChange[1]  = currentObject.Name; 
			singleStatusChange[2]  = new Date(currentObject.StartDate); 
			singleStatusChange[3]  = new Date(currentObject.EndDate);
			
			if(singleStatusChange[3] != "" && singleStatusChange[2] != "" && singleStatusChange[2] != null && singleStatusChange[3] != null)
				timeArr.push(singleStatusChange); 
		}
		
		if(data.length > 0) {
			google.load('visualization', '1', {packages:['timeline'], callback: drawChart});		
		}
	});
	
}	


function filterSchedule(records) {
	
	var date = new Date();
	date.getTimezoneOffset();
	
	savedBeginTime = $("#widgetInputStart").jqxDateTimeInput('getDate').getTime();
    savedEndTime   = $("#widgetInputEnd").jqxDateTimeInput('getDate').getTime();
	
	for(var key in dataArr) {
		var currentObject      = dataArr[key];
		
		if(new Date(currentObject.StartDate).getTime() > savedBeginTime && new Date(currentObject.StartDate).getTime() < savedEndTime) {
		
			var singleStatusChange = [];
			
			singleStatusChange[0]  = currentObject.Name; 
			singleStatusChange[1]  = currentObject.Name; 
			singleStatusChange[2]  = new Date(currentObject.StartDate); 
			singleStatusChange[3]  = new Date(currentObject.EndDate);
			
			if(singleStatusChange[3] != "" && singleStatusChange[2] != "" && singleStatusChange[2] != null && singleStatusChange[3] != null)
				timeArr.push(singleStatusChange);			
		} 
	}
			
	//Let's combine the new data now.
	for(var key2 in records) {
		var currentObject      = scheduleRecords[key2];
				
		if(new Date(currentObject.StartDate).getTime() > savedBeginTime && new Date(currentObject.StartDate).getTime() < savedEndTime) {
			var singleStatusChange = [];
			
			singleStatusChange[0]  = currentObject.Name; 
			singleStatusChange[1]  = currentObject.Name; 
			singleStatusChange[2]  = new Date(currentObject.StartDate); 
			singleStatusChange[3]  = new Date(currentObject.EndDate);
			
			if(singleStatusChange[3] != "" && singleStatusChange[2] != "" && singleStatusChange[2] != null && singleStatusChange[3] != null)
				timeArr.push(singleStatusChange); 
		}
		
	}
		
	google.load('visualization', '1', {packages:['timeline'], callback: drawChart});
}

function drawChart() {
	console.log("DRAWING CHART");
	
	var dateMin = new Date(2010,11,1);
  	var dateMax = new Date(2012,0,1);
	var container = document.getElementById('misomTimeline');
	var chart     = new google.visualization.Timeline(container);
	var dataTable = new google.visualization.DataTable();
	
	dataTable.addColumn({ type: 'string', id: 'Group' });
	dataTable.addColumn({ type: 'string', id: 'ID' });
	dataTable.addColumn({ type: 'date', id: 'Start' });
	dataTable.addColumn({ type: 'date', id: 'End' });
	
	dataTable.addRows(timeArr);	
		
	var rowHeight   = 41;
	
	var options = {
	    timeline: { 
	        groupByRowLabel: true
	    },                
	    chartArea: {
			backgroundColor: {
				stroke: '#4322c0',
				strokeWidth: 3
			}
		},
		hAxis: {
            viewWindow: {
              max: dateMax,
              min: dateMin,
            }
		},
	    width: '100%',
	    stroke: "0"	    
	};
			
	// use a DataView to hide the category column from the Timeline
	var view = new google.visualization.DataView(dataTable);
	view.setColumns([0, 1, 2, 3]);
	
	chart.draw(view, options);
	
	$("#misomTimeline").removeAttr("style");
	$("#misomTimeline").closest('tr').removeAttr("style");
	$("#misomTimeline").css({"height":"250px"});
}

function checkForDateConflicts(databaseDates, attemptedDates) {
	if(flagError == false) {	
		//Let's start by filtering out all of the databaseDates that apply to the attemptedDates.
		var filteredDatabaseDates  = [];
		var category               = $("#category option:selected").text()
		var attemptedBeginTime     = $("#dateInputStart").jqxDateTimeInput('getDate').getTime();
		var attemptedEndTime       = $("#dateInputEnd").jqxDateTimeInput('getDate').getTime();
		 
		for(var key in databaseDates) {
			var currentObject      = databaseDates[key];
			var beginTime          = moment(currentObject.StartDate).toDate();
			var endTime            = moment(currentObject.EndDate).toDate();
				
			//Filter by Category and Date Range
			if(currentObject.ScheduleCategory == category && beginTime.getTime() >= attemptedBeginTime && endTime.getTime() <= attemptedEndTime) {
				filteredDatabaseDates.push(currentObject);
			}
		}
		
		flagError = false;
		
		//Now, let's compare our attemptedDates and see if any of them conflict with the newly filtered dates. We will run a double For Loop.
		for(var key in attemptedDates) {
			var currentObject      = attemptedDates[key];
			
			var beginTime          = moment(currentObject.StartDate).toDate().getTime();
			var endTime            = moment(currentObject.EndDate).toDate().getTime();
			
			for(var key2 in filteredDatabaseDates) {
				var existingDate    = filteredDatabaseDates[key2];
				var beginTime2      = moment(existingDate.StartDate).toDate().getTime();
			    var endTime2        = moment(existingDate.EndDate).toDate().getTime();
				
				if((beginTime > beginTime2 && beginTime < endTime2) || (endTime > beginTime2 && endTime < endTime2) || (beginTime == beginTime2 && endTime == endTime2)) {
					flagError = true;
				}
			}
		}	
		
		if(flagError == true) {
			DisplayAlert("Alert!","This pattern creates a conflict.");
		}
	}
}



function convertDateOffset(date) {

	//Gets the currentTimeStamp passed in
	var currentTime   = date.getTime();
	
	//Lets grab the offset.
	var timeOffset    = date.getTimezoneOffset() * 60000;
	
	//Let's add the new date times together.
	var newTime       = currentTime + timeOffset;
	
	
	return new Date(newTime);
}


