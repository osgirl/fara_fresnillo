var tempRoleFilter;
var tempRoleFilterId;
var tempUserName;

$(document).ready(function () {
	
	var cookieString = document.cookie.split(";");
	
	var cookieArray = cookieString[0].split("=");	
	tempUserName = cookieArray[1];
	
	cookieArray = cookieString[1].split("=");
	tempRoleFilterId = cookieArray[1];
	
	cookieArray = cookieString[2].split("=");
	tempRoleFilter = cookieArray[1];
	
	$("#logged-in_user").html(tempUserName + " is logged in as " + tempRoleFilter);
	
	$("#spvsr").val(tempUserName);
	//document.getElementById("spvsr_time").valueAsTime = new Time();
});