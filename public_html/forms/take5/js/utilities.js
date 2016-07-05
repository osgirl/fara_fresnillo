/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/FORMS/TAKE5/JS
	File Name:			utilities.js
=============================================================*/

var taskRowCount;
var challengesRowCount;
var precautionsRowCount;
var costCodeRowCount;
var crewMemberCount;
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

    bridge.registerHandler("receiveVirtualTable", function(data) { receiveVirtualTable(data); });                            
});

//======================= END WEB GAP =====================================

$(document).ready(function () {
	
	setTimeout(function() { loadDefaultFields(); }, 2000);
	
	setTimeout(function() {
		taskRowCount		= 1;
		challengesRowCount	= 1;
		precautionsRowCount = 1;
		costCodeRowCount	= 1;
		crewMemberCount		= 1;
		
		(!thisFormLocked) ? canDisableElements = false : canDisableElements = true;
		
	}, 2500);
});

function AddTaskRow(element) {
	var buttonCont = $("#"+element).parent().parent();	
	taskRowCount++;
	
	buttonCont.before('<div class="col l4 m4 s4 '+((taskRowCount % 2 == 1) ? "offset-l2" : "" )+'"><label>Select an option</label><select id="task_dropdown_'+taskRowCount+'" databaseColumn="TaskDropDown'+taskRowCount+'" elementType="select" class="browser-default formElement" VirtualList="TAKE5_Tasks" loadLast="true"></select></div>');
	$("#task_dropdown_" + (taskRowCount - 1)).attr("executeFunction", "AddTaskRow('add_task_row_btn')");
	
	if(taskRowCount == 2) {
		buttonCont.append('<div class="col s1"><a onclick="RemoveTaskRow(this)"style="cursor:pointer" class="left"><i class="normal red-text text-lighten-1 material-icons '+desktopDisplayClass+'">remove_circle</i><div class="mobile-icons remove-icon '+iosDisplayClass+'">_</div></a></div>');
	}
	
	SendDropDownInfo("TAKE5_Tasks","task_dropdown_"+taskRowCount);
}

function AddChallengesRow(element) {
	var buttonCont = $("#"+element).parent().parent();	
	challengesRowCount++;
	
	buttonCont.before('<div class="col l4 m4 s4 '+((challengesRowCount % 2 == 1) ? "offset-l2" : "" )+'"><label>Select an option</label><select id="challenges_dropdown_'+challengesRowCount+'" databaseColumn="ChallengeDropDown'+challengesRowCount+'" elementType="select" class="browser-default formElement" VirtualList="TAKE5_Challenges" loadLast="true"></select></div>');
	$("#challenges_dropdown_" + (challengesRowCount - 1)).attr("executeFunction", "AddChallengesRow('add_challenges_row_btn')");
					
	if(challengesRowCount == 2) {
		buttonCont.append('<div class="col s1"><a onclick="RemoveChallengesRow(this)" style="cursor:pointer" class="left"><i class="normal red-text text-lighten-1 material-icons '+desktopDisplayClass+'">remove_circle</i><div class="mobile-icons remove-icon '+iosDisplayClass+'">_</div></a></div>');
	}
	
	SendDropDownInfo("TAKE5_Challenges","challenges_dropdown_"+challengesRowCount);
}

function AddPrecautionsRow(element) {
	var buttonCont = $("#"+element).parent().parent();	
	precautionsRowCount++;
	
	buttonCont.before('<div class="col l4 m4 s4 '+((precautionsRowCount % 2 == 1) ? "offset-l2" : "" )+'"><label>Select an option</label><select id="precautions_dropdown_'+precautionsRowCount+'" databaseColumn="PrecautionsDropDown'+precautionsRowCount+'" elementType="select" class="browser-default formElement" VirtualList="TAKE5_Precautions" loadLast="true"></select></div>');
	$("#precautions_dropdown_" + (precautionsRowCount - 1)).attr("executeFunction", "AddPrecautionsRow('add_precautions_row_btn')");
					
	if(precautionsRowCount == 2) {
		buttonCont.append('<div class="col s1"><a onclick="RemovePrecautionsRow(this)" style="cursor:pointer" class="left"><i class="normal red-text text-lighten-1 material-icons '+desktopDisplayClass+'">remove_circle</i><div class="mobile-icons remove-icon '+iosDisplayClass+'">_</div></a></div>');
	}
	
	SendDropDownInfo("TAKE5_Precautions","precautions_dropdown_"+precautionsRowCount);
}

function AddCostCodeRow(element) {
	var buttonCont = $("#"+element).parent().parent();	
	costCodeRowCount++;
	
	//$('#cost_code_table').append('<tr><td class="blockLabel"><label>Cost Code:</label></td><td class="blockInput"><select id="take5_cost_code_dropdown_'+costCodeRowCount+'" databaseColumn="CostCodeDropDown'+costCodeRowCount+'" elementType="select" class="browser-default blockInput formElement tableDD" VirtualList="TAKE5_CostCodes" loadLast="true"></select></td><td class="blockLabel"><label>Est. Budget Qty:</label></td><td class="blockInput"><input class="formElement" type="text" id="take5_budget_qty_'+costCodeRowCount+'" databaseColumn="BudgetQty_'+costCodeRowCount+'" elementType="textbox"></td><td class="blockLabel"><label>Crew Goal:</label></td><td class="blockInput"><input class="formElement" type="text" id="take5_crew_goal_'+costCodeRowCount+'" databaseColumn="CrewGoal_'+costCodeRowCount+'" elementType="textbox"></td></tr>');
	buttonCont.before('<div class="row"><div class="input-field col l3 m3 s3 offset-l1"><input id="take5_cost_code_dropdown_'+costCodeRowCount+'" type="text" databaseColumn="CostCodeDropDown'+costCodeRowCount+'" elementType="textbox" class="formElement"><label for="take5_cost_code_dropdown_'+costCodeRowCount+'">Cost Code</label></div><div class="input-field col l3 m3 s3"><input class="formElement" type="text" id="take5_budget_qty_'+costCodeRowCount+'" databaseColumn="BudgetQty'+costCodeRowCount+'" elementType="textbox"><label for="take5_budget_qty_'+costCodeRowCount+'">Est. Budget Qty</label></div><div class="input-field col l3 m3 s3"><input class="formElement" type="text" id="take5_crew_goal_'+costCodeRowCount+'" databaseColumn="CrewGoal'+costCodeRowCount+'" elementType="textbox"><label for="take5_crew_goal_'+costCodeRowCount+'">Crew Goal</label></div></div>');
	$("#take5_cost_code_dropdown_" + (costCodeRowCount - 1)).attr("executeFunction", "AddCostCodeRow('add_cost_code_row_btn')");
	
	if(costCodeRowCount == 2) {
		buttonCont.append('<div class="col s1"><a onclick="RemoveCostCodeRow(this)" style="cursor:pointer" class="left"><i class="normal red-text text-lighten-1 material-icons '+desktopDisplayClass+'">remove_circle</i><div class="mobile-icons remove-icon '+iosDisplayClass+'">_</div></a></div>');		
	}
	
	waitForFinalLoadCount--;
	CheckLoadCount();

	//SendDropDownInfo("TAKE5_CostCodes","take5_cost_code_dropdown_"+costCodeRowCount);
}

function AddCrewMember(element) {
	var buttonCont = $("#"+element).parent().parent();	
	crewMemberCount++;

	buttonCont.before('<div class="col l3 m3 s3 '+((crewMemberCount % 3 == 1) ? "offset-l1" : "" )+'"><label>Select an option</label><select id="crew_initials_dropdown_'+crewMemberCount+'" databaseColumn="CrewInitialsDropDown'+crewMemberCount+'" elementType="select" class="browser-default formElement" VirtualList="Employees" loadLast="true"></select><div class="row"><div class="col l12 m12 s12 initialsCont formElement formImage"><div onclick="callInitials(\'CrewInitials'+crewMemberCount+'\')" style="font-style:italic" type="initials" class="CrewInitials'+crewMemberCount+' initialsBox" id="crew_initials_'+crewMemberCount+'" picHeight="31" picWidth="58" databaseColumn="CrewInitials'+crewMemberCount+'" initialsTrigger="true"></div></div></div></div>');
	$("#crew_initials_dropdown_" + (crewMemberCount - 1)).attr("executeFunction", "AddCrewMember('add_crew_member_btn')");
	
	if(crewMemberCount == 2) {
		buttonCont.append('<div class="col s1"><a onclick="RemoveCrewMember(this)" style="cursor:pointer" class="left"><i class="normal red-text text-lighten-1 material-icons '+desktopDisplayClass+'">remove_circle</i><div class="mobile-icons remove-icon '+iosDisplayClass+'">_</div></a></div>');
	}

	SendDropDownInfo("Employees","crew_initials_dropdown_"+crewMemberCount);
}

function RemoveTaskRow(element) {
	var buttonCont = $(element).parent().parent();
	taskRowCount--;
	
	buttonCont.prev().remove();
	$("#task_dropdown_" + taskRowCount).removeAttr("executeFunction");
	
	(taskRowCount <= 1) ? $(element).parent().remove() : false;
}

function RemoveChallengesRow(element) {
	var buttonCont = $(element).parent().parent();
	challengesRowCount--;
	
	buttonCont.prev().remove();
	$("#challenges_dropdown_" + challengesRowCount).removeAttr("executeFunction");
	
	(challengesRowCount <= 1) ? $(element).parent().remove() : false;
}

function RemovePrecautionsRow(element) {
	var buttonCont = $(element).parent().parent();
	precautionsRowCount--;
	
	buttonCont.prev().remove();
	$("#precautions_dropdown_" + precautionsRowCount).removeAttr("executeFunction");
	
	(precautionsRowCount <= 1) ? $(element).parent().remove() : false;
}

function RemoveCostCodeRow(element) {
	var buttonCont = $(element).parent().parent();
	costCodeRowCount--;
	
	buttonCont.prev().remove();
	$("#take5_cost_code_dropdown_" + costCodeRowCount).removeAttr("executeFunction");
	
	(costCodeRowCount <= 1) ? $(element).parent().remove() : false;
}

function RemoveCrewMember(element) {
	var buttonCont = $(element).parent().parent();
	crewMemberCount--;
	
	buttonCont.prev().remove();
	$("#crew_initials_dropdown_" + crewMemberCount).removeAttr("executeFunction");
	
	(crewMemberCount <= 1) ? $(element).parent().remove() : false;
}

function RemoveAllRows() {
	
	for(var i = taskRowCount; i > 1; i--) {
		$("#task_dropdown_" + i).parent().parent().remove();
	}
	for(var i = challengesRowCount; i > 1; i--) {
		$("#challenges_dropdown_" + i).parent().parent().remove();
	}
	for(var i = precautionsRowCount; i > 1; i--) {
		$("#precautions_dropdown_" + i).parent().parent().remove();
	}
	for(var i = costCodeRowCount; i > 1; i--) {
		$("#take5_cost_code_dropdown_" + i).parent().next().next().remove();
		$("#take5_cost_code_dropdown_" + i).parent().next().remove();
		$("#take5_cost_code_dropdown_" + i).parent().remove();
	}
	for(var i = crewMemberCount; i > 1; i--) {
		$("#crew_initials_dropdown_" + i).parent().parent().remove();
	}
	
	taskRowCount		= 1;
	challengesRowCount	= 1;
	precautionsRowCount = 1;
	costCodeRowCount	= 1;	
	crewMemberCount	= 1;
	
	$(".btn-cont").each(function() {
		var element = $(this);
		
		element.find('div:nth-child(2n)').remove();
	});
	
	$('#remove_task_btn').remove();
	$('#remove_challenges_btn').remove();
	$('#remove_precautions_btn').remove();
	$('#remove_cost_code_btn').remove();
	$('#remove_crew_member_btn').remove();
}









