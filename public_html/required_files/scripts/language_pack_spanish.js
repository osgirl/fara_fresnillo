/*============================================================
	Property of:		MISOM TECHNOLOGIES
	Developer:			AARON MCCOLOUGH
	Directory:			REQUIRED FILES
	File Name:			language_pack_spanish.js
=============================================================*/

var languagePack = (function() {

	//---------- MAIN LANGUAGE PACK OBJECT ----------
	var languagePack = {};


	//----------   MESSAGES   ----------
	languagePack.message = {};

	languagePack.message.error					= "Error!";																					//Error
	languagePack.message.alert					= "Alerta!";																				//Alert
	languagePack.message.success				= "&Eacute;xito!";																			//Success
	languagePack.message.confirm				= "Confirmar";																				//Confirm
	languagePack.message.incorrectLogin			= "Tu login fue incorrecto.";																//Your login was incorrect
	languagePack.message.confirmRecordDelete	= "&iquest;Seguro que quiere eliminar este registro?";										//Are you sure you want to delete this record?
	languagePack.message.confirmPassReset		= "&iquest;Seguro que desea restablecer esta contrase&ntilde;a usuarios?";					//Are you sure you want to reset this users password?
	languagePack.message.unsavedChanges			= "Seguro que quiere eliminar este registro, &iquest;desea continuar sin guardar?";			//You have unsaved changes, do you want to continue without saving?
	languagePack.message.recordsStored			= "Los registros han sido guardados en la base de datos.";									//Records Stored
	languagePack.message.recordsUpdated			= "Los registros fueron actualizados.";														//Records Updated
	languagePack.message.recordsNotStored		= "Los registros no fueron creados.";														//Records not Stored
	languagePack.message.recordsNotUpdated		= "Los registros no fueron actualizados.";													//Records not Updated
	languagePack.message.recordsDeleted			= "El registro ha sido borrado.";															//Record Deleted
	languagePack.message.displayName			= "Usted debe asignar un nombre para mostrar.";												//You must have a display name.
	languagePack.message.oldPass				= "No ha introducido la contrase&ntilde;a actual correctamente.";							//You did not enter your current password correctly.
	languagePack.message.newPass				= "Su nueva contrase&ntilde;a debe tener al menos 6 caracteres.";							//Your new password must be atleast 6 characters long.
	languagePack.message.filtersSelected		= "Aseg&uacute;rese de que todo los filtros se seleccionan.";								//Make sure all filters are selected.
	languagePack.message.youHave				= "Usted tiene";																			//You have
	languagePack.message.plansToReview			= "planes para revisar.";																	//plans to review.
	languagePack.message.selectProcess			= "Usted debe seleccionar un proceso.";														//You must select a process.
	languagePack.message.selectMethod			= "Usted debe seleccionar un m&eacute;todo.";												//You must select a method.
	languagePack.message.noPlansAssigned		= "No hay planes asignados a";																//No plans assigned
	languagePack.message.forTheWeekOf			= "para la Semana de";																		//for the week of
	languagePack.message.submittingPlan			= "El someter bloquear&aacute; el plan actual. &iquest;Desea continuar?";					//About to submit the plan, do you wish to continue?
	languagePack.message.cannotSubmitPlan		= "No se puede presentar el plan. Actualmente no existe Superintendente asignado a la";		//You cannot submit the plan as there is no superintendent assigned to the current area.
	languagePack.message.noPlans				= "No existen planes aprobados para esta fecha y el lugar.";								//No approved plans exist for this date and location.
	languagePack.message.noSameMethods			= "No se puede tener diferentes m&eacute;todos asignados al mismo cambio.";					//You cannot assign different methods to the same shift.
	languagePack.message.oneDayStep				= "Debe seleccionar al menos un d&iacute;a por actividad.";									//You must select at least one day per activity.
	languagePack.message.oneStepShift			= "No se puede asignar un actividad para un cambio m&aacute;s de una vez.";					//You cannot assign an activity to a shift more than once.
	languagePack.message.needStep				= "Usted necesita agregar un actividad antes de poder presentar un plane.";					//You must first add an activity before submitting the plan.
	languagePack.message.requiredQuestion 		= "es una pregunta requerida.";																//Required Question
	languagePack.message.required		 		= "es requerida.";																			//Required
	languagePack.message.replaceStep			= "&iquest;Quiere reemplazar el actividad actual con el actividad seleccionado?";			//Are you sure you want to replace the actaul step with the one selected?
	languagePack.message.updateDurationStep		= "&iquest;Quiere actualizar la actual duraci&oacute;n actividades?";						//Do you want to update the actual step duration?
	languagePack.message.replaceMachine			= "&iquest;Quiere reemplazar la Máquina asignada por la seleccionada?";						//Do you want to replace the machine asigned for the one selected?
	languagePack.message.removeLocationPlan		= "&iquest;Esta seguro que quiere quitar este Lugar del Plan?"; 							//Are you sure you want to remove Location from Plan?
	languagePack.message.adjustAreaZoneWeek		= "Los filtros de &aacute;rea, zona y semana han sido ajustados.";							//Area, Zone and Week filters have been adjusted.
	languagePack.message.rejectPlan				= "Seguro que desea rechazar este plan?";													//Are you sure you want to reject the plan?
	languagePack.message.approvePlan			= "Seguro que desea aprobar este plan?";													//Are you sure you want to approve the plan?
	languagePack.message.selectAllFields		= "Necesitas seleccionar todos los campos requeridos.";										//You need to select all required fields.
	languagePack.message.needOperator			= "Debe seleccionar un operador para el equipo seleccionada.";                              //You must select an operator for the selected machine.
	languagePack.message.confirmUpdateMachine1	= "&iquest;Desea actualizar el estado de los siguientes equipos de fueraser?";				//Do you want to update the status of the following machine(s) to down?
	languagePack.message.entryExists			= "already exists in the database.";
	languagePack.message.personnelIdExists		= "The PersonnelId that you have entered already exists in the system.";
	languagePack.message.theEmail				= "The email,";
	languagePack.message.emailInUse				= "has already been used.";
	languagePack.message.enterSiteName			= "Please enter a site name.";
	languagePack.message.enterFirstName			= "Please enter a first name.";
	languagePack.message.enterLastName			= "Please enter a last name.";
	languagePack.message.enterEmailAddress		= "Please enter an email address.";


	//----------   COMMON   ----------
	languagePack.common = {};

	languagePack.common.selectOption	= "-- Selecionar --";				//Select
	languagePack.common.selectEmployee	= "-- Elegir Empleado --";			//Select Employee
	languagePack.common.selectPosition	= "-- Elegir Posici&oacute;n --";	//Select Position
	languagePack.common.generating		= "Generando...";					//Generating...
	languagePack.common.loading			= "Cargando...";					//Loading...
	languagePack.common.update			= "Actualizar";						//Update
	languagePack.common.del				= "Borrar";							//Delete
	languagePack.common.resetPass		= "Reiniciar Contrase&ntilde;a";	//reset
	languagePack.common.configuration	= "Configuraci&oacute;n";			//Configuration
	languagePack.common.acceptChanges	= "Aceptar Cambios";				//Accept Changes
	languagePack.common.saveChanges		= "Guardar Cambios";				//Save Changes
	languagePack.common.updateChanges	= "Aceptar Cambios";				//Upload Changes
	languagePack.common.submit			= "Enviar";							//Submit
	languagePack.common.print			= "Imprimir";						//Print
	languagePack.common.accept			= "Aceptar";			 			//Accept
	languagePack.common.week			= "Semana";			 				//Week
	languagePack.common.cancel			= "Cancelar";			 			//Cancel
	languagePack.common.date			= "Fecha";							//Date
	languagePack.common.shift			= "Turno";							//Shift
	languagePack.common.first			= "Primera";						//First
	languagePack.common.second			= "Segunda";						//Second
	languagePack.common.third			= "Tercera";						//Third
	languagePack.common.comments		= "Comentarios";					//Comments
	languagePack.common.apply 			= "Aplicar";						//Apply
	languagePack.common.process			= "Proceso";						//Process
	languagePack.common.method			= "M&eacute;todo";					//Method
	languagePack.common.activity		= "Actividad";						//Activity
	languagePack.common.measure			= "Medida";							//Measure
	languagePack.common.pending			= "Pendiente";						//Pending
	languagePack.common.rejected		= "Rechazado";						//Rejected
	languagePack.common.approved		= "Aprobado";						//Approved
	languagePack.common.employee		= "Empleado";						//Employee
	languagePack.common.location		= "Lugar";							//Location
	languagePack.common.location_s		= "Lugar(es)";						//Locations
	languagePack.common.machine			= "Equipo";							//Machine
	languagePack.common.planning		= "Planeaci&oacute;n";				//Planning
	languagePack.common.status 			= "Estatus";						//Status
	languagePack.common.yes				= "Si";								//Yes
	languagePack.common.no				= "No";								//No
	languagePack.common.commonFields    = "Campos Comunes";					//Common Fields
	languagePack.common.addRow		    = "A&ntilde;adir nueva fila";		//Add New Row
	languagePack.common.num			    = "#";								//#
	languagePack.common.checkbox	    = "Checkbox";						//checkbox
	languagePack.common.textarea	    = "AreaDeTexto";					//textarea
	languagePack.common.field		    = "Campo";							//field
	languagePack.common.of			    = "ra de";							//of
	languagePack.common.production		= "Produccion";						//Production
	languagePack.common.development		= "Desarrollo";						//Development
	languagePack.common.operating		= "Operativo";						//Operating/Ready
	languagePack.common.down			= "Fueraser";						//Down


	//----------   MENU DISPLAY   ----------
	languagePack.menu = {};

	languagePack.menu.crumbDefaultText	= "Elige una opci&oacute;n"	//Choose an option
	languagePack.menu.backLinkText		= "Atras"					//Back


	//----------   GRID DISPLAY   ----------
	languagePack.grid = {};

	languagePack.grid.percentsymbol						= "%";
	languagePack.grid.currencysymbol					= "$";
	languagePack.grid.currencysymbolposition			= "antes";
	languagePack.grid.decimalseparator					= ".";
	languagePack.grid.thousandsseparator				= ";";
	languagePack.grid.pagergotopagestring				= "Ir a p&aacute;gina:";
	languagePack.grid.pagershowrowsstring				= "Mostrar filas:";
	languagePack.grid.pagerrangestring					= " de ";
	languagePack.grid.pagerpreviousbuttonstring			= "anterior";
	languagePack.grid.pagernextbuttonstring				= "siguiente";
	languagePack.grid.pagerfirstbuttonstring			= "primero";
	languagePack.grid.pagerlastbuttonstring				= "&uacute;ltimo";
	languagePack.grid.groupsheaderstring				= "Arrastre una columna y suelte aqu&iacute; para agrupar por esa columna";
	languagePack.grid.sortascendingstring				= "Orden Ascendente";
	languagePack.grid.sortdescendingstring				= "Orden Decendente";
	languagePack.grid.sortremovestring					= "Remover Orden";
	languagePack.grid.groupbystring						= "Agrupar por esta columna";
	languagePack.grid.groupremovestring					= "Remover de grupos";
	languagePack.grid.filterclearstring					= "Limpiar";
	languagePack.grid.filterstring						= "Filtrar";
	languagePack.grid.filtershowrowstring				= "Mostrar filas donde:";
	languagePack.grid.filtershowrowdatestring			= "Mostrar filas con fecha:";
	languagePack.grid.filterorconditionstring			= "O";
	languagePack.grid.filterandconditionstring			= "Y";
	languagePack.grid.filterselectallstring				= "(Seleccionar Todo)";
	languagePack.grid.filterchoosestring				= "Porfavor; Elija:";
	languagePack.grid.filterstringcomparisonoperators	= [ "vac&iacute;o", "no vac&iacute;o", "contiene", "contiene(coincidir mayusculas y minusculas)", "no contiene", "no contiene(coincidir mayusculas y minusculas)", "empieza con", "empieza con(coincidir mayusculas y minusculas)", "termina con", "termina con(match case)", "igual", "igual(coincidir mayusculas y minusculas)", "nulo", "no nulo" ];
	languagePack.grid.filternumericcomparisonoperators	= [ "igual", "no igual", "Menor que", "Menor que o igual a", "Mayor a", "Mayor a o igual a", "vacío", "no vac&iacute;o" ];
	languagePack.grid.filterdatecomparisonoperators		= [ "igual", "no igual", "Menor que", "Menor que o igual a", "Mayor a", "Mayor a o igual a", "nulo", "no nulo" ];
	languagePack.grid.filterbooleancomparisonoperators	= [ "igual", "no igual" ];
	languagePack.grid.validationstring					= "El valor introducido no es valido";
	languagePack.grid.emptydatastring					= "No hay datos para mostrar";
	languagePack.grid.filterselectstring				= "Seleccionar Filtro";
	languagePack.grid.loadtext							= "Cargando...";
	languagePack.grid.clearstring						= "Limpiar";
	languagePack.grid.todaystring						= "Hoy";


	//----------   DATETIME OPTIONS   ----------
	languagePack.datetime = {};

	languagePack.datetime.monday			= "Lunes";					//Monday
	languagePack.datetime.tuesday			= "Martes";					//Tuesday
	languagePack.datetime.wednesday			= "Mi&eacute;rcoles";		//Wednesday
	languagePack.datetime.thursday			= "Jueves";					//Thursday
	languagePack.datetime.friday			= "Viernes";				//Friday
	languagePack.datetime.saturday			= "S&aacute;bado";			//Saturday
	languagePack.datetime.sunday			= "Domingo";				//Sunday
	languagePack.datetime.mon				= "Lun";					//Mon
	languagePack.datetime.tue				= "Mar";					//Tue
	languagePack.datetime.wed				= "Mi&eacute;";				//Wed
	languagePack.datetime.thu				= "Jue";					//Thu
	languagePack.datetime.fri				= "Vie";					//Fri
	languagePack.datetime.sat				= "S&aacute;";				//Sat
	languagePack.datetime.sun				= "Dom";					//Sun
	languagePack.datetime.firstShift		= "Primera";				//First Shift
	languagePack.datetime.secondShift		= "Segunda";				//Second Shift
	languagePack.datetime.thirdShift		= "Tercera";				//Third Shift
	languagePack.datetime.firstShiftAbbr	= "1.º";					//First Shift Abbreviation
	languagePack.datetime.secondShiftAbbr	= "2.º";					//Second Shift Abbreviation
	languagePack.datetime.thirdShiftAbbr	= "3.º";					//Third Shift Abbreviation
	languagePack.datetime.forTheWeekOf		= "para la semana de";		//For the week of...
	languagePack.datetime.startDate			= "Fecha Inicial";			//Start Date
	languagePack.datetime.endDate			= "Fecha Final";			//End Date
	languagePack.datetime.weekof			= "Semana de:";				//Week Of
	languagePack.datetime.duration			= "Duraci&oacute;n (hrs)";	//Duration
	languagePack.datetime.days				= "D&iacute;as";			//Days


	//----------   INDEX PAGE FOR LOGIN    ----------
	languagePack.index = {};

	languagePack.index.title	= "FARA - Inicio de Sesi&oacute;n";	//Login
	languagePack.index.okay		= "Ok";								//Okay
	languagePack.index.accept	= "Acepto";							//Accept
	languagePack.index.contin	= "Continuar";						//Continue
	languagePack.index.username	= "Nombre de Usuario";				//Username
	languagePack.index.env		= "Environment";					//Environment
	languagePack.index.password	= "Contrase\xF1a";					//Password
	languagePack.index.login	= "Inicio de Sesi&oacute;n";		//Login
	languagePack.index.version	= "V3.2 R02";


	//----------   INDEX PAGE FOR MENU   ----------
	languagePack.menu_index = {};

	languagePack.menu_index.title				= "FARA";							//FARA
	languagePack.menu_index.welcome				= "Bienvenido ";					//Welcome
	languagePack.menu_index.globalFilters		= "Filtros Globales";				//Global Filters
	languagePack.menu_index.area				= "&Aacute;rea:";					//Area
	languagePack.menu_index.zone				= "Zona:";							//Zone
	languagePack.menu_index.applyFilters		= "Aplicar Filtros";				//Apply Filters
	languagePack.menu_index.okay				= "Ok";								//Okay
	languagePack.menu_index.yes					= "Si";								//Yes
	languagePack.menu_index.no					= "No";								//No
	languagePack.menu_index.displayName			= "Mostrar Nombre:";				//Display Name
	languagePack.menu_index.oldPass				= "Contrase&ntilde;a Anterior:";	//Old Password
	languagePack.menu_index.newPass				= "Nueva Contrase&ntilde;a:";		//New Password
	languagePack.menu_index.language			= "Idioma:";						//Language
	languagePack.menu_index.english				= "Ingl&eacute;s";					//English
	languagePack.menu_index.spanish				= "Espa&ntilde;ol";					//Spanish
	languagePack.menu_index.beginDate			= "Begin Date:";					//BeginDate TRANSLATION
	languagePack.menu_index.endDate				= "End Date:";						//EndDate TRANSLATION
	languagePack.menu_index.listsConfig			= "Lists Configuration";			//TRANSLATION
	languagePack.menu_index.addList				= "Add List";						//TRANSLATION
	languagePack.menu_index.lockList			= "Lock List";						//TRANSLATION
	languagePack.menu_index.removeList			= "Remove List";					//TRANSLATION
	languagePack.menu_index.addListItem			= "Add List Item";					//TRANSLATION
	languagePack.menu_index.removeListItem		= "Remove List Item";				//TRANSLATION
	languagePack.menu_index.loadingSystemTables	= "Loading System Tables";			//TRANSLATION
	languagePack.menu_index.sitesConfig			= "Sites Configuration";			//TRANSLATION
	languagePack.menu_index.createSite			= "Create a Site";					//TRANSLATION
	languagePack.menu_index.siteName			= "Site Name:";						//TRANSLATION
	languagePack.menu_index.firstName			= "First Name:";					//TRANSLATION
	languagePack.menu_index.lastName			= "Last Name:";						//TRANSLATION
	languagePack.menu_index.email				= "Email:";							//TRANSLATION
	languagePack.menu_index.createdSiteDesc		= "Once a new Site has been created, a SuperAdmin user account will be created using the provided email as the user name.  A temporary password will be generated and sent to the email.";	//TRANSLATION
	languagePack.menu_index.addSite				= "Add Site";						//TRANSLATION


	//----------   CHECKLIST CONFIGURATION   ----------
	languagePack.checklists = {};

	languagePack.checklists.checklistTypes		= "Tipos de Checklist";									//ChecklistTypes
	languagePack.checklists.checklistQuestions	= "Preguntas del Checklist";							//ChecklistQuestions
	languagePack.checklists.noQuestionName		= "No introduciste una pregunta v&aacute;lida.";		//No question Name
	languagePack.checklists.noQuestionGroup		= "No introduciste un nombre de grupo v&aacute;lido.";	//No question Group
	languagePack.checklists.noInputType			= "No introduciste un tipo de entrada v&aacute;lido.";	//No Input Type

	languagePack.checklists.grid1 = {};

	languagePack.checklists.grid1.ChecklistTypes	= "Tipo de Checklist";	//ChecklistType
	languagePack.checklists.grid1.UsageType			= "Tipo de Uso";		//UsageType

	languagePack.checklists.grid2 = {};

	languagePack.checklists.grid2.QuestionName			= "Pregunta";			//Question Name
	languagePack.checklists.grid2.Group					= "Grupo";				//Group
	languagePack.checklists.grid2.InputType1			= "Tipo de Entrada 1";	//Input Type 1
	languagePack.checklists.grid2.InputType2			= "Tipo de Entrada 2";	//Input Type 2
	languagePack.checklists.grid2.InputType3			= "Tipo de Entrada 3";	//Input Type 3
	languagePack.checklists.grid2.MachineDisplayName	= "Tipo de Equipo";		//MachineDisplayName
	languagePack.checklists.grid2.CommentsRequired		= "Comentario";			//IsCommentsRequired
	languagePack.checklists.grid2.IsMandatory			= "Requerido";			//IsMandatroy


	//----------   EMPLOYEE MACHINE CONFIGURATION   ----------
	languagePack.employeeMachine = {};

	languagePack.employeeMachine.title				= "Empleado - Equipo";								//Employee Machine
	languagePack.employeeMachine.invalidEmployee	= "No introduciste un Empleado v&aacute;lido.";		//You have not selected a valid employee.
	languagePack.employeeMachine.invalidMachine		= "No introduciste un Equipo v&aacute;lido.";		//You have not selected a valid machine.
	languagePack.employeeMachine.selectPositionFor	= "Necesitas seleccionar una posici&oacute;n para";	//You need to select a position for

	languagePack.employeeMachine.grid1 = {};

	languagePack.employeeMachine.grid1.EmployeeName			= "Empleado";	//EmployeeName
	languagePack.employeeMachine.grid1.MachineDisplayName	= "Equipo";		//MachineDisplayName
	languagePack.employeeMachine.grid1.IsOperator			= "Operador";	//IsOperator
	languagePack.employeeMachine.grid1.IsHelper				= "Ayudante";	//IsHelper


	//----------   AREA MACHINE CONFIGURATION   ----------
	languagePack.areaMachine = {};

	languagePack.areaMachine.title1				= "&Aacute;rea";										//Area
	languagePack.areaMachine.title2				= "Equipos";											//Machines
	languagePack.areaMachine.invalidMachine		= "No introduciste un Equipo v&aacute;lido.";			//You have not selected a valid machine.
	languagePack.areaMachine.invalidMachineType	= "No introduciste un Tipo de Equipo v&aacute;lido.";	//You have not selected a valid machine type.
	languagePack.areaMachine.areaAlreadyMapped	= "ya est&aacute; asignada a esta &aacute;rea.";		//already mapped to this Area.

	languagePack.areaMachine.grid1 = {};

	languagePack.areaMachine.grid1.AreaDisplayName			= "&Aacute;rea";	//AreaDisplayName
	languagePack.areaMachine.grid1.MachineTypeDisplayName	= "Tipo de Equipo";	//MachineTypeDisplayName
	languagePack.areaMachine.grid1.MachineDisplayName		= "Equipo";			//MachineDisplayName
	languagePack.areaMachine.grid1.IsHelper					= "Ayudante";		//IsHelper


	//----------   LOCATIONS CONFIGURATION   ----------
	languagePack.locations = {};

	languagePack.locations.title				= "Lugares";															//Locations
	languagePack.locations.invalidLocation		= "Favor de introducir un Lugar v&aacute;lido.";						//You have not entered a valid location.
	languagePack.locations.invalidLocation		= "Favor de introducir un nombre com&uacute;n v&aacutelido.";			//You have not entered a valid common name.
	languagePack.locations.invalidLocationCode	= "Favor de introducir un c&oacute;digo de lugar v&aacute;lido.";		//You have not entered a valid Location Code.
	languagePack.locations.invalidArea			= "Favor de introducir un &aacute;rea v&aacute;lida.";					//You have not entered a valid Area.
	languagePack.locations.invalidObraCode		= "Favor de introducir una obra v&aacute;lida.";						//You have not entered a valid Obra Code.
	languagePack.locations.invalidLevel			= "Favor de introducir un nivel v&aacute;lido.";						//You have not entered a valid Level.
	languagePack.locations.invalidLevelNum		= "Nivel debe de ser un n&uacute;mero.";								//Level must be a number.
	languagePack.locations.invalidOrientation	= "Favor de introducir una orientaci&oacute;n v&aacute;lida.";			//You have not entered a valid Orientation.
	languagePack.locations.invalidVetaClave		= "Favor de introducir un cuerpo mineral v&aacute;lido.";				//You have not entered a valid VetaClave.
	languagePack.locations.invalidReferenceLine	= "Favor de introducir una linea de referencia v&aacute;lida.";			//You have not entered a valid Reference Line.
	languagePack.locations.invalidGeologyStatus	= "Favor de introducir un estatus de Geolog&iacute;a v&aacute;lida.";	//You have not entered a valid Reference Line.

	languagePack.locations.grid1 = {};

	languagePack.locations.grid1.LocationName				= "Lugar";						//LocationName
	languagePack.locations.grid1.AreaDisplayName			= "&Aacute;rea";				//AreaDisplayName
	languagePack.locations.grid1.ObraDisplayName			= "Obra";						//ObraDisplayName
	languagePack.locations.grid1.Level						= "Nivel";						//Level
	languagePack.locations.grid1.ReferenceLine				= "L&iacute;nea de Referencia";	//ReferenceLine
	languagePack.locations.grid1.Orientation				= "Orientaci&oacute;n";			//Orientation
	languagePack.locations.grid1.VetaClaveDisplayName		= "Cuerpo Mineral";				//VetaClaveDisplayName
	languagePack.locations.grid1.LocationDisplayName		= "Nombre Com&uacute;n";		//LocationDisplayName
	languagePack.locations.grid1.LocationCode				= "N&uacute;";					//LocationCode
	languagePack.locations.grid1.GeologyStatusDisplayName	= "Estatus Geolog&iacute;a";	//GeologyStatusDisplayName
	languagePack.locations.grid1.MinestatusDisplayName		= "Estatus Mina";				//MinestatusDisplayName
	languagePack.locations.grid1.Elevation					= "Elevaci&oacute;n";			//Elevation
	languagePack.locations.grid1.BlockName					= "Bloque";						//BlockName
	languagePack.locations.grid1.Length						= "Longitud";					//Length


	//----------   ZONES CONFIGURATION   ----------
	languagePack.zones = {};

	languagePack.zones.title1				= "Zonas";													//Zones
	languagePack.zones.title2				= "Lugares";												//Locations
	languagePack.zones.invalidZone			= "Favor de introducir una Zona v&aacute;lida.";			//You have not selected a valid zone.
	languagePack.zones.invalidLocation		= "Favor de introducir un Lugar v&aacute;lida.";			//You have not selected a valid location.
	languagePack.zones.invalidDisplayName	= "Favor de introducir un Nombre Display v&aacute;lido.";	//You have not selected a valid display name.
	languagePack.zones.invalidArea			= "No ha seleccionado una &Aacute;rea.";					//You have not selected a valid Area.

	languagePack.zones.grid1 = {};

	languagePack.zones.grid1.ZoneName			= "Zona";			//ZoneName
	languagePack.zones.grid1.DisplayName		= "Nombre Display";	//DisplayName
	languagePack.zones.grid1.AreaDisplayName	= "&Aacute;rea";	//AreaDisplayName

	languagePack.zones.grid2 = {};

	languagePack.zones.grid2.ZoneDisplayName		= "Zona";	//ZoneDisplayName
	languagePack.zones.grid2.LocationDisplayName	= "Lugar";	//LocationDisplayName


	//----------   PERSON AREAS CONFIGURATION   ----------
	languagePack.personArea = {};

	languagePack.personArea.title1				= "Usarios";											//Zones
	languagePack.personArea.title2				= "&Aacute;rea";										//Locations
	languagePack.personArea.invalidArea			= "No ha seleccionado una &Aacute;rea v&aacute;lida.";	//You have not selected a valid Area.

	languagePack.personArea.grid1 = {};

	languagePack.personArea.grid1.DisplayName		= "Nombre Completo";	//DisplayName
	languagePack.personArea.grid1.Email				= "Correo";				//Email
	languagePack.personArea.grid1.RoleDisplayName	= "Rol";				//RoleDisplayName

	languagePack.personArea.grid2 = {};

	languagePack.personArea.grid2.PersonDisplayName	= "Nombre Completo";	//PersonDisplayName
	languagePack.personArea.grid2.AreaDisplayName	= "&Aacute;rea";		//AreaDisplayName


	//----------   MACHINE MEASURES CONFIGURATION   ----------
	languagePack.machineMeasures = {};

	languagePack.machineMeasures.title1			= "Equipos";										//Machines
	languagePack.machineMeasures.title2			= "Medidas";										//Measures
	languagePack.machineMeasures.invalidMeasure	= "No ha seleccionado una medida v&aacute;lida.";	//You have not selected a valid measure.

	languagePack.machineMeasures.grid1 = {};

	languagePack.machineMeasures.grid1.DisplayName		= "Tipo de Equipo";	//DisplayName
	languagePack.machineMeasures.grid1.MachineTypeCode	= "C&oacute;digo";	//MachineTypeCode

	languagePack.machineMeasures.grid2 = {};

	languagePack.machineMeasures.grid2.MachineTypeDisplayname	= "Tipo de Equipo";	//MachineTypeDisplayname
	languagePack.machineMeasures.grid2.MeasureDisplayName		= "Medida";			//MeasureDisplayName


	//----------   MEASURES CONFIGURATION   ----------
	languagePack.measures = {};

	languagePack.measures.title					= "Medidas";												//Measures
	languagePack.measures.invalidMeasure		= "No ha seleccionado una medida v&aacute;lida.";			//You have not selected a valid measure.
	languagePack.measures.invalidMeasureType	= "No ha seleccionado una tipo de medida v&aacute;lida.";	//You have not selected a valid measure type.
	languagePack.measures.invalidDisplayName	= "No ha introducido un Nombre Display v&aacute;lido.";		//You have not selected a valid display name.

	languagePack.measures.grid1 = {};

	languagePack.measures.grid1.MeasureDisplayName			= "Nombre de medida";		//MeasureDisplayName
	languagePack.measures.grid1.MeasureTypeDisplayName		= "Tipo de medida";			//MeasureTypeDisplayName
	languagePack.measures.grid1.MeasureCategoryDisplayName	= "Categoria de medida";	//MeasureCategoryDisplayName
	languagePack.measures.grid1.IsLineupMeasure				= "Pueble";					//IsLineupMeasure


	//----------   METHOD STEP CONFIGURATION   ----------
	languagePack.methodStep = {};

	languagePack.methodStep.title1				= "M&eacute;todos";											//Zones
	languagePack.methodStep.title2				= "Actividades";											//Locations
	languagePack.methodStep.invalidStep			= "Favor de introducir un Actividad v&aacute;lida.";		//You have not entered a valid step name.
	languagePack.methodStep.invalidDisplayName	= "Favor de introducir un Nombre Display v&aacute;lida.";	//You have not entered a valid display name.
	languagePack.methodStep.invalidOrden		= "Orden no puede ser inferior a 1 o mayor que";			//Ordinal cannot be less than 1 or greater than

	languagePack.methodStep.grid1 = {};

	languagePack.methodStep.grid1.MineProcessDisplayName	= "Proceso de Mina";	//MineProcessDisplayName
	languagePack.methodStep.grid1.MethodDisplayName			= "M&eacute;todo";		//MethodDisplayName

	languagePack.methodStep.grid2 = {};

	languagePack.methodStep.grid2.StepOrdinal		= "Orden";			//StepOrdinal
	languagePack.methodStep.grid2.MethodDisplayName	= "M&eacute;todo";	//MethodDisplayName
	languagePack.methodStep.grid2.StepDisplayName	= "Actividades";	//StepDisplayName
	languagePack.methodStep.grid2.IsLineup			= "Pueble";			//IsLineup


	//----------   STEP LOCATION STATUS CONFIGURATION   ----------
	languagePack.stepLocationStatus = {};

	languagePack.stepLocationStatus.title1					= "Estatus de Lugar";											//Zones
	languagePack.stepLocationStatus.title2					= "Actividades";												//Locations
	languagePack.stepLocationStatus.invalidDisplayName		= "Favor de introducir un estatus de lugar v&aacute;lida.";		//You have not entered a valid display name.
	languagePack.stepLocationStatus.invalidStep				= "Favor de introducir un actividad v&aacute;lida.";			//You have not selected a valid step.
	languagePack.stepLocationStatus.invalidStepDisplayName	= "Favor de introducir un Nombre de actividad v&aacute;lida.";	//You have not selected a valid step display name.
	languagePack.stepLocationStatus.invalidProcess			= "No seleccionaste un proceso v&aacute;lida.";					//You have not selected a valid process.
	languagePack.stepLocationStatus.invalidMethod			= "No seleccionaste un m&eacute;todo v&aacute;lida.";			//You have not selected a valid method.

	languagePack.stepLocationStatus.grid1 = {};

	languagePack.stepLocationStatus.grid1.DisplayName	= "Nombre de Estatus";	//DisplayName

	languagePack.stepLocationStatus.grid2 = {};

	languagePack.stepLocationStatus.grid2.LocationStatus_DisplayName	= "Status";			//LocationStatus_DisplayName
	languagePack.stepLocationStatus.grid2.MineProcess_DisplayName		= "Proceso";		//MineProcess_DisplayName
	languagePack.stepLocationStatus.grid2.Method_DisplayName			= "M&eacute;todo";	//Method_DisplayName
	languagePack.stepLocationStatus.grid2.Step_DisplayName				= "Actividad";		//Step_DisplayName


	//----------   STEP MEASURE CONFIGURATION   ----------
	languagePack.stepMeasure = {};

	languagePack.stepMeasure.title1					= "Actividades";								//Activities
	languagePack.stepMeasure.title2					= "Medidas";									//Measures
	languagePack.stepMeasure.invalidMeasure			= "No seleccionaste un medida v&aacute;lida.";	//You have not selected a valid measure.

	languagePack.stepMeasure.grid1 = {};

	languagePack.stepMeasure.grid1.StepOrdinal			= "Orden";			//StepOrdinal
	languagePack.stepMeasure.grid1.MethodDisplayName	= "M&eacute;todo";	//MethodDisplayName
	languagePack.stepMeasure.grid1.StepDisplayName		= "Actividades";	//StepDisplayName

	languagePack.stepMeasure.grid2 = {};

	languagePack.stepMeasure.grid2.StepDisplayName		= "Actividad";	//StepDisplayName
	languagePack.stepMeasure.grid2.MeasureDisplayName	= "Medida";		//MeasureDisplayName


	//----------   USERS CONFIGURATION   ----------
	languagePack.users = {};

	languagePack.users.title				= "Usarios";																//Users
	languagePack.users.emailInUse			= "El correo que ha introducido ya existe.  Por favor trate otro correo.";	//That email is already in use.  Please enter a valid email.
	languagePack.users.invalidEmail			= "Favor de introducir un correo v&aacute;lida.";							//You have not entered a valid email.
	languagePack.users.invalidSite			= "Usted debe seleccionar un sitio v&aacute;lida.";							//You did not select a valid site.
	languagePack.users.invalidRole			= "Usted debe seleccionar un Rol v&aacute;lida.";							//You did not select a valid role.
	languagePack.users.invalidPass			= "Su contrase&ntilde;a debe tener al menos 6 caracteres.";					//Your new password must be atleast 6 characters long.
	languagePack.users.invalidLDAP			= "You must specify a unique LDAPUserName.";
	languagePack.users.invalidPersonnelId	= "You must enter a unique PersonnelId.";

	languagePack.users.grid1 = {};

	languagePack.users.grid1.SiteDisplayName	= "Site";				//SiteDisplayName
	languagePack.users.grid1.RoleDisplayName	= "Rol";				//RoleDisplayName
	languagePack.users.grid1.Firstname			= "Primer Nombre";		//Firstname
	languagePack.users.grid1.MiddleName			= "Segundo Nombre";		//MiddleName
	languagePack.users.grid1.LastName			= "Apellidos";			//LastName
	languagePack.users.grid1.DisplayName		= "Nombre Display";		//DisplayName
	languagePack.users.grid1.Email				= "Correo";				//Email
	languagePack.users.grid1.AppUserName		= "Usuario";			//AppUserName
	languagePack.users.grid1.AppPassword		= "Contrase&ntilde;a";	//AppPassword
	languagePack.users.grid1.IsActive			= "Activo";				//IsActive
	languagePack.users.grid1.WebUser			= "webUser";			//WebUser
	languagePack.users.grid1.Username			= "Username";			//Username
	languagePack.users.grid1.IsLDAPUser			= "IsLDAPUser";			//IsLDAPUser
	languagePack.users.grid1.LDAPUserName		= "LDAPUserName";		//LDAPUserName


	//----------   LOCATION GRADE CONFIGURATION   ----------
	languagePack.locationGrade = {};

	languagePack.locationGrade.title			= "Leyes por Lugar";													//Location Grade
	languagePack.locationGrade.invalidLocation	= "Favor de introducir un Lugar v&aacute;lido.";						//You have not selected a valid location.
	languagePack.locationGrade.invalidDate		= "No puedes tener registro para el mismo lugar en la misma fecha.";	//You can not have two records for the same location on the same date.
	languagePack.locationGrade.invalidLocation	= "Favor de introducir un Lugar v&aacute;lida.";						//You have not selected a valid location.

	languagePack.locationGrade.grid1 = {};

	languagePack.locationGrade.grid1.LocationDisplayName	= "Lugar";					//LocationDisplayName
	languagePack.locationGrade.grid1.Mined_Width			= "Ancho Minado (m)";		//Mined_Width
	languagePack.locationGrade.grid1.Vein_Width				= "Ancho de Veta (m)";		//Mined_Width
	languagePack.locationGrade.grid1.length					= "Longitud (m)";			//Length
	languagePack.locationGrade.grid1.meters_advanced		= "Metros Avanzados (m)";	//Meters Advanced
	languagePack.locationGrade.grid1.GoldGrade				= "Ley de Oro (g/t)";		//GoldGrade
	languagePack.locationGrade.grid1.SilverGrade			= "Ley de Plata (g/t)";		//SilverGrade
	languagePack.locationGrade.grid1.LeadGrade				= "Ley de Plomo (%)";		//LeadGrade
	languagePack.locationGrade.grid1.ZincGrade				= "Ley de Zinc (%)";		//ZincGrade
	languagePack.locationGrade.grid1.DateEffective			= "Fecha";					//DateEffective


	//----------   LOCATION STATUS CONFIGURATION   ----------
	languagePack.locationStatus = {};

	languagePack.locationStatus.title			= "Estatus de Lugares Actuales";					//Location Status
	languagePack.locationStatus.invalidStatus	= "Favor de introducir un Estatus v&aacute;lido.";	//You have not selected a valid Status.

	languagePack.locationStatus.grid1 = {};

	languagePack.locationStatus.grid1.AreaDisplayName			= "&Aacute;rea";	//AreaDisplayName
	languagePack.locationStatus.grid1.ZoneDisplayName			= "Zona";			//ZoneDisplayName
	languagePack.locationStatus.grid1.LocationDisplayName		= "Lugar";			//LocationDisplayName
	languagePack.locationStatus.grid1.LocationStatusDisplayName	= "Estatus";		//LocationStatusDisplayName


	//----------   DOWN CODES CONFIGURATION   ----------
	languagePack.downCodes = {};

	languagePack.downCodes.title				= "Eventos de Paro";											//Down Codes
	languagePack.downCodes.invalidReasonCode	= "Favor de introducir un c&oacute; de paro v&aacute;lido.";	//You have not selected a valid Reason Code.
	languagePack.downCodes.invalidStartTime		= "Favor de introducir un tiempo de inicio v&aacute;lido.";		//You have not selected a valid Start Time.
	languagePack.downCodes.invalidArrivalTime	= "Favor de introducir un tiempo de respuesta v&aacute;lido.";	//You have not selected a valid Arrival Time.
	languagePack.downCodes.invalidfinishTime	= "Favor de introducir un tiempo final v&aacute;lido.";			//You have not selected a valid Finish Time.

	languagePack.downCodes.grid1 = {};

	languagePack.downCodes.grid1.ShiftDate				= "Fecha de Turno";			//ShiftDate
	languagePack.downCodes.grid1.Shift					= "Turno";					//Shift
	languagePack.downCodes.grid1.LocationDisplayName	= "Lugar";					//LocationDisplayName
	languagePack.downCodes.grid1.MachineDisplayName		= "Equipo";					//MachineDisplayName
	languagePack.downCodes.grid1.MachineStatus			= "Estatus de Equipo";		//Machine Status
	languagePack.downCodes.grid1.OperatorDisplayName	= "Operador";				//OperatorDisplayName
	languagePack.downCodes.grid1.CreatedByDisplayName	= "Creado Por";				//CreatedByDisplayName
	languagePack.downCodes.grid1.ReasonCodeDisplayName	= "C&oacute;digo de Paro";	//ReasonCodeDisplayName
	languagePack.downCodes.grid1.DownStartTime			= "Inicio";					//DownStartTime
	languagePack.downCodes.grid1.MaintenanceArrivalTime	= "Tiempo de Respuesta";	//MaintenanceArrivalTime
	languagePack.downCodes.grid1.DownFinishTime			= "Fin";					//DownFinishTime
	languagePack.downCodes.grid1.Comment				= "Motivo del Paro";		//Comment
	languagePack.downCodes.grid1.IsCompleted			= "Completado";				//IsCompleted


	//----------   PLANNING SYSTEM   ----------
	languagePack.planning = {};

	languagePack.planning.plan				= "Plan";									//Plan
	languagePack.planning.header			= "Configuraci&oacute;n de Plan";			//Plan Configuration
	languagePack.planning.location			= "Lugar:";	 								//Location
	languagePack.planning.step				= "Actividad"; 								//Activity
	languagePack.planning.all				= "Todos"; 									//All
	languagePack.planning.process			= "Proceso:"; 								//Process
	languagePack.planning.method			= "M&eacute;todo:"; 						//Method
	languagePack.planning.machine			= "Equipo"; 								//Machine
	languagePack.planning.operator			= "Operador"; 								//Operator
	languagePack.planning.helper			= "Ayudante"; 								//Helper
	languagePack.planning.op				= "Op";										//Op
	languagePack.planning.he				= "Ay"; 									//Ay
	languagePack.planning.addStep			= "Agregar Actividad"; 						//Add Step
	languagePack.planning.generatePlan		= "Generar Plan"; 							//Generate Plan
	languagePack.planning.configureSteps	= "Configuraci&oacute;n de Activos";		//Configure Steps
	languagePack.planning.planningSystem	= "Sistema de Planeaci&oacute;n";			//Planning System
	languagePack.planning.planning			= "Planeaci&oacute;n";						//Planning
	languagePack.planning.review			= "Revisi&oacute;n";						//Review
	languagePack.planning.checklists		= "Checklists";								//Checklists
	languagePack.planning.lineup			= "Pueble";									//Lineup
	languagePack.planning.addPlan			= "Agregar a Plan";							//Add a Plan
	languagePack.planning.addLineup			= "Agregar Pueble";							//Add a Lineup
	languagePack.planning.generateLineup	= "Generar Pueble";							//Generate Lineup
	languagePack.planning.planStatus		= "Estado Plan:";							//Plan Status
	languagePack.planning.pending			= "PENDIENTES...";							//PENDING...
	languagePack.planning.approved			= "APROBADO";								//APPROVED
	languagePack.planning.rejected			= "RECHAZADO";								//REJECTED
	languagePack.planning.planningMeasures	= "Medidas de Planeaci&oacute;n";			//Planning Measures
	languagePack.planning.delayHours		= "Horas de Retraso";						//Delay Hours
	languagePack.planning.noCurrentPlans	= "Actualmente no hay planes asignados a";	//No Current Plans for...
	languagePack.planning.delayComments		= "Retardo Comentarios";					//Delay Comments
	languagePack.planning.noPlansShiftDate	= "No hay planes para esta fecha y turno.";	//No plans for shift Date
	languagePack.planning.empty				= "( vacio )";								//Empty


	//----------   CALENDAR VIEW   ----------
	languagePack.calendar = {};

	languagePack.calendar.forLocation			= "para Lugar";						//For Location
	languagePack.calendar.howMany				= "Cuanto hay";						//How many
	languagePack.calendar.variety				= "Surtido";						//Variety
	languagePack.calendar.planPreparation		= "Preparaci&oacute;n del Plan";	//Plan Preparation
	languagePack.calendar.noActivitiesAvailable	= "No hay Actividades Disponibles";	//No Activities Available
	languagePack.calendar.questionName			= "Pregunta";						//Question Name


	//----------   PRE-LINEUP   ----------
	languagePack.prelineup = {};

	languagePack.prelineup.plansForLineup			= "Planes para Pueble";									//Plans for Lineup
	languagePack.prelineup.newLineup				= "Nuevo Pueble";										//New Lineup
	languagePack.prelineup.machineStatus			= "Estatus de Equipo";									//Machine Status
	languagePack.prelineup.locationStatus			= "Estatus de Lugares";									//Location Status
	languagePack.prelineup.endingMachineStatus		= "Terminando Estatus de Equipo";						//Ending Machine Status
	languagePack.prelineup.endingLocationStatus		= "Terminando Estatus de Lugares";						//Ending Location Status
	languagePack.prelineup.noLineupsAvailable		= "No hay Puebles Disponibles";							//No Lineups available
	languagePack.prelineup.machineDownEvent			= "Add Machine Down Event";								//Machine Down Event
	languagePack.prelineup.downCode					= "C&Oacute;D. De Paro";								//Down Code
	languagePack.prelineup.startDownTime			= "Inicio";												//Start Down Time
	languagePack.prelineup.responseTime				= "T. Respuesta";										//Response Time
	languagePack.prelineup.endDownTime				= "Fin";												//End Down Time
	languagePack.prelineup.observations				= "Observaciones";										//Observations
	languagePack.prelineup.material					= "Material";											//Material
	languagePack.prelineup.explosive				= "Explosivo";											//explosive
	languagePack.prelineup.haulage					= "Acarreo";											//haulage
	languagePack.prelineup.scaling					= "Amacice";											//scaling
	languagePack.prelineup.mineral					= "Mineral";											//Mineral
	languagePack.prelineup.waste					= "Tepetate";											//Waste
	languagePack.prelineup.fromLocation				= "Vaciar En";											//From Location
	languagePack.prelineup.numLoads					= "Num&eacute;ro de Cargas";							//# of Loads
	languagePack.prelineup.toLocation				= "Vaciado En";											//To Location
	languagePack.prelineup.real						= "Real";												//Real
	languagePack.prelineup.surplus					= "Sobrante";											//surplus
	languagePack.prelineup.top						= "Tope";												//top
	languagePack.prelineup.niche					= "Nicho";												//niche
	languagePack.prelineup.overflow1				= "Desborde Despate";									//overflow1
	languagePack.prelineup.overflow2				= "Descostre";											//overflow2
	languagePack.prelineup.operatorTimeIn			= "Hora de llegada al lugar";							//Operator Time arrival at location
	languagePack.prelineup.operatorTimeOut			= "Hora de salida del lugar";							//Operator Time leave location
	languagePack.prelineup.startShiftLocation		= "Ubicaci&oacute;n del equipo al inicio del turno";	//Operator Time leave location
	languagePack.prelineup.endShiftLocation			= "Ubicaci&oacute;n del lugar al fin del turno";		//Operator Time leave location
	languagePack.prelineup.activitiesPerformed		= "Actividades Realizadas";								//Activities Performed
	languagePack.prelineup.activitiesNotPerformed	= "Actividades No Realizadas";							//Activities Not Performed
	languagePack.prelineup.startOfShift				= "Inicio de Turno";									//Start Of Shift
	languagePack.prelineup.endOfShift				= "Fin de Turno";										//End Of Shift
	languagePack.prelineup.response					= "Respuesta";											//Response
	languagePack.prelineup.measurePerStep			= "Medidas de control asociados a cada actividad";		//measure per step

	//----------   LINEUP   ----------
	languagePack.lineup = {};

	languagePack.lineup.header			= "Planes para Pueble";										//Plans for Lineup
	languagePack.lineup.lineup			= "Pueble";													//Lineup
	languagePack.lineup.newLineup		= "Nuevo Pueble";											//New Lineup
	languagePack.lineup.selectStep		= "Debe seleccionar una actividad.";						//You must select a step.
	languagePack.lineup.addNewStep		= "Primero debe a&ntilde;adir una nueva actividad.";		//You must first add a new step.
	languagePack.lineup.selectMethod	= "Debe seleccionar un m&eacute;todo.";						//You must select a method.
	languagePack.lineup.selectLocation	= "Debe seleccionar un lugar.";								//You must select a location.
	languagePack.lineup.selectOperator	= "Debe seleccionar un operador.";							//You must select an operator.
	languagePack.lineup.selectProcess	= "Debe seleccionar un proceso.";							//You must select a process.
	languagePack.lineup.addNewLineup	= "Primero debe a&ntilde;adir una nueva Pueble.";			//You must first add a new Lineup.
	languagePack.lineup.lineupExists	= "Pueble ya se ha generado para esa ubicaci&oacute;n.";	//A lineup has already been generated for that location.


	//----------   REVIEW VIEW   ----------
	languagePack.review = {};

	languagePack.review.reviewPlans 	= "Planes de Revisi&oacute;n";			//Review Plans
	languagePack.review.byEmployees 	= "por Empleados";						//By Employees
	languagePack.review.byLocations		= "por Lugares";						//By Locations
	languagePack.review.byMachines		= "por Equipos";						//By Machines
	languagePack.review.noFields		= "No hay registros disponibles para ";	//There's no rows for...
	languagePack.review.weekOf			= "Semana de";							//Week of...
	languagePack.review.deliveryHour	= "Hora de Entrega";					//Delivery Hour
	languagePack.review.noPlansReview	= "No hay planes que revisar";			//No plans to review

	return languagePack;

})();






























