/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/JS
	File Name:			alerts.js
=============================================================*/

//	These functions are used to Display different alert types.
//	So far we have  Alert messages, Confirm Messages, and MISOM's EULA
//		as well as one to display for locking the UI.
//	Other alert types can be added in here.

var preloadervisible = false;

function DisplayAlert(title, message, return_funct) {
	$("#modal-alert .modal-header").html(title);
	$("#modal-alert .modal-message").html(message);
	$("#modal-alert").openModal({
		complete: function() { (return_funct) ? eval(return_funct) : false; }
	});
}

function DisplayConfirm(title, message, respondYes, respondNo) {
	$("#modal-confirm .modal-header").html(title);
	$("#modal-confirm .modal-message").html(message);
	$("#modal-confirm").openModal();
	
	$("#confirm_cancel_btn").on("click", function() {		
		if (respondNo !== undefined) {
			respondNo();
		}
	});
	
	$("#yes_confirm_btn").on("click", function() {
		respondYes();
	});
	
	$("#no_confirm_btn").on("click", function() {		
		if (respondNo !== undefined) {
			respondNo();
		}
	});
}

function DisplayUserAgreement() {
	$("#modal-agreement").openModal();
}

function DisplayPreloader(title, value) {
	if(value) {
		if(preloadervisible) {
			UpdatePreloader(title, value);
		}
		else {
			preloadervisible = true;
			$("#modal-preloader-det .modal-header").html(title);
			$("#modal-preloader-det .determinate").css({"width": value + "%"});
		
			$('#modal-preloader-det').openModal({
				dismissible:	false,	// Modal can be dismissed by clicking outside of the modal
				opacity:		.7		// Opacity of modal background
			});
		}
	}
	else {
		LockForService(title);
	}
}

function UpdatePreloader(title, value) {
	$("#modal-preloader-det .modal-header").html(title);
	$("#modal-preloader-det .determinate").css({"width": value + "%"});
}

function ClosePreloader() {
	$('#modal-preloader-det').closeModal();
	preloadervisible = false;
}

function LockForService(title) {
	title ? $("#modal-preloader-ind .modal-header").html(title) : false;
	
	$('#modal-preloader-ind').openModal({
		dismissible:	false,	// Modal can be dismissed by clicking outside of the modal
		opacity:		.7		// Opacity of modal background
	});
}

function ServiceComplete() {
	$('#modal-preloader-ind').closeModal();
}

function SendToLogin(title, message) {
	$("#modal-alert .modal-header").html(title);
	$("#modal-alert .modal-message").html(message);
	$("#modal-alert").openModal({
		dismissible:	true,
		complete:		function() { LogOut(); }
	});	
}

function NameDocumentShow(title, accept_funct) {
	$("#modal-document-name .modal-header").html(title);
	$("#modal-document-name #submit_document_name").val("");
	$("#modal-document-name #submit_document_name").attr("onclick", accept_funct);
	$("#modal-document-name").openModal({
		dismissible:	false
	});		
}

function UserSettings() {
	$("#modal_display_name").val(UserData[0].DisplayName);	
	$("#modal_display_name").change();
	$('#modal-user-settings').openModal();
}









