/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/MENU/JS
	File Name:			utilities.js
=============================================================*/

//	Loads a particular file based on the parameters passed in.
//	So far handles .js and .css files.
function loadjscssfile(filename, filetype) {
	var fileref;
	
	if(filetype == "js") {
		fileref = document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", filename);
	}
	else if(filetype == "css") {
		fileref = document.createElement("link");
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename);
	}
	
	if(fileref) {
		document.getElementById("file_include_container").appendChild(fileref);
	}
}

//	Removes a particular file based on the parameters passed in.
//	So far handles 'js' and 'css' files.
function removejscssfile(filetype, filelocation) {
	
	if(filetype == "js") {
		$('script[src="'+filelocation+'"]').remove();
	}
	else if(filetype == "css") {
		$('link[href="'+filelocation+'"]').remove();
	}
}

function objectToQueryString(object) {	
	var queryString = "";
	
	for(var value in object) {
		if(value == "params") {
			var ParamArray = object[value];
			
			for(var key in ParamArray) {
				queryString = queryString + "&params=" + ParamArray[key];
			}
		}
		if(value == "schema") {
			queryString = queryString + "&schema=" + object[value];
		}
		
		if(value == "procedure") {
			queryString = queryString + "&procedure=" + object[value];
		}
	}	
	return queryString;
}

//	Creates and returns a unique upper case GUID.
function CreateGUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid.toUpperCase();
}

//	Locks UI for potential backend processing and/or frontend manipulating.
function LockForService(title, message) {
	$('#service-wrapper').css("display", "block");
	$('#service-wrapper').animate({opacity:1}, 200);
}

//	Unlocks the UI when backend and front end services are complete.
function ServiceComplete() {
	$('#service-wrapper').css("display", "none");
	$('#service-wrapper').css("opacity", 0);
}









