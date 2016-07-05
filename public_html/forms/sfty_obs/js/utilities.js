$(document).ready(function () {

	$('.atriskBox').change(function(event){
		event.preventDefault();		
		
		var radioButtonID = $(this).attr("id");
		//Custom addition to get it DB ready.
		radioButtonID     = radioButtonID.replace("_Safe", "");
		var dbColumn      = $(this).attr("uniqueRadioId");
		
		var htmlToAdd = $('<tr><td colspan="3"><textarea class="createdTextArea" databaseColumn="' + dbColumn + '_Comments" elementType="textarea" loadLast="true" removeOnReset="true"></textarea></td></tr>');		
		
		$(this).parent().parent().after(htmlToAdd);		
		$(this).parent().addClass("atRiskOn");
	});
	
	$('.safeBox').change(function(event){
		event.preventDefault();
		
		if($(this).parent().prev().hasClass("atRiskOn")) {
			$(this).parent().parent().next().remove();
			$(this).parent().prev().removeClass("atRiskOn");
		}
	});
	
	$("#submit_button").on('click', function(){
		SubmitButtonClicked();
	});
	
	$("#reset_button").on('click', function(){
		resetElements();
	});
		
	$('#print_button').unbind('click');
	$("#print_button").on('click', function(){
			FriendlyPrintView("form_container");
	});	
});

function addTextAreaByRadio(radio) {
	var radioButtonID = $(radio).attr("id");
	radioButtonID     = radioButtonID.replace("_Safe", "");
	var dbColumn      = $(radio).attr("uniqueRadioId");
	
	var htmlToAdd = $('<tr><td colspan="3"><textarea class="createdTextArea" databaseColumn="' + dbColumn + '_Comments" elementType="textarea" loadLast="true" removeOnReset="true"></textarea></td></tr>');		
	
	$(radio).parent().parent().after(htmlToAdd);
	$(radio).parent().addClass("atRiskOn");
}