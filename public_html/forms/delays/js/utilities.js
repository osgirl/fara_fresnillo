/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/FORMS/DELAYS/JS
	File Name:			utilities.js
=============================================================*/

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
	
	setTimeout(function() { loadDefaultFields(); }, 2000);
	
	setTimeout(function() {
		(!thisFormLocked) ? canDisableElements = false : canDisableElements = true;
		
		$('#worktype_list').unbind('change');
		$("#worktype_list").on('change', function(){
			//Params: Table Name, element id, column name, filtered by column
			SendDropDownInfo("EquipmentByWorkType","equipment_list","equipment_name","work_type_name");
			SendDropDownInfo("StatusCodes_equip_worktype","reason_code_list","status_reason_code","work_type_name");
		});
		
	}, 2500);
});










