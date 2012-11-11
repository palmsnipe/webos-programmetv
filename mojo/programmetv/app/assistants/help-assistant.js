function HelpAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

HelpAssistant.prototype.setup = function() {
	/* Recuperation du cookie */
	this.cookie = new Mojo.Model.Cookie('preferences' + Mojo.Controller.appInfo.version);
	this.cookieContent = this.cookie.get();

	/* Affichage du menu */
	this.controller.setupWidget(Mojo.Menu.appMenu, myMenuAttr, myMenuModel);
	
	/* Traduction du texte */
	var textHelp = ["Ajuda", "Aide", "Help", "Hilfe", "Ayuda", "Aiuto"];
	this.controller.get("title-help").update(textHelp[this.cookieContent.lang]);
	var textAbout = ["Desenvolupat per Cyril Morales.", "D\351velopp\351 par Cyril Morales.", "Developed by Cyril Morales.", "Entwickelt von Cyril Morales.", "Desarrollado por Cyril Morales.", "Sviluppato da Cyril Morales."];
	this.controller.get("about").update(textAbout[this.cookieContent.lang]);
	var textAboutTitle = ["Sobre", "A Propos", "About", "\374ber", "Sobre", "Circa"];
	this.controller.get("title-aboutbox").update(textAboutTitle[this.cookieContent.lang]);
	var textWebsite = ["Lloc Web", "Site Web", "Website", "Webseite", "Sitio web", "Sito web"];
	this.controller.get("text-website").update(textWebsite[this.cookieContent.lang]);
	var textSupportTitle = ["Suport", "Support", "Support", "Unterst\374tzung", "Apoyo", "Sostegno"];
	this.controller.get("title-support").update(textSupportTitle[this.cookieContent.lang]);
	var textForum = ["F\362rum", "Forum", "Forum", "Forum", "Foro", "Foro"];
	this.controller.get("text-forum").update(textForum[this.cookieContent.lang]);
	var textSubject = ["Tema", "Sujet", "Subject", "Thema", "Tema", "Soggetto"];
	this.controller.get("text-subject").update(textSubject[this.cookieContent.lang]);
	var textSendEmail = ["Enviar un missatge", "Envoyer un message", "Send Email", "Senden einer Nachricht", "Enviar un mensaje", "Invia un messaggio"];
	this.controller.get("text-send-email").update(textSendEmail[this.cookieContent.lang]);
	
	
	Mojo.Event.listen(this.controller.get("website"), Mojo.Event.tap, this.openWebsite.bind(this));
	Mojo.Event.listen(this.controller.get("forum"), Mojo.Event.tap, this.openForum.bind(this));
	Mojo.Event.listen(this.controller.get("email"), Mojo.Event.tap, this.openMail.bind(this));
// Currently, all models without gesture areas also lack keyboards.
if (! Mojo.Environment.DeviceInfo.keyboardAvailable) {
	this.commandMenuModel = {visible: true, items: [{icon: "back", command: "back"}]};
this.controller.setupWidget(Mojo.Menu.commandMenu, {}, this.commandMenuModel);
}

	// Style if touchpad
	var model = Mojo.Environment.DeviceInfo.modelName;
	if (model == "TouchPad" || model == "(TouchPad)") {
		this.controller.get('touchpad').style.width="480px";
		this.controller.get('touchpad').style.margin="0 auto 0 auto";
	}
};

HelpAssistant.prototype.handleCommand = function (event) {
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

HelpAssistant.prototype.openWebsite = function(event) {
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
							method: "open",
							parameters: {
								id: 'com.palm.app.browser',
								params: {target: "http://www.palmsnipe.cat"}
							}
						});
};

HelpAssistant.prototype.openForum = function(event) {
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
							method: "open",
							parameters: {
								id: 'com.palm.app.browser',
								params: {target: "http://forum.palmpre-france.com/viewtopic.php?pid=10579"}
							}
						});
};

HelpAssistant.prototype.openMail = function(event) {
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

HelpAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

HelpAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

HelpAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
