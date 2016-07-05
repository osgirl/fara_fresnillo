/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/FORMS/500023/JS
	File Name:			utilities.js
=============================================================*/

var taskListRowIndex	= 0;
var subjectsRowCount	= 0;
var UserListArray		= [];
var UserListGUIDArray	= [];
var nicknm				= "";
var formExists			= false;
var thisFormLocked		= true;
var defaultMineName		= "The Safety Consortium, M40543969, David Daniels, 801-746-2462, Salt Lake City, UT 84115";
var globalBridge;

(typeof formLocked === "undefined") ? thisFormLocked = false : thisFormLocked = formLocked;

//======================= WEB GAP =====================================

function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    }
	else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge)
        }, false)
    }
}

connectWebViewJavascriptBridge(function(bridge) {
    bridge.init(function(message, responseCallback) {});

    globalBridge = bridge;                               

    bridge.registerHandler("receiveVirtualTable", function(data) {
        receiveVirtualTable(data);
    });                            
});

//======================= END WEB GAP =====================================

$(document).ready(function () {

	setTimeout(function() {	loadDefaultFields(); }, 2000);
	
	setTimeout(function() {
		taskListRowIndex	= 0;
		subjectsRowCount	= 0;
		
		(!thisFormLocked) ? canDisableElements = false : canDisableElements = true;
		
		$("#mine_location").val(defaultMineName);
		
	}, 2500);
});

function AddSubjectsRow(element) {
	var buttonCont = $("#"+element).parent().parent();
	subjectsRowCount++;
	
	buttonCont.before('<div class="r11-e2 col l8 m10 s10 offset-l2"><label>Select Option</label><select id="F500023_subjects_dropdown_'+subjectsRowCount+'" databaseColumn="SubjectsDropdown'+subjectsRowCount+'" elementType="select" class="browser-default formElement" VirtualList="F500023_Subjects" loadLast="true"></select></div>');
	$("#F500023_subjects_dropdown_" + (subjectsRowCount - 1)).attr("executeFunction", "AddSubjectsRow('add_subjects_row')");
					
	if(subjectsRowCount == 1) {
		buttonCont.append('<div class="col s1"><a onclick="RemoveSubjectsRow(this)"style="cursor:pointer" class="left"><i class="normal red-text text-lighten-1 material-icons '+desktopDisplayClass+'">remove_circle</i><div class="mobile-icons remove-icon '+iosDisplayClass+'">_</div></a></div>');
	}
	
	SendDropDownInfo("F500023_Subjects", "F500023_subjects_dropdown_"+subjectsRowCount);
}

function AddRowToTaskList(element) {
	var buttonCont = $("#"+element).parent().parent();	
	taskListRowIndex++;
	
	$('#training_table tr:last').before('<tr id="row_' + taskListRowIndex + '"><td><input class="formElement" type="date" id="d_Tdate_' + taskListRowIndex + '" databaseColumn="TrainingDate' + taskListRowIndex + '" elementType="date"></td><td><input type="text" class="formElement" id="d_Ttask_' + taskListRowIndex + '" databaseColumn="TrainingTask' + taskListRowIndex + '" elementType="textbox"></td><td class="initialsCont formElement formImage dontHide"><div style="font-style:italic" onclick="callInitials(\'TrainingInitials' + taskListRowIndex + 'a\')" type="initials" class="DTint' + taskListRowIndex + 'a initialsBox" id="d_Tint_' + taskListRowIndex + 'a" picHeight="31" picWidth="58" databaseColumn="TrainingInitials' + taskListRowIndex + 'a" initialsTrigger="true"></div></td><td class="initialsCont formElement formImage dontHide"><div style="font-style:italic" onclick="callInitials(\'TrainingInitials' + taskListRowIndex + 'b\')" type="initials" class="DTint' + taskListRowIndex + 'b initialsBox" id="d_Tint_' + taskListRowIndex + 'b" picHeight="31" picWidth="58" databaseColumn="TrainingInitials' + taskListRowIndex + 'b" initialsTrigger="true"></div></td></tr>');
	
	$("#d_Ttask_" + (taskListRowIndex - 1)).attr("executeFunction", "AddRowToTaskList('add_row_to_task_list_btn')");
	
	if(taskListRowIndex == 1) {
		buttonCont.append('<div class="col s1"><a onclick="RemoveRowFromTaskList(this)"style="cursor:pointer" class="left"><i class="normal red-text text-lighten-1 material-icons '+desktopDisplayClass+'">remove_circle</i><div class="mobile-icons remove-icon '+iosDisplayClass+'">_</div></a></div>');
	}
	
	waitForFinalLoadCount--;
	CheckLoadCount();
}

function RemoveSubjectsRow(element) {
	var buttonCont = $(element).parent().parent();
	subjectsRowCount--;
	
	buttonCont.prev().remove();
	$("#F500023_subjects_dropdown_" + subjectsRowCount).removeAttr("executeFunction");
	
	(subjectsRowCount <= 0) ? $(element).parent().remove() : false;
}

function RemoveRowFromTaskList(element) {
	var buttonCont = $(element).parent().parent();
	taskListRowIndex--;
	
	$('#training_table tr:last').prev().remove();
	$("#d_Ttask_" +taskListRowIndex).removeAttr("executeFunction");
	
	(taskListRowIndex <= 0) ? $(element).parent().remove() : false;
}

function RemoveAllRows() {
	taskListRowIndex	= 0;
	subjectsRowCount	= 0;
	
	$('#training_table > tbody > tr').not('#head_row').not('#row_0').remove();
	$("#d_Ttask_" + taskListRowIndex).removeAttr("executeFunction");
	$('#remove_row_btn').remove();
	
	$('#subjects_dropdown_container').children().slice(1).remove();	
	$("#F500023_subjects_dropdown_" + subjectsRowCount).removeAttr("executeFunction");
	$('#remove_subjects_btn').remove();
}

function adjustValuesForMultiSelect() {
	var values = $("#subjects_select").val();
	
	$('[multiSelectGroup]').attr("isselected", "false");
	
	for(var key in values) {		
		$("#subjects_select option[value='" + values[key] + "']").attr("isselected","true");
	}
	
	$('#subject_select').trigger('chosen:open');
}









