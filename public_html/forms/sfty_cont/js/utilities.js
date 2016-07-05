
$(document).ready(function () {
	$("#topics_select").multiselect({
		selectedText: "# of # selected"
	});    
	
	$("#topics_select").change(function() {
		var topicsArr = $("#topics_select").val();
		
		$('#select_options textarea').html("");
		if(topicsArr.length != null) {				
			for(var i = 1; i<= topicsArr.length; i++ ) {
				$('#select_options textarea').append(topicsArr[i-1] + "\n");
			}
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