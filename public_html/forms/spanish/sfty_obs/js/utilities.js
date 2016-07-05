function ToggleTheme() {
	$("*").toggleClass("altTheme");
}

$(document).ready(function () {
    $('#menu_toggle').on('click', function(event){
    	event.preventDefault();
    	// create menu variables
    	var slideoutMenu = $('.slideout-menu');
		var menuItems = $('.moveable');
		var navigation = $('#navigation');
    	
    	// slide menu
    	if (slideoutMenu.hasClass("closed")) {
			console.log("Opening");
			menuItems.css({"opacity":"1.0"});
	    	slideoutMenu.animate({
		    	left: "0px"
	    	}, 250);
			navigation.animate({"left":"300px" }, 250);
    	} else {
			menuItems.css({"opacity":"0"});
	    	slideoutMenu.animate({
		    	left: "-250px"
	    	}, 250);
			navigation.animate({"left":"50px"}, 250);
    	}
		
		// toggle closed class
    	slideoutMenu.toggleClass("closed");		
    });
	
	$('#forms_list').mouseenter(function(event){
		event.preventDefault();
		var htmlToAdd = $('<a href="../f500023/"><li><div id="f500023_div"></div>5000-23</li></a><a href="../sfty_cont/"><li><div id="sfty_cont_div"></div>Contacto Personal</li></a><a href="../wkpl_insp/"><li><div id="wkpl_insp_div"></div>Inspecci&oacuten de Area de Trabajo</li></a>');
		
		$('#forms_list').append(htmlToAdd);
	});
	
	$('#forms_list').mouseleave(function(event){
		event.preventDefault();
		$('#forms_list').html('<li>Observaciones de Seguridad</li>');
	});
});