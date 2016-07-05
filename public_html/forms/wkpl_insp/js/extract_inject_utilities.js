var rowIndex  = 0;
var rowIndex2 = 0;

var dynamicTables = [{"startkey":"WorkPlaceInspected", "endkey":"h42", "rowvar":1, "fcn":"#add_row_btn"}, {"startkey":"actionTaken", "endkey":"na", "rowvar":2, "fcn":"#add_row_btn2"}];

$(document).ready(function () {
	
	$('#add_row_btn').on('click', function(event){
		rowIndex++;
		console.log(rowIndex);

		$("#ir" + (rowIndex-1)).after('<div class="inspectedRows" avoid="true" id="ir' + rowIndex +'" removeOnReset="true"><input type="text" class="placesInspected" loadLast="true" elementType="textbox" executeStandardFunction="addWorkPlace" databaseColumn="WorkPlaceInspected_'+(rowIndex)+'" placeholder="'+ (rowIndex+1) +'." name="WorkPlaceInspected_' + (rowIndex) + '"></input><select multiple class="hazardSelect" value="Hazards Detected:" avoid="true"><option avoavoid="true" rowIndex="'+(rowIndex)+'" id="true" avoid="true" id="h1_' + (rowIndex) + '">Chemicals</option><option avoid="true" rowIndex="'+(rowIndex)+'" id="h2_' + (rowIndex) + '">Combustible Storage</option><option avoid="true" rowIndex="'+(rowIndex)+'"  id="h3_' + (rowIndex) + '">Conveyors / Pull Cords</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h4_' + (rowIndex) + '">Cutting / Gauges / Caps</option><option avoid="true" rowIndex="'+(rowIndex)+'" id="h5_' + (rowIndex) + '">Dials / Gauges</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h6_' + (rowIndex) + '">Electrical Cords</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h7_' + (rowIndex) + '">Electrical Installations</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h8_' + (rowIndex) + '">Environment</option><option avoid="true" rowIndex="'+(rowIndex)+'" id="h9_' + (rowIndex) + '">Exits / Egress</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h10_' + (rowIndex) + '">Extinguishers - Annual</option><option rowIndex="'+(rowIndex)+'"  avoid="true" id="h11_' + (rowIndex) + '">Extinguishers - Monthly</option><option avoid="true" rowIndex="'+(rowIndex)+'"  id="h12_' + (rowIndex) + '">Eye Wash / Showers</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h13_' + (rowIndex) + '">Fall Protection</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h14_' + (rowIndex) + '">First-aid Materials</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h15_' + (rowIndex) + '">Fixed / Portable Ladders</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h16_' + (rowIndex) + '">Flammable Storage</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h17_' + (rowIndex) + '">Floors / Walkways</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h18_' + (rowIndex) + '">Grinder / Guards / Rests</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h19_' + (rowIndex) + '">Ground Checks</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h20_' + (rowIndex) + '">Ground Conditions</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h21_' + (rowIndex) + '">Guards in Place</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h22_' + (rowIndex) + '">Hand Tools</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h23_' + (rowIndex) + '">Housekeeping</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h24_' + (rowIndex) + '">Labels - Legible</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h25_' + (rowIndex) + '">Lifting Gear</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h26_' + (rowIndex) + '">Lighting / Emergency</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h27_' + (rowIndex) + '">Material Handling</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h28_' + (rowIndex) + '">Missing Knock Out Plugs</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h29_' + (rowIndex) + '">Open Holes</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h30_' + (rowIndex) + '">Pipe Labeling</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h31_' + (rowIndex) + '">Handrails / Toe boards</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h32_' + (rowIndex) + '">Oxy / Acetylene Welding</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h33_' + (rowIndex) + '">Power Tools</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h34_' + (rowIndex) + '">Proper PPE</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h35_' + (rowIndex) + '">Ramps / Roads / Berms</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h36_' + (rowIndex) + '">Safety Hose Clips</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h37_' + (rowIndex) + '">Signs / Barricades</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h38_' + (rowIndex) + '">Stacking / Storage</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h39_' + (rowIndex) + '">Stairs / Stairways</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h40_' + (rowIndex) + '">Ventilation</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h41_' + (rowIndex) + '">Welding / Cables / Shield</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h42_' + (rowIndex) + '">Whip Checks</option></select></div>');
	
		if(rowIndex == 1) {
			$('#add_row_btn').after('<input type="button" avoid="true" id="remove_row_btn" class="smallbtn" value="Remove Row">');
			
			$('#remove_row_btn').on('click', function(event){
				rowIndex--;
				console.log(rowIndex);
				$("#ir" + (rowIndex+1)).remove();
		
				if(rowIndex == 0) {
					$('#remove_row_btn').remove();
				}
			});
		}
		
		$(".hazardSelect").multiselect({
			selectedText: "# of # selected"
		});		
	});
	
	$('#add_row_btn2').on('click', function(event){
		rowIndex2++;
		console.log(rowIndex2);

		$("#ar" + (rowIndex2-1)).after('<div class="actionRows" avoid="true" id="ar' + rowIndex2 + '" removeOnReset="true"><input type="text" class="actionTaken" loadLast="true" elementType="textbox" executeStandardFunction="addCorrectiveAction" databaseColumn="CorrectiveAction_'+rowIndex2+'" id="actionTaken_' + rowIndex2 + '" name="actionTaken_'+ rowIndex2 + '" placeholder="' + (rowIndex2+1) +'."></input></div>');
	
		if(rowIndex2 == 1) {
			$('#add_row_btn2').after('<input type="button" avoid="true" id="remove_row_btn2" class="smallbtn" value="Remove Row">');
			
			$('#remove_row_btn2').on('click', function(event){
				rowIndex2--;
				console.log(rowIndex2);
				$("#ar" + (rowIndex2+1)).remove();
		
				if(rowIndex2 == 0) {
					$('#remove_row_btn2').remove();
				}
			});
		}		
	});
});

function addWorkPlace()
{
	console.log("CALLED");
	rowIndex++;
	console.log(rowIndex);

	$("#ir" + (rowIndex-1)).after('<div class="inspectedRows" avoid="true" id="ir' + rowIndex +'" removeOnReset="true"><input type="text" class="placesInspected" loadLast="true" elementType="textbox" executeStandardFunction="addWorkPlace" databaseColumn="WorkPlaceInspected_'+(rowIndex)+'" placeholder="'+ (rowIndex+1) +'." name="WorkPlaceInspected_' + (rowIndex) + '"></input><select multiple class="hazardSelect" value="Hazards Detected:" avoid="true"><option avoavoid="true" rowIndex="'+(rowIndex)+'" id="true" avoid="true" id="h1_' + (rowIndex) + '">Chemicals</option><option avoid="true" rowIndex="'+(rowIndex)+'" id="h2_' + (rowIndex) + '">Combustible Storage</option><option avoid="true" rowIndex="'+(rowIndex)+'"  id="h3_' + (rowIndex) + '">Conveyors / Pull Cords</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h4_' + (rowIndex) + '">Cutting / Gauges / Caps</option><option avoid="true" rowIndex="'+(rowIndex)+'" id="h5_' + (rowIndex) + '">Dials / Gauges</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h6_' + (rowIndex) + '">Electrical Cords</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h7_' + (rowIndex) + '">Electrical Installations</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h8_' + (rowIndex) + '">Environment</option><option avoid="true" rowIndex="'+(rowIndex)+'" id="h9_' + (rowIndex) + '">Exits / Egress</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h10_' + (rowIndex) + '">Extinguishers - Annual</option><option rowIndex="'+(rowIndex)+'"  avoid="true" id="h11_' + (rowIndex) + '">Extinguishers - Monthly</option><option avoid="true" rowIndex="'+(rowIndex)+'"  id="h12_' + (rowIndex) + '">Eye Wash / Showers</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h13_' + (rowIndex) + '">Fall Protection</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h14_' + (rowIndex) + '">First-aid Materials</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h15_' + (rowIndex) + '">Fixed / Portable Ladders</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h16_' + (rowIndex) + '">Flammable Storage</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h17_' + (rowIndex) + '">Floors / Walkways</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h18_' + (rowIndex) + '">Grinder / Guards / Rests</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h19_' + (rowIndex) + '">Ground Checks</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h20_' + (rowIndex) + '">Ground Conditions</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h21_' + (rowIndex) + '">Guards in Place</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h22_' + (rowIndex) + '">Hand Tools</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h23_' + (rowIndex) + '">Housekeeping</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h24_' + (rowIndex) + '">Labels - Legible</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h25_' + (rowIndex) + '">Lifting Gear</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h26_' + (rowIndex) + '">Lighting / Emergency</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h27_' + (rowIndex) + '">Material Handling</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h28_' + (rowIndex) + '">Missing Knock Out Plugs</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h29_' + (rowIndex) + '">Open Holes</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h30_' + (rowIndex) + '">Pipe Labeling</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h31_' + (rowIndex) + '">Handrails / Toe boards</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h32_' + (rowIndex) + '">Oxy / Acetylene Welding</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h33_' + (rowIndex) + '">Power Tools</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h34_' + (rowIndex) + '">Proper PPE</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h35_' + (rowIndex) + '">Ramps / Roads / Berms</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h36_' + (rowIndex) + '">Safety Hose Clips</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h37_' + (rowIndex) + '">Signs / Barricades</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h38_' + (rowIndex) + '">Stacking / Storage</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h39_' + (rowIndex) + '">Stairs / Stairways</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h40_' + (rowIndex) + '">Ventilation</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h41_' + (rowIndex) + '">Welding / Cables / Shield</option><option rowIndex="'+(rowIndex)+'" avoid="true" id="h42_' + (rowIndex) + '">Whip Checks</option></select></div>');

	if(rowIndex == 1) {
		$('#add_row_btn').after('<input type="button" avoid="true" id="remove_row_btn" class="smallbtn" value="Remove Row">');
		
		$('#remove_row_btn').on('click', function(event){
			rowIndex--;
			console.log(rowIndex);
			$("#ir" + (rowIndex+1)).remove();
	
			if(rowIndex == 0) {
				$('#remove_row_btn').remove();
			}
		});
	}
	
	$(".hazardSelect").multiselect({
		selectedText: "# of # selected"
	});
}

function addCorrectiveAction()
{
	rowIndex2++;
	console.log(rowIndex2);

	$("#ar" + (rowIndex2-1)).after('<div class="actionRows" avoid="true" id="ar' + rowIndex2 + '" removeOnReset="true"><input type="text" class="actionTaken" loadLast="true" elementType="textbox" executeStandardFunction="addCorrectiveAction" databaseColumn="CorrectiveAction_'+rowIndex2+'" id="actionTaken_' + rowIndex2 + '" name="actionTaken_'+ rowIndex2 + '" placeholder="' + (rowIndex2+1) +'."></input></div>');

	if(rowIndex2 == 1) {
		$('#add_row_btn2').after('<input type="button" avoid="true" id="remove_row_btn2" class="smallbtn" value="Remove Row">');
		
		$('#remove_row_btn2').on('click', function(event){
			rowIndex2--;
			console.log(rowIndex2);
			$("#ar" + (rowIndex2+1)).remove();
	
			if(rowIndex2 == 0) {
				$('#remove_row_btn2').remove();
			}
		});
	}	
}