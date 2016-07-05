/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/MENU/JS
	File Name:			page_navigation.js
=============================================================*/

var includedFilesArray = [];

function NavigateToPage(pageName) {
	
	if(pageName != "na") {
		switch(pageName) {
			
			case "logout":
				LogOut();
			break;
			
			case "planning":
				window.open(ruIP + ruPort + "planning/menu");
			break;
			
			case "bi":
				window.open(ruIP + ruPort + "fresnillo_bi/");
			break;
			
			case "help":
				window.open(ruIP + ruPort + "help/");
			break;
			
			default:
				if(pageName.indexOf('/') == -1) {
					$("#code_receiver").load('../' + pageName + '/' + pageName + '.html', function() {
						ReloadIncludedFiles();
					});
					document.cookie = 'currentPage='+pageName+'; path=/';
				}
				else {
					var pageNameArr = pageName.split('/');
					$("#code_receiver").load('../' + pageName + '/' + pageNameArr[(pageNameArr.length - 1)] + '.html', function() {
						ReloadIncludedFiles();
					});
					document.cookie = 'currentPage='+pageName+'; path=/';
				}
		}
	}	
}

function LogOut() {
	EraseCookies();

	window.location.replace("../");
}

function ReloadIncludedFiles() {
	
	if(includedFilesArray.length > 0) {
		for(var key in includedFilesArray) {
			includedFilesArray[key].remove();
		}
	}
	
	includedFilesArray = [];
	
	$("#code_receiver link").each(function() {
		var element = $(this)[0];
		includedFilesArray.push(element);
	});
	
	$("#code_receiver script").each(function() {
		var element = $(this)[0];
		includedFilesArray.push(element);
	});
}

























