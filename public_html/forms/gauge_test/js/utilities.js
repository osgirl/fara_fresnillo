/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Application Name:	FARA
	Directory:			FARA/FORMS/GAUGE_TEST/JS
	File Name:			utilities.js
=============================================================*/

(typeof formLocked === "undefined") ? thisFormLocked = false : thisFormLocked = formLocked;

$(document).ready(function () {
	
	setTimeout(function() { loadDefaultFields(); }, 2000);
	
	setTimeout(function() {		
		(!thisFormLocked) ? canDisableElements = false : canDisableElements = true;
		InitializeGauges();
	}, 2500);
});

function InitializeGauges() {

	//DESTROY AND RE-INITIALIZE START SHIFT HYDRAULIC GAUGE AND SLIDER
	
	$('#start_shift_hydraulic_gauge').jqxLinearGauge('destroy');

	if($("#start_shift_hydraulic_gauge").length == 0) {
		$("#gaugeWidget1").append('<div id="start_shift_hydraulic_gauge" style="margin-left:calc(50% - 75px)" class="formElement" elementType="linearGauge" databaseColumn="StartShiftHydraulicGauge"></div>');
	}
	
	 $('#start_shift_hydraulic_gauge').jqxLinearGauge({
		orientation: 'vertical',
		labels: { interval: .25 },
		ticksMajor: { size: '10%', interval: .25 },
		ticksMinor: { size: '5%', interval: .125, style: { 'stroke-width': 1, stroke: '#aaaaaa'} },
		max: 1,
		min: 0,
		value: 0,
		width: 150,
		pointer: { size: '6%' },
		colorScheme: 'scheme05',
		animationDuration: 500
	});
	
	$('#start_shift_hydraulic_slider').jqxSlider('destroy');

	if($("#start_shift_hydraulic_slider").length == 0) {
		$("#gaugeWidget1").append('<div id="start_shift_hydraulic_slider" class="formElement" elementType="linearGaugeSlider" databaseColumn="StartShiftHydraulicSlider"></div>');
	}
	
	$('#start_shift_hydraulic_slider').jqxSlider({ min: 0, max: 1, mode: 'fixed', ticksFrequency: .125, width: 200, value: 0,  showButtons: true, step: .125 });
	$('#start_shift_hydraulic_slider').on("change", function () {
		$('#start_shift_hydraulic_gauge').jqxLinearGauge('value', $('#start_shift_hydraulic_slider').jqxSlider('value'));
	});
	$('#start_shift_hydraulic_gauge').jqxLinearGauge('value', 0);
	
	
	
	
	//DESTROY AND RE-INITIALIZE END SHIFT HYDRAULIC GAUGE AND SLIDER
	
	$('#end_shift_hydraulic_gauge').jqxLinearGauge('destroy');

	if($("#end_shift_hydraulic_gauge").length == 0) {
		$("#gaugeWidget2").append('<div id="end_shift_hydraulic_gauge" style="margin-left:calc(50% - 75px)" class="formElement" elementType="linearGauge" databaseColumn="EndShiftHydraulicGauge"></div>');
	}
	
	$('#end_shift_hydraulic_gauge').jqxLinearGauge({
		orientation: 'vertical',
		labels: { interval: .25 },
		ticksMajor: { size: '10%', interval: .25 },
		ticksMinor: { size: '5%', interval: .125, style: { 'stroke-width': 1, stroke: '#aaaaaa'} },
		max: 1,
		min: 0,
		value: 0,
		width: 150,
		pointer: { size: '6%' },
		colorScheme: 'scheme05',
		animationDuration: 500
	});
	
	$('#end_shift_hydraulic_slider').jqxSlider('destroy');

	if($("#end_shift_hydraulic_slider").length == 0) {
		$("#gaugeWidget2").append('<div id="end_shift_hydraulic_slider" class="formElement" elementType="linearGaugeSlider" databaseColumn="EndShiftHydraulicSlider"></div>');
	}
	
	$('#end_shift_hydraulic_slider').jqxSlider({ min: 0, max: 1, mode: 'fixed', ticksFrequency: .125, width: 200, value: 0,  showButtons: true, step: .125 });
	$('#end_shift_hydraulic_slider').on("change", function () {
		$('#end_shift_hydraulic_gauge').jqxLinearGauge('value', $('#end_shift_hydraulic_slider').jqxSlider('value'));
	});
	$('#end_shift_hydraulic_gauge').jqxLinearGauge('value', 0);
	
	
	
	
	//DESTROY AND RE-INITIALIZE FUEL GAUGE AND SLIDER
	
	$('#fuel_gauge').jqxGauge('destroy');

	if($("#fuel_gauge").length == 0) {
		$("#gaugeWidget3").append('<div id="fuel_gauge" class="formElement" elementType="linearGauge" databaseColumn="FuelGauge"></div>');
	}
	
	$('#fuel_gauge').jqxGauge({
		ranges: [{ startValue: 0, endValue: .125, style: { fill: '#e53d37', stroke: '#e53d37' }, startDistance: 0, endDistance: 0 },
				 { startValue: .125, endValue: .5, style: { fill: '#fad00b', stroke: '#fad00b' }, startDistance: 0, endDistance: 0 },
				 { startValue: .5, endValue: 1, style: { fill: '#4cb848', stroke: '#4cb848' }, startDistance: 0, endDistance: 0}],
		cap: { size: '5%', style: { fill: '#2e79bb', stroke: '#2e79bb'} },
		border: { style: { fill: '#8e9495', stroke: '#7b8384', 'stroke-width': 1 } },
		ticksMinor: { interval: .125, size: '5%' },
		ticksMajor: { interval: .25, size: '10%' },
		max: 1,
		min: 0,
		value: 0,      
		labels: { position: 'outside', interval: .25 },
		pointer: { style: { fill: '#2e79bb' }, width: 5 },
		animationDuration: 500
	});
	
	$('#fuel_slider').jqxSlider('destroy');

	if($("#fuel_slider").length == 0) {
		$("#gaugeWidget3").append('<div id="fuel_slider" class="formElement" elementType="linearGaugeSlider" databaseColumn="FuelSlider"></div>');
	}
	
	$('#fuel_slider').jqxSlider({ min: 0, max: 1, mode: 'fixed', ticksFrequency: .125, width: 350, value: 0,  showButtons: true, step: .125 });
	$('#fuel_slider').on("change", function () {
		$('#fuel_gauge').jqxGauge('value', $('#fuel_slider').jqxSlider('value'));
	});
	$('#fuel_gauge').jqxGauge('value', 0);
	
	
	
	
	//DESTROY AND RE-INITIALIZE ELECTRIC SOURCE DISTANCE GAUGE AND SLIDER
	
	$('#electric_source_distance_gauge').jqxLinearGauge('destroy');

	if($("#electric_source_distance_gauge").length == 0) {
		$("#gaugeWidget4").append('<div id="electric_source_distance_gauge" style="margin-left:calc(50% - 75px)" class="formElement" elementType="linearGauge" databaseColumn="ElectricSourceDistanceGauge"></div>');
	}
	
	 $('#electric_source_distance_gauge').jqxLinearGauge({
		orientation: 'vertical',
		labels: { interval: 25 },
		ticksMajor: { size: '10%', interval: 12.5 },
		ticksMinor: { size: '5%', interval: 6.25, style: { 'stroke-width': 1, stroke: '#aaaaaa'} },
		max: 50,
		min: 0,
		value: 0,
		width: 150,
		pointer: { size: '6%' },
		colorScheme: 'scheme05',
		animationDuration: 500
	});
	
	$('#electric_source_distance_slider').jqxSlider('destroy');

	if($("#electric_source_distance_slider").length == 0) {
		$("#gaugeWidget4").append('<div id="electric_source_distance_slider" class="formElement" elementType="linearGaugeSlider" databaseColumn="ElectricSourceDistanceSlider"></div>');
	}
	
	$('#electric_source_distance_slider').jqxSlider({ min: 0, max: 50, mode: 'fixed', ticksFrequency: 6.25, width: 200, value: 0,  showButtons: true, step: 6.25 });
	$('#electric_source_distance_slider').on("change", function () {
		$('#electric_source_distance_gauge').jqxLinearGauge('value', $('#electric_source_distance_slider').jqxSlider('value'));
	});
	$('#electric_source_distance_gauge').jqxLinearGauge('value', 0);
}









