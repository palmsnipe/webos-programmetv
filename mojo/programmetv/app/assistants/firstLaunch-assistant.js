function FirstLaunchAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

FirstLaunchAssistant.prototype.setup = function() {
	/* Recuperation du cookie */
	this.cookie = new Mojo.Model.Cookie('preferences' + Mojo.Controller.appInfo.version);
	this.cookieContent = this.cookie.get();

	
	this.textLanguage = ["Llenguatge", "Langage", "Language", "Sprache", "Lenguaje", "Lingua"];
	this.textSelectLang = ["Seleccionar la llengua", "Choix de la langue", "Select language", "W\344hlen Sie die Sprache", "Seleccionar el idioma", "Selezionare la lingua"];
	this.controller.get("select-languages").update(this.textSelectLang[this.cookieContent.lang]);
	
	/* Choix de langue */
	this.setupLangChoices();
	this.cookieContent.languageModel = {label : this.textLanguage[this.cookieContent.lang], choices : this.myLangChoice, modelProperty : 'current'};
	this.controller.setupWidget('selectLang', this.cookieContent.languageModel, this.selectorsLangModel);
	
	this.selectorLangChanged = this.selectorLangChanged.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('selectLang'), Mojo.Event.propertyChange, this.selectorLangChanged);
	
	this.textTitle = ["Primer Llan\347ament", "Premier Lancement", "First Launch", "Erster Start", "Primer Lanzamiento", "Primo Lancio"];
	this.controller.get("title-first").update(this.textTitle[this.cookieContent.lang]);
	this.textSupportTitle = ["Suport", "Support", "Support", "Unterst\374tzung", "Apoyo", "Sostegno"];
	this.controller.get("title-support").update(this.textSupportTitle[this.cookieContent.lang]);
	this.textForum = ["F\362rum", "Forum", "Forum", "Forum", "Foro", "Foro"];
	this.controller.get("text-forum").update(this.textForum[this.cookieContent.lang]);
	this.textSubject = ["Tema", "Sujet", "Subject", "Thema", "Tema", "Soggetto"];
	this.controller.get("text-subject").update(this.textSubject[this.cookieContent.lang]);
	this.textSendEmail = ["Enviar un missatge", "Envoyer un message", "Send Email", "Senden einer Nachricht", "Enviar un mensaje", "Invia un messaggio"];
	this.controller.get("text-send-email").update(this.textSendEmail[this.cookieContent.lang]);
	
	this.textContent = ['<b>Programme TV</b> es troba actualment en fase <b>beta</b>.<br /><br /><span style="color: red;"><b>Algunes caracter\355stiques poden no funcionar!!!</b></span><br /><br />Una nova versió amb Enyo està en desenvolupament. Tingueu paciència !!<br /><br />Gr\340cies.',
						'<b>Programme TV</b> est pour le moment en version <b>b\352ta</b>.<br /><br /><span style="color: red;"><b>Des fonctionnalit\351s peuvent ne plus marcher!!!</b></span><br /><br />Une nouvelle version avec enyo est en developpement avec plus de details, de chaines, et de pays (Allemagne, Belgique, Canada, Espagne, Etats-Unis, Grande-Bretagne, France, Italie, Suisse).<br/><b>Soyez patients !!</b><br /><br />Merci.',
						'<b>Programme TV</b> is currently in <b>beta</b>.<br /><br /><span style="color: red;"><b>Some features may no longer walk!!!</b></span><br /><br />A new version with enyo is in development with more details, channels, and countries (Germany, Belgium, Canada, Spain, United States, Great Britain, France, Italy, Switzerland).<br /><b>Be patient !!</b><br /><br />Thank you.',
						'<b>Programme TV</b> ist derzeit in der <b>beta</b>.<br /><br /><span style="color: red;"><b>Einige Funktionen k\366nnen nicht mehr!!!</b></span><br /><br />Vielen Dank.',
						'<b>Programme TV</b> is currently in <b>beta</b>.<br /><br /><span style="color: red;"><b>Some features may no longer walk!!!</b></span><br /><br />A new version with enyo is in development with more details, channels, and countries (Germany, Belgium, Canada, Spain, United States, Great Britain, France, Italy, Switzerland).<br /><b>Be patient !!</b><br /><br />Thank you.',
						'<b>Programme TV</b> is currently in <b>beta</b>.<br /><br /><span style="color: red;"><b>Some features may no longer walk!!!</b></span><br /><br />A new version with enyo is in development with more details, channels, and countries (Germany, Belgium, Canada, Spain, United States, Great Britain, France, Italy, Switzerland).<br /><b>Be patient !!</b><br /><br />Thank you.'];
	this.controller.get("content").update(this.textContent[this.cookieContent.lang]);

	Mojo.Event.listen(this.controller.get("twitter"), Mojo.Event.tap, this.openWebsite.bind(this));
	Mojo.Event.listen(this.controller.get("forum"), Mojo.Event.tap, this.openForum.bind(this));
	Mojo.Event.listen(this.controller.get("email"), Mojo.Event.tap, this.openMail.bind(this));
	
	// set up the button
	this.buttonModel = {
		label : 'OK',
		buttonClass : 'primary',
	};
	this.controller.setupWidget("button", {}, this.buttonModel); 
	Mojo.Event.listen(this.controller.get("button"), Mojo.Event.tap, this.handleButtonPress.bind(this));

	this.textCheckbox = ["No mostrar aquest missatge", "Ne plus afficher ce message", "Do not show this message again", "Nicht mehr anzeigen Diese Meldung", "No mostrar este mensaje", "Non mostrare pi\371 questo messaggio"];
	this.controller.get("textCheckbox").update(this.textCheckbox[this.cookieContent.lang]);

	
	this.controller.setupWidget('checkbox', {}, {});
	this.selectorChanged = this.checkboxSelectorChanged.bind(this);
	this.controller.listen('checkbox', Mojo.Event.propertyChange, this.selectorChanged);
	
	
	// Style if touchpad
	var model = Mojo.Environment.DeviceInfo.modelName;
	if (model == "TouchPad" || model == "(TouchPad)") {
		this.controller.get('touchpad').style.width="480px";
		this.controller.get('touchpad').style.margin="0 auto 0 auto";
	}
};

FirstLaunchAssistant.prototype.checkboxSelectorChanged = function(event) {
	this.cookieContent.first = event.value;
};

FirstLaunchAssistant.prototype.setupLangChoices = function() {
	this.textLangChoice = ["Catal\340", "Fran\347ais", "English", "Deutsch", "Castellano", "Italiano"];

	this.myLangChoice = [{label : 'Catal\340', value : 'cat'},
					{label : "Castellano", value : 'es'},
					{label : "Fran\347ais", value : 'fr'},
					{label : "English", value : 'en'},
					{label : "Deutsch", value : 'de'},
					{label : "Italiano", value : 'it'}];
	this.selectorsLangModel = {current: this.textLangChoice[this.cookieContent.lang]};
};

FirstLaunchAssistant.prototype.selectorLangChanged = function(event) {
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
		
	this.cookieContent.languageModel["label"] = this.textLanguage[this.cookieContent.lang];
	this.controller.modelChanged(this.cookieContent.languageModel, this);

	this.controller.get("select-languages").update(this.textSelectLang[this.cookieContent.lang]);	
	this.controller.get("title-first").update(this.textTitle[this.cookieContent.lang]);
	this.controller.get("title-support").update(this.textSupportTitle[this.cookieContent.lang]);
	this.controller.get("text-forum").update(this.textForum[this.cookieContent.lang]);
	this.controller.get("text-subject").update(this.textSubject[this.cookieContent.lang]);
	this.controller.get("text-send-email").update(this.textSendEmail[this.cookieContent.lang]);
	this.controller.get("content").update(this.textContent[this.cookieContent.lang]);
	this.controller.get("textCheckbox").update(this.textCheckbox[this.cookieContent.lang]);

		
	Mojo.Controller.getAppController().showBanner({messageText: textChanged[this.cookieContent.lang] + " : " + this.textLangChoice[this.cookieContent.lang]}, "launchArguments",
												  "myCategory");
};

FirstLaunchAssistant.prototype.openWebsite = function(event) {
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
							method: "open",
							parameters: {
								id: 'com.palm.app.browser',
								params: {target: "http://www.twitter.com/cyrilmorales"}
							}
						});
};

FirstLaunchAssistant.prototype.openForum = function(event) {
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
							method: "open",
							parameters: {
								id: 'com.palm.app.browser',
								params: {target: "http://forum.palmpre-france.com/viewtopic.php?pid=10579"}
							}
						});
};

FirstLaunchAssistant.prototype.openMail = function(event) {
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
							method: "open",
							parameters: {
								id: 'com.palm.app.email',
								params: {
                        summary: '[Programme TV ' + Mojo.Controller.appInfo.version + '] ',
						recipients: [{type: "email",
                contactDisplay: "Cyril Morales", 
                role: 1,
                value: "cyril@palmsnipe.cat"}]
                    }
							}
						});
};

FirstLaunchAssistant.prototype.handleButtonPress = function(event) {
	this.cookie.put(this.cookieContent);
	Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.zoomFade, name:"first"});
};

FirstLaunchAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

FirstLaunchAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

FirstLaunchAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
