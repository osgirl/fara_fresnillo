$(document).ready(function () {	
	$('.atriskBox').change(function(event){
		event.preventDefault();		
		
		var radioButtonID = $(this).attr("id");
		//Custom addition to get it DB ready.
		radioButtonID     = radioButtonID.replace("_Safe", "");
		
		var htmlToAdd = $('<textarea class="createdTextArea" name="' + radioButtonID + '_Comments" id="' + radioButtonID + '_Comments"></textarea>');		
		$(this).parent().after(htmlToAdd);
		
		$(this).addClass("atRiskOn");
	});
	
	$('.safeBox').change(function(event){
		event.preventDefault();
		
		if($(this).prev().hasClass("atRiskOn")) {
			$(this).parent().next().remove();
			$(this).prev().removeClass("atRiskOn");
		}
	});
});

function addTextAreaByRadio(radio)
{	
	console.log(radio);
	
	var radioButtonID = $(radio).attr("id");
	radioButtonID     = radioButtonID.replace("_Safe", "");

	var htmlToAdd = $('<textarea class="createdTextArea" name="' + radioButtonID + '_Comments" id="' + radioButtonID + '_Comments"></textarea>');		
	
	$(radio).parent().after(htmlToAdd);
	$(radio).addClass("atRiskOn");
}