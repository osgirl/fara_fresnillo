/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/MENU/JS
	File Name:			get_menu_items.js
=============================================================*/

//	Retrieves a list of menu items to be used in the menu system.
//	The user's role will determine which items will display.
function GetMenuItems() {
	var goToPage = GetCookieValue("currentPage", "string");

	$.getJSON(ruIP + ruPort + listsDB + listEN + "read/web/MenuItems?where=\"RoleGUID = '"+ UserData[0].RoleGUID +"' AND IsActive = '1' AND Environment IN ('all','fara') ORDER BY Ordinal ASC \"", function( menuData ) {
		var menuHtmlString = "";
		
		menuHtmlString += '<li class="logo"><a href="http://www.misom.com" target="_blank" style="line-height:80px; height: 80px;"><img src="../images/MainLogo_White.png" alt="Logo" style="height: 100px; position:absolute; top: -18px; left:50px; padding:10px;"></a></i>';
				
		
		for(var key in menuData) {
			var currentItem = menuData[key];
			if(currentItem.ParentMenuItemId == null) {
				menuHtmlString += GetChildItems(menuData, currentItem);
			}
		}
		
		//console.log(menuHtmlString);

		$("#fara_menu").append(menuHtmlString);
		$(".button-collapse").sideNav({
			menuWidth: 310,
			closeOnClick: true
		});
		$('.collapsible').collapsible();
		
		
		NavigateToPage(goToPage);
	});
}

function GetChildItems(menuData, parentItem) {
	var menuHtmlString		= "";
	var childrenHtmlString	= "";
	var foundChild			= false;
	
	for(var key in menuData) {
		var currentItem = menuData[key];
		
		if(currentItem.ParentMenuItemId == parentItem.MenuGroupId) {
			foundChild = true;
			childrenHtmlString	+= GetChildItems(menuData, currentItem);
		}
	}

	if(foundChild) {
		menuHtmlString	+=	'<li class="no-padding">'
						+		'<ul class="collapsible collapsible-accordion">'
						+			'<li>'
						+				'<a class="collapsible-header waves-effect waves-white white-text" style="height: 50px; line-height: 50px;" href="#" onclick="NavigateToPage(\'' + parentItem.MenuItemURL + '\')">' + GetMenuItemDisplayName(parentItem) + '<i class="material-icons right">arrow_drop_down</i></a>'
						+				'<div class="collapsible-body">'
						+					'<ul class="black">'
						+						childrenHtmlString
						+					'</ul>'
						+				'</div>'
						+			'</li>'
						+		'</ul>'
						+	'</li>';
	}
	else {
		menuHtmlString += '<li><a class="waves-effect waves-white white-text" style="height: 50px; line-height: 50px;" href="#" onclick="NavigateToPage(\'' + parentItem.MenuItemURL + '\')">' + GetMenuItemDisplayName(parentItem) + '</a></li>';
	}
	
	return menuHtmlString;
}

//	Based on the selected language, the menu items will pull the display name from the particular column.
function GetMenuItemDisplayName(menuItem) {
	switch(language_GF) {
		case "Spanish":
			return menuItem.SpanishName;		
			break;
			
		case "English":
		default:
			return menuItem.DisplayName;
			break;
	}
}

function DisplayMenu() {
	$(".button-collapse").sideNav('show');
}







