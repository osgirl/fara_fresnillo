/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/FORMS/JS
	File Name:			load_form.js
=============================================================*/

var formLocked   = true;
var tempFormName = "";
var tempdx       = "";
var includedFormFilesArray = [];

function CloseForm() {
	LoadForm(tempFormName, tempdx);
}

function LoadForm(formName, dx) {
	formForPrint = formName;
	$('link[rel=stylesheet][href~="'+currentFormStyle+'"]').remove();
	
	tempFormName = formName;
	tempdx       = dx;
	if(formName != 'na' && formName != 'logout') {		
		$("#form_receiver").load('../forms/' + formName + '/' + formName + '.html', function() {
			formLoaded = true;
			ReloadIncludedFormFiles();
			if(dx != null) {
				setTimeout(function() {
					injectData(dx,"loadform","initial");
				}, 3000);
			}
		});
	}
}

function ReloadIncludedFormFiles() {
	
	if(includedFormFilesArray.length > 0) {
		for(var key in includedFormFilesArray) {
			includedFormFilesArray[key].remove();
		}
	}
	
	includedFormFilesArray = [];
	
	$("#form_receiver link").each(function() {
		var element = $(this)[0];
		includedFormFilesArray.push(element);
	});
	
	$("#form_receiver script").each(function() {
		var element = $(this)[0];
		includedFormFilesArray.push(element);
	});
}