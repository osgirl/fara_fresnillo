$(document).ready(function () {	
	$('.cbwe').change(function(event){
		event.preventDefault();
		
		checkBoxID = $(this).attr("id");

		if($(this).is(":checked")) {
			var htmlToAdd = $('<textarea class="createdTextArea" name="' + checkBoxID + '_Comments" id="' + checkBoxID + '_Comments"></textarea>');
			$(this).parent().after(htmlToAdd);
		}
		else {
			$(this).parent().next().remove();
		}
	});
});

function createTextArea(element){
		
		checkBoxID = $(element).attr("id");
		
		var htmlToAdd = $('<textarea class="createdTextArea" name="' + checkBoxID + '_Comments" id="' + checkBoxID + '_Comments"></textarea>');
		$(element).parent().after(htmlToAdd);
		
}