var rowIndex = 0;
var rowIndex2 = 0;

function AddInspRow() {
	rowIndex++;

	$("#ir" + (rowIndex-1)).after('<div class="inspectedRows" id="ir' + rowIndex +'"><input type="text" class="placesInspected" placeholder="'+ (rowIndex+1) +'."></input><select multiple class="hazardSelect" value="Hazards Detected:"><option id="h1">Chemicals</option><option id="h2">Combustible Storage</option><option id="h3">Conveyors / Pull Cords</option><option id="h4">Cutting / Gauges / Caps</option><option id="h5">Dials / Gauges</option><option id="h6">Electrical Cords</option><option id="h7">Electrical Installations</option><option id="h8">Environment</option><option id="h9">Exits / Egress</option><option id="h10">Extinguishers - Annual</option><option id="h11">Extinguishers - Monthly</option><option id="h12">Eye Wash / Showers</option><option id="h13">Fall Protection</option><option id="h14">First-aid Materials</option><option id="h15">Fixed / Portable Ladders</option><option id="h16">Flammable Storage</option><option id="h17">Floors / Walkways</option><option id="h18">Grinder / Guards / Rests</option><option id="h19">Ground Checks</option><option id="h20">Ground Conditions</option><option id="h21">Guards in Place</option><option id="h22">Hand Tools</option><option id="h23">Housekeeping</option><option id="h24">Labels - Legible</option><option id="h25">Lifting Gear</option><option id="h26">Lighting / Emergency</option><option id="h27">Material Handling</option><option id="h28">Missing Knock Out Plugs</option><option id="h29">Open Holes</option><option id="h30">Pipe Labeling</option><option id="h31">Handrails / Toe boards</option><option id="h32">Oxy / Acetylene Welding</option><option id="h33">Power Tools</option><option id="h34">Proper PPE</option><option id="h35">Ramps / Roads / Berms</option><option id="h36">Safety Hose Clips</option><option id="h37">Signs / Barricades</option><option id="h38">Stacking / Storage</option><option id="h39">Stairs / Stairways</option><option id="h40">Ventilation</option><option id="h41">Welding / Cables / Shield</option><option id="h42">Whip Checks</option></select></div>');

	if(rowIndex == 1) {
		$('#add_row_btn').after('<input type="button" id="remove_row_btn" class="smallbtn" value="Remove Row">');
		
		$('#remove_row_btn').on('click', function(event){
			rowIndex--;
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

function AddCorrRow() {
	rowIndex2++;

	$("#ar" + (rowIndex2-1)).after('<div class="actionRows" id="ar' + rowIndex2 + '"><input type="text" class="actionTaken" placeholder="' + (rowIndex2+1) +'."></input></div>');

	if(rowIndex2 == 1) {
		$('#add_row_btn2').after('<input type="button" id="remove_row_btn2" class="smallbtn" value="Remove Row">');
		
		$('#remove_row_btn2').on('click', function(event){
			rowIndex2--;
			$("#ar" + (rowIndex2+1)).remove();
	
			if(rowIndex2 == 0) {
				$('#remove_row_btn2').remove();
			}
		});
	}		
}