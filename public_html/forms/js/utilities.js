/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/FORMS/JS
	File Name:			utilities.js
=============================================================*/

var formLoaded	= false;
var formForPrint = "";

function FormsButtonClicked() {
	LoadFormTabs("newForm");
}

function ResetButtonClicked() {
	(formLoaded) ? ((!formLocked) ? resetElements() : Materialize.toast("A locked form can not be reset.", 4000)) : Materialize.toast("There is no form to reset", 4000);
}

function SaveButtonClicked() {
	(formLoaded) ? ((!formLocked) ? NameDocument() : Materialize.toast("A locked form can not be saved.", 4000)) : Materialize.toast("There is no form to save", 4000);
}

function SaveDocumentButtonClicked() {
	if($("#modal-document-name #modal_document_name").val() != "") {
		SaveForm(UserData[0].PersonGUID, $("#modal-document-name #modal_document_name").val(), thisFormLocked);
	}
	else {
		DisplayAlert("Alert", "You must name your document before saving", "NameDocument()");
	}
}

function UploadButtonClicked() {
	(formLoaded) ? ((documentGuid == "") ? ((!formLocked) ? NameDocument() : Materialize.toast("A locked form can not be saved.", 4000)) : ((!formLocked) ? UpdateForm(documentGuid, UserData[0].PersonGUID, documentNickName, thisFormLocked) : Materialize.toast("A locked form can not be saved.", 4000))) : Materialize.toast("There is no form to save", 4000);
}

function PrintButtonClicked(element) {
	(formLoaded) ? ((documentGuid != "") ? FriendlyPrintView(element) : Materialize.toast("The form must be saved before it can be printed.", 4000)) : Materialize.toast("There is no form to print", 4000);
}

function NameDocument() {
	NameDocumentShow("Document Name", "SaveDocumentButtonClicked()")
}