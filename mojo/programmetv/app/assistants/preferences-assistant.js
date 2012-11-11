function PreferencesAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

PreferencesAssistant.prototype.setup = function() {
	/* Recuperation du cookie */
	this.cookie = new Mojo.Model.Cookie('preferences' + Mojo.Controller.appInfo.version);
	this.cookieContent = this.cookie.get();
	/* Affichage du menu */
	
	this.controller.setupWidget(Mojo.Menu.appMenu, myMenuAttr, myMenuModel);
	
	/* Traduction du texte */
	var textPreferences = ["Prefer\350ncies", "Pr\351f\351rences", "Preferences", "Einstellungen", "Preferencias", "Preferenze"];
	this.controller.get("title-prefs").update(textPreferences[this.cookieContent.lang]);
	
	var textLanguage = ["Llenguatge", "Langage", "Language", "Sprache", "Lenguaje", "Lingua"];
	var textSelectLang = ["Seleccionar la llengua", "Choix de la langue", "Select language", "W\344hlen Sie die Sprache", "Seleccionar el idioma", "Selezionare la lingua"];
	this.controller.get("select-languages").update(textSelectLang[this.cookieContent.lang]);
	var textCatalog = ["Cat\340leg", "Catalogue", "Catalog", "Katalog", "Cat\341logo", "Catalogo"];
	var textSelectCatalog = ["Seleccionar el cat\340leg", "Choix du catalogue", "Select catalog", "W\344hlen Sie Katalog", "Seleccionar el cat\341logo", "Selezionare catalogo"];
	this.controller.get("select-catalog").update(textSelectCatalog[this.cookieContent.lang]);
	var textRestart = ["Necessiteu reiniciar per aplicar els canvis.", "N\351cessite un red\351marrage pour appliquer les modifications.", "Requires restart to apply changes.", "Erfordert Neustart, um die \304nderungen zu \374bernehmen.", "Necesita reiniciar para aplicar los cambios.", "Necessario riavviare per applicare le modifiche."];
	this.controller.get("text-restart").update(textRestart[this.cookieContent.lang]);
	
	/* Choix de langue */
	this.setupLangChoices();
	this.controller.setupWidget('selectLang', {
												label : textLanguage[this.cookieContent.lang],
												choices : this.myLangChoice, 
												modelProperty : 'current'
											}, this.selectorsLangModel);
	
	this.selectorLangChanged = this.selectorLangChanged.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('selectLang'), Mojo.Event.propertyChange, this.selectorLangChanged);
	
	/* Choix de catalogue */
	this.setupCatalogChoices();
	this.controller.setupWidget('selectCatalog', {
												label : textCatalog[this.cookieContent.lang],
												choices : this.myCatalogChoice, 
												modelProperty : 'current'
											}, this.selectorsCatalogModel);
	this.selectorCatalogChanged = this.selectorCatalogChanged.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('selectCatalog'), Mojo.Event.propertyChange, this.selectorCatalogChanged);
	
	var textOptions = ["Opcions", "Options", "Options", "Optionen", "Opciones", "Opzioni"];
	this.controller.get("text-options").update(textOptions[this.cookieContent.lang]);
	
	// set time evening
	this.night = new Date();
	this.night.setHours(this.cookieContent.nightHour)
	this.night.setMinutes(this.cookieContent.nightMinutes);
	var textEvening = ["Nit", "Nuit", "Night", "Abend", "Noche", "Notte"];
	this.controller.get("text-start-evening").update(textEvening[this.cookieContent.lang]);
	var currentTime = new Date();this.controller.setupWidget("timepicker",
			this.attributesNight = {
				label: "\0",
				modelProperty: 'time',
				minuteInterval: 5
			}, 
			this.modelNight = {
				time: this.night
			}
	);
	this.propertyChanged2 = this.propertyEveningChanged.bindAsEventListener(this);
	this.controller.listen(this.controller.get("timepicker"), Mojo.Event.propertyChange, this.propertyChanged2);
	
	// set up the button
	var textClear = ["Restablir la llista de canals", "Restaurer la liste des chaines", "Reset the channel list", "Reset der Senderliste", "Restablir la llista de canals", "Reimpostare l'elenco dei canali"];
	this.buttonClearModel = {
		label : textClear[this.cookieContent.lang],
		buttonClass : 'primary',
	};
	this.controller.setupWidget("clearButton", {}, this.buttonClearModel);
	Mojo.Event.listen(this.controller.get("clearButton"), Mojo.Event.tap, 
	this.handleButtonClearPress.bind(this));
	
// Currently, all models without gesture areas also lack keyboards.
if (! Mojo.Environment.DeviceInfo.keyboardAvailable) {
	this.commandMenuModel = {visible: true, items: [{icon: "back", command: "back"}]};
this.controller.setupWidget(Mojo.Menu.commandMenu, {spacerHeight: 0, menuClass:'no-fade'}, this.commandMenuModel);
}

	// Style if touchpad
	var model = Mojo.Environment.DeviceInfo.modelName;
	if (model == "TouchPad" || model == "(TouchPad)") {
		this.controller.get('touchpad').style.width="480px";
		this.controller.get('touchpad').style.margin="0 auto 0 auto";
	}
};

PreferencesAssistant.prototype.handleCommand = function (event) {
	switch (event.type) {				
			case Mojo.Event.command:
		        switch (event.command) { 
					
		        	case "back":
		        		this.controller.stageController.popScene();
						break;
				}
				break;
 
		    default:
		    	break;
		}
};

PreferencesAssistant.prototype.setupLangChoices = function() {
	this.textLangChoice = ["Catal\340", "Fran\347ais", "English", "Deutsch", "Castellano", "Italiano"];

	this.myLangChoice = [{label : "Catal\340", value : 'cat'},
					{label : "Castellano", value : 'es'},
					{label : "Fran\347ais", value : 'fr'},
					{label : "English", value : 'en'},
					{label : "Deutsch", value : 'de'},
					{label : "Italiano", value : 'it'}];
	this.selectorsLangModel = {current: this.textLangChoice[this.cookieContent.lang]};
};

PreferencesAssistant.prototype.setupCatalogChoices = function() {
	var textFrench = ["Franc\350s", "Fran\347ais", "French", "Franz\366sisch", "Franc\351s", "Francese"];
	var textBelgian = ["Belga", "Belge", "Belgian", "Belgier", "Belga", "Belga"];
	var textGerman = ["Alemany", "Allemand", "German", "Deutsch", "Alem\341n", "Tedesco"];
	var textEnglish = ["Angl\350s", "Anglais", "English", "Englisch", "Ingl\351s", "Inglese"];
	var textSwiss = ["Su\355s", "Suisse", "Swiss", "Schweizer", "Suizo", "Svizzera"];
	var textSpanish = ["Castell\340", "Espagnol", "Spanish", "Spanisch", "Espa\361ol", "Spagnolo"];
	var textItalian = ["It\340lia", "Italien", "Italian", "Italienisch", "Italiano", "Italiano"];
	
	this.textCurrentCatalog = new Array();
	this.textCurrentCatalog['fr'] = 'TNT';
	// this.textCurrentCatalog['canalsat'] = 'CanalSat';
	// this.textCurrentCatalog['be'] = textBelgian[this.cookieContent.lang];
	this.textCurrentCatalog['de'] = textGerman[this.cookieContent.lang];
	this.textCurrentCatalog['en'] = textEnglish[this.cookieContent.lang];
	this.textCurrentCatalog['ch'] = 'DVB-T';
	this.textCurrentCatalog['chfr'] = 'DVB-T + TNT France';
	this.textCurrentCatalog['es'] = 'DVB-T';
	this.textCurrentCatalog['it'] = 'DVB-T';
	this.textCurrentCatalog['us'] = 'Test !!!';
	
	this.myCatalogChoice = [{label: textFrench[this.cookieContent.lang]},
					{label : 'TNT', value : 'fr'},
					// {label : 'CanalSat', value : 'canalsat'},
					// {label: textBelgian[this.cookieContent.lang]},
					// {label : textBelgian[this.cookieContent.lang], value : 'be'},
					{label: textGerman[this.cookieContent.lang]},
					{label : textGerman[this.cookieContent.lang], value : 'de'},
					{label: textEnglish[this.cookieContent.lang]},
					{label : textEnglish[this.cookieContent.lang], value : 'en'},
					{label: textSwiss[this.cookieContent.lang]},
					{label : 'DVB-T', value : 'ch'},
					{label : 'DVB-T + TNT France', value : 'chfr'},
					{label: textSpanish[this.cookieContent.lang]},
					{label : 'DVB-T', value : 'es'},
					{label: textItalian[this.cookieContent.lang]},
					{label : 'DVB-T', value : 'it'},
					{label: 'USA'},
					{label : 'Test !!!', value : 'us'}
					];
	this.selectorsCatalogModel = {current: this.textCurrentCatalog[this.cookieContent.catalog]};
};

PreferencesAssistant.prototype.selectorLangChanged = function(event) {
	var textChanged = ["Llenguatge canviat", "Langue chang\351e", "Language changed", "Sprache ge\344ndert", "Idioma cambiado", "Lingua cambiato"];

	if (event.value == "cat") {
		this.cookieContent.lang = 0;
	}
	if (event.value == "fr") {
		this.cookieContent.lang = 1;
	}
	if (event.value == "en") {
		this.cookieContent.lang = 2;
	}
	if (event.value == "de") {
		this.cookieContent.lang = 3;
	}
	if (event.value == "es") {
		this.cookieContent.lang = 4;
	}
	if (event.value == "it") {
		this.cookieContent.lang = 5;
	}
	Mojo.Controller.getAppController().showBanner({messageText: textChanged[this.cookieContent.lang] + " : " + this.textLangChoice[this.cookieContent.lang]}, "launchArguments",
												  "myCategory");
};

PreferencesAssistant.prototype.selectorCatalogChanged = function(event) {
	var textChanged = ["Cat\340leg canviat", "Catalogue chang\351", "Catalog changed", "Katalog ge\344ndert", "Cat\341logo cambiado", "Catalogo cambiato"];
	this.cookieContent.catalog = event.value;
	Mojo.Controller.getAppController().showBanner({messageText: textChanged[this.cookieContent.lang] + " : " + this.textCurrentCatalog[this.cookieContent.catalog]}, "launchArguments",
												  "myCategory");
};

PreferencesAssistant.prototype.handleButtonClearPress = function(event) {
	var textChanged = ["Llista restaurat", "Liste restaur\351e", "List restored", "Liste restauriert", "Lista restaurado", "Lista restaurato"];
	var cookieList = new Mojo.Model.Cookie("cookieList-" + this.cookieContent.catalog);
	cookieList.remove();
	Mojo.Controller.getAppController().showBanner({messageText: textChanged[this.cookieContent.lang]}, "launchArguments",
												  "myCategory");
};

PreferencesAssistant.prototype.propertyHourChanged = function(event) {
	this.cookieContent.hour = this.modelPicker.value;
	this.hourPreview = (new Date()).getHours() + this.cookieContent.hour;
	if (this.hourPreview >= 24) {
		this.hourPreview = this.hourPreview - 24;
	}
	else if (this.hourPreview < 0) {
		this.hourPreview = this.hourPreview + 24;
	}
	var minutes = ((new Date()).getMinutes() < 10) ? "0" + (new Date()).getMinutes() : (new Date()).getMinutes();
	var textTime = this.hourPreview + "h" + minutes;
	this.controller.get("text-time").update(textTime);

};

PreferencesAssistant.prototype.propertyEveningChanged = function(event) {
	this.cookieContent.nightHour = this.modelNight.time.getHours();
	this.cookieContent.nightMinutes = this.modelNight.time.getMinutes();
};

PreferencesAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

PreferencesAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
	   this.cookie.put(this.cookieContent);
};

PreferencesAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
