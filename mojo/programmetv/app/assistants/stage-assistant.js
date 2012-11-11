function StageAssistant() {
	/* this is the creator function for your stage assistant object */
}

StageAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the stage is first created */
	
	/* for a simple application, the stage assistant's only task is to push the scene, making it visible */
	/* Recuperation du cookie */
	this.cookie = new Mojo.Model.Cookie('preferences' + Mojo.Controller.appInfo.version);
	this.cookieContent = this.cookie.get();
	if (this.cookieContent == undefined) {
		this.cookieContent = {first : false, lang : 2, catalog : 'fr', hour : 0, nightHour : 20, nightMinutes : 35};
		this.cookie.put(this.cookieContent);
	}
	
	var textPreferences = ["Prefer\350ncies", "Pr\351f\351rences", "Preferences", "Einstellungen", "Preferencias", "Preferenze"];
	var textHelp = ["Ajuda", "Aide", "Help", "Hilfe", "Ayuda", "Aiuto"];
	
	myMenuAttr = {
        omitDefaultItems: true
    };
 
    myMenuModel = {
        visible: true,
        items: [{label : textPreferences[this.cookieContent.lang], command : 'preferences', disabled : false},
                {label : textHelp[this.cookieContent.lang], command : 'help', disabled : false}
        ]
    };
	this.controller.setWindowOrientation("free"); 

	// launch
	if (this.cookieContent.first == false) {
		this.controller.pushScene("firstLaunch");
} else {
	this.controller.pushScene("first");
}
};

StageAssistant.prototype.handleCommand = function (event) {
    var currentScene = this.controller.activeScene();
 
    switch(event.type) {
        case Mojo.Event.commandEnable:
            switch (event.command) {
                case 'preferences':
                    event.stopPropagation();
                    break;
                case 'help':
                    event.stopPropagation();
                    break;
            }
            break;
        case Mojo.Event.command:
            switch (event.command) {   
                case 'help':
                    this.controller.pushScene('help');
                    break;
 
                case 'preferences':
                    this.controller.pushScene('preferences');
                    break;
            }
        break;
    }
};