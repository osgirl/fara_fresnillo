/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			JORGE MURILLO
	Application Name:	FARA
	Directory:			FARA/DOWNEVENTS/JS
	File Name:			main.js
=============================================================*/

var usersArray = [];
var downArray = [];
var eventid;

$(document).ready(function() {
	/*LoadUsers();

	$('#btn-adduser').click(function(){
		ExportUser('0','');
	});

	$('#btn-canceluser').click(function(){
		$('#user_role').val(''); $('#personnel_id').val(''); $('#first_name').val(''); $('#middle_name').val(''); $('#last_name').val(''); $('#display_name').val(''); $('#email_txt').val(''); $('#username_txt').val(''); $('#password_txt').val(''); 
	});

	$("#user_site").focus();
	$("#user_site").val(UserData[0].SiteDisplayName);*/
	$("#dateInput").jqxDateTimeInput({ width: '200px', height: '35px', selectionMode: 'range', formatString: 'MM-dd-yyyy' });
	
	LoadDownList();
	
	$('#filter_events').click(function(){
		if($("#dateInput").val() == "" || $("#dateInput").val() == null){
			Materialize.toast("Please enter a date range", 4000);
			$("#dateInput").focus();
		}
		else{
			LockForService('Loading Events...');
			LoadDownList();
		}
	});
});

function LoadDownList(){
	downArray = [];
	var selection = $("#dateInput").jqxDateTimeInput('getRange');
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/dbo/Down_Events?where=\"Starttime >= '"+selection.from.toLocaleDateString()+"' and Starttime <= '"+selection.to.toLocaleDateString()+"' ORDER BY Starttime DESC\"", function( downData ) {
		downArray = downData;
		
		tableDownEvents(downArray);
		graphBarChart(downArray);
		
		ServiceComplete();
	});
}

function tableDownEvents(data){
  var table = [];
	for(var i in data){
		table.push({ DownEventID: data[i]["DownEventID"], EquipmentName: data[i]["EquipmentName"], AreaName: data[i]["AreaName"], Status: data[i]["Status"], Starttime: moment((data[i]["Starttime"]).split('Z')[0]).format('MM/DD/YYYY, h:mm:ss a'), Endtime: moment((data[i]["Endtime"]).split('Z')[0]).format('MM/DD/YYYY, h:mm:ss a'), Duration: parseInt(data[i]["Duration"]).toFixed(2), Faultcode: data[i]["Faultcode"] });
	}
  
	var source =
	{
		localData: table,
		dataType: "array"
	};
  var cellsrenderer = function (row, columnfield, value, defaulthtml, columnproperties) {
    return '<span class="jqxgrid-fontsize" style="float: ' + columnproperties.cellsalign + ';">' + value + '</span>';
  }
	var dataAdapter = new $.jqx.dataAdapter(source);
	$("#table-downequip").jqxGrid(
	{
		width: '100%',
    height: 400,
		source: dataAdapter,
    theme: 'metro',
		sortable: true,
		columnsresize: true,
		columnsreorder: true,
    filterable: 'excel',
		groupable: true,
    enabletooltips: true,
    rowsheight: 50,
		columns: [
			{
					text: 'DownEventID', dataField: 'DownEventID', hidden: true
			},
			{
					text: 'Area', align: 'right', cellsAlign: 'right', dataField: 'AreaName', width: 90, cellsrenderer: cellsrenderer
			},
      {
					text: 'Equipment', align: 'right', cellsAlign: 'right', dataField: 'EquipmentName', cellsrenderer: cellsrenderer
			},
			{
					text: 'Status', align: 'right', cellsAlign: 'right', dataField: 'Status', width: 90, cellsrenderer: cellsrenderer
			},
			{
					text: 'Start Time', align: 'right', cellsAlign: 'right', dataField: 'Starttime', cellsrenderer: cellsrenderer
			},
      {
					text: 'End Time', align: 'right', cellsAlign: 'right', dataField: 'Endtime', cellsrenderer: cellsrenderer
			},
      {
					text: 'Duration', align: 'right', cellsAlign: 'right', dataField: 'Duration', width: 90, cellsrenderer: cellsrenderer
			},
      {
					text: 'Fault Code', align: 'right', cellsAlign: 'right', dataField: 'Faultcode', width: 90, cellsrenderer: cellsrenderer
			}
		]
	});
}

$('#table-downequip').on('rowselect', function (event) {
	var selectedGrid1Row = event.args.rowindex;
	
	//Show loading
	$('.loading-container').show();
	
	eventid = $('#table-downequip').jqxGrid('getcellvalue', selectedGrid1Row, "DownEventID");
	
	getComments(eventid);
});

function getComments(eventid){
	LockForService('Loading Comments...');
	
	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/virtual/"+ UserData[0].SiteGUID +"/StatusEventComments?where=\"DownEventID = '"+eventid+"' \" ORDER BY Timestamp", function( data ) {
		var list = $('#comment-collection').html("");
		
		for(var key in data){
			list.append(
				'<li class="collection-item avatar">'+
					'<i class="material-icons circle orange darken-3">person</i>'+
					'<span class="title" style="font-weight: 500">'+data[key].DisplayName+'</span>'+
					'<p>'+data[key].Comment+'</p>'+
					'<a href="#!" class="secondary-content"><i class="material-icons">thumb_up</i></a>'+
				'</li>'
			)
		}
		if(data.length == 0){
			list.append(
				'<li class="collection-item avatar">'+
				'<i class="material-icons circle">question_answer</i>'+
					'<span class="title" style="font-weight: 500">No Comments Available</span>'+
				'</li>'
			)
		}
		
		$('#add-comment-box').html(
			'<div class="input-field col s12">'+
				'<input id="add_comment" type="text">'+
				'<label for="add_comment">Write your comment</label>'+
				'<a id="btn-addcomment" class="waves-effect waves-light btn orange darken-3" onclick="ExportComment('+eventid+');">'+
					'<i class="material-icons left">send</i>send'+
				'</a>'+
			'</div>'
		)
		
		ServiceComplete();
	});
}

function ExportComment(id){
	var dataRowObj = {};
  if(validateRecord(id)){
    $('#btn-addcomment').addClass('disabled');
    
    dataRowObj.DownEventID    	= String(id);
    dataRowObj.Comment	      	= $('#add_comment').val();
    dataRowObj.DisplayName      = UserData[0].DisplayName;
    dataRowObj.Timestamp       	= String(new Date());
        
    AddComment(dataRowObj);
  }
}

function AddComment(dataRowObj){
	console.log(dataRowObj);
	var jsonData = {
		 "fields": dataRowObj
	};
	
	//We add new record in the table
	$.ajax ({
		headers: {
			"Content-Type": "application/json"
		},
		url: ruIP + ruPort + listsDB + listEN + "create/virtual/"+UserData[0].SiteGUID+"/StatusEventComments",
		type: "POST",
		data: JSON.stringify(jsonData),
		success: function(){
			Materialize.toast('Comment added', 4000);
			
			getComments(dataRowObj.DownEventID);
		},
		error: function(){
			Materialize.toast('There was an error trying to add comment', 4000);
		}
	});
}

function graphBarChart(dt){
	var dataArray = [];
	var xArray = [];
	
	for(var i in dt){
		if($.inArray(dt[i].EquipmentName, xArray) == -1){
			xArray.push(dt[i].EquipmentName);
			var test = parseInt(dt[i].Duration);
			
			if(test != "NaN" || dt[i].Duration != null || dt[i].Duration != undefined){
				dataArray.push({ equipment: dt[i].EquipmentName, duration: parseInt(dt[i].Duration) });
			}
		}
		else{
			for(var j in dataArray){
				if(dataArray[j].equipment == dt[i].EquipmentName){
					dataArray[j].duration += parseInt(dt[i].Duration)
				}
			}
		}
	}
	
	dataArray.sort(function(a, b){
		return b.duration-a.duration
	})
	
	
	
	$.jqx._jqxChart.prototype.colorSchemes.push({ name: 'negbarScheme', colors: ['#4A89DC', '#E9573F', '#37BC9B'] });
	
	// prepare jqxChart settings
	var settings = {
			title: "Events Duration by Equipment",
			description: "",
			showLegend: true,
			enableAnimations: false,
			showBorderLine: false,
			showToolTips: true,
			padding: { left: 20, top: 5, right: 20, bottom: 5 },
			titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
			source: dataArray,
			colorScheme: 'negbarScheme',
			xAxis:
			{
					position: 'top',
					dataField: 'equipment', 
					displayText: 'Equipment',
					flip: false,
					labels:
					{
						angle: 90,
						horizontalAlignment: 'right',
						verticalAlignment: 'center',
						rotationPoint: 'right',
						offset: { x: 0, y: -1 }
					}
			},
			seriesGroups:
			[
					{
							type: 'column',
							orientation: 'horizontal', // render values on X-axis
							useGradientColors: false,
							toolTipFormatSettings: { thousandsSeparator: ',' },
							series: [
								{ dataField: 'duration', displayText: 'Duration (minutes)' }
							],
							valueAxis:
							{
									visible: true,
									flip: true
							}
					}
			]
	};
	// setup the chart
	$('#graph-events').jqxChart(settings);

}

function validateRecord(id){
  
	if($('#add_comment').val().replace(/\s/g, '') == ''){
		Materialize.toast('Please add a comment', 4000);
		$('#add_comment').focus();
		return false;
	}
  
  return true;
}