function ThirdAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

ThirdAssistant.prototype.setup = function() {
	/* Recuperation du cookie */
	this.cookie = new Mojo.Model.Cookie('preferences' + Mojo.Controller.appInfo.version);
	this.cookieContent = this.cookie.get();

	this.cookieList = new Mojo.Model.Cookie("list" + this.cookieContent.catalog);
	this.cookieListContent = this.cookieList.get();
	/* Affichage du menu */
	this.controller.setupWidget(Mojo.Menu.appMenu, myMenuAttr, myMenuModel);
	/* Traduction du texte */
	var defaultWeek = new Array(
		['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'],
		['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
		['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
		['Domingo', 'Lunes', 'Martes', 'Mi\351rcoles', 'Jueves', 'Viernes', 's\341bado', 'Domingo', 'Lunes', 'Martes', 'Mi\351rcoles', 'Jueves', 'Viernes', 's\341bado'],
		['Domenica', 'Lunedi', 'Marted\354', 'Mercoled\354', 'Giovedi', 'Venerd\354', 'Sabato', 'Domenica', 'Lunedi', 'Marted\354', 'Mercoled\354', 'Giovedi', 'Venerd\354', 'Sabato']
	);
	var defaultToday = ["Avui", "Aujourd'hui", "Today", "Heute", "Hoy", "Oggi"];
	var defaultTomorrow = ["Dem\340", "Demain", "Tomorrow", "Morgen", "Ma\361ana", "Domani"];
	this.week = new Array();
	this.week[0] = defaultToday[this.cookieContent.lang];
	this.week[1] = defaultTomorrow[this.cookieContent.lang];
	for (var i=2; i < 7; i++) {
		this.week[i] = defaultWeek[this.cookieContent.lang][(new Date()).getDay() + i] + ' ' + ((new Date()).getDate() + i);
	}
	
		/* Choix de chaine */
		
	var temp = this.cookieListContent.channel.split('|');
	this.myChannelChoice = new Array();
	for (i = 1; i < temp.length - 1; i++) {
		this.myChannelChoice.push({'label': temp[i], 'value': temp[i]});
	}
	this.controller.setupWidget('selectChannel', {
												label : '',
												choices : this.myChannelChoice, 
												modelProperty : 'current'
											}, this.selectorsChannelModel = {current: this.myChannelChoice[0].label});
	
	this.selectorChannelChanged = this.selectorChannelChanged.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('selectChannel'), Mojo.Event.propertyChange, this.selectorChannelChanged);
	
	
	this.channel = this.myChannelChoice[0].value;
	this.day = 0;
	/* Recupere les donnees du serveur */
	this.readRemoteDbTable();
	/* Menu du haut */
	this.previewDayModel = {icon:'back', command: "previewDay", disabled: true};
	this.nextDayModel = {icon:'forward', command: "nextDay", disabled: false};
	this.titleDayModel = { label: this.week[0], width: 200};
	
	this.topMenuModel = {
    visible: true,
    items: [{},{
      items: [
        this.previewDayModel,
        this.titleDayModel,
        this.nextDayModel
      ]
    },{}]
	};
	this.controller.setupWidget( Mojo.Menu.viewMenu, {}, this.topMenuModel );
	/* Menu du bas */
	this.bottomMenuModel = {
		visible: true,
		items: [
			{
				label:'My Bottom Menu',
				items: [
					{},
					{ label: "Menu", toggleCmd:'channelView',
					items:[
						{iconPath:'images/now.png', command: "nowView" },
						{iconPath:'images/night.png', command: "nightView" },
						{iconPath:'images/channels.png', command: "channelView"}
					] },
					{}
				]
			}
		]
	};
	this.controller.setupWidget( Mojo.Menu.commandMenu, {}, this.bottomMenuModel );
	
	// Style if touchpad
	var model = Mojo.Environment.DeviceInfo.modelName;
	if (model == "TouchPad" || model == "(TouchPad)") {
		this.controller.get('touchpad').style.width="540px";
		this.controller.get('touchpad').style.margin="0 auto 0 auto";
	}
};


ThirdAssistant.prototype.readRemoteDbTable = function() {
    var url = 'http://palmsnipe.cat/programmetv-126.php';
    var request = new Ajax.Request(url,{
            method: 'post',
            parameters: {
				'day': this.day,
				'channel': this.channel,
				'view': 'channels',
				'catalog' : this.cookieContent.catalog, 
				'model': Mojo.Environment.DeviceInfo.modelName, 
				'platformVersion': Mojo.Environment.DeviceInfo.platformVersion, 
				'width': Mojo.Environment.DeviceInfo.screenWidth, 
				'height': Mojo.Environment.DeviceInfo.screenHeight, 
				'serial': Mojo.Environment.DeviceInfo.serialNumber, 
				'carrier': Mojo.Environment.DeviceInfo.carrierName, 
				'appVersion': Mojo.Controller.appInfo.version, 
				'appVersionStatus': 'beta', 
				'lang': this.cookieContent.lang,
				'timestamp': ((new Date()).getTime() + (this.cookieContent.hour * 3600 * 1000)) / 1000
			},
            evalJSON: 'true',
            onSuccess: this.readRemoteDbTableSuccess.bind(this),
            onFailure: function(){
                Mojo.Log.error('Failed to get Ajax response');
            }
        });
};
 
ThirdAssistant.prototype.readRemoteDbTableSuccess = function(response) {
	var json = response.responseJSON;
	var tab = new Array();
	
	for(var field = 0; field < json.length; field++){
		// var id = field;
		// var channel = json[field].channel;
		var title = json[field].title;
		var desc = json[field].desc;
		var start = json[field].start;
		var minutesBegin = ((new Date(start * 1000)).getMinutes() < 10) ? "0" + (new Date(start * 1000)).getMinutes() : (new Date(start * 1000)).getMinutes();
		var begin = (new Date(start * 1000)).getHours() + 'h' + minutesBegin;
		
		// var image = 'images/icons/' + channel.toLowerCase().replace(/[ \+<>\.()!-/]/g, '').replace(/[\350\351\352]/g, 'e').replace(/\374/g, 'u').replace(/\347/g, 'c').replace(/\357/g, 'i').replace(/[\324\364]/g, 'o') + '.png';
		tab.push({'title': title, 'desc': desc, 'start': begin});
	}

	var test = '';
	for (var i = 0; i < tab.length; i++) {
		test += "<table class='palm-divider labeled'><tbody><tr><td class='left'></td><td class='label'>" + tab[i].start + "</td><td class='right'></td></tr></tbody></table><div class='palm-body-title'>" + tab[i].title + "</div><div class='palm-body-text'>" + tab[i].desc + "</div>";
	}
		this.controller.get("test").update(test);

	var image = 'images/icons/' + this.channel.toLowerCase().replace(/[ \+<>\.()!-/]/g, '').replace(/[\350\351\352]/g, 'e').replace(/\374/g, 'u').replace(/\347/g, 'c').replace(/\357/g, 'i').replace(/[\324\364]/g, 'o') + '.png';
	var logo = "<img src='" + image + "' alt='" + this.channel + "' width='64px' height='64px' />";
	this.controller.get("logo").update(logo);
	// this.controller.get("channel").update(this.channel);
	
};

ThirdAssistant.prototype.handleCommand = function(event) {
  if(event.type == Mojo.Event.command) {
    switch(event.command) {
      case 'nowView':
			Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.crossFade, name:"first"});
        break;
      case 'nightView':
			Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.crossFade, name:"second"});
        break;
		case 'channelView':
				// Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.crossFade, name:"third"});
		break;
		case 'previewDay':
			if (this.day > 0) {
				this.day--;
				this.nextDayModel.disabled = false;
			}
			if (this.day <= 0) {
				this.previewDayModel.disabled = !this.previewDayModel.disabled;
			}
			this.titleDayModel.label = this.week[this.day];
			this.controller.modelChanged(this.topMenuModel);
			/* Recupere les donnees du serveur */
			this.readRemoteDbTable();
		break;
		case 'nextDay':
			if (this.day < 6) {
				this.day++;
				this.previewDayModel.disabled = false;
			}
			if (this.day >= 6) {
				this.nextDayModel.disabled = !this.nextDayModel.disabled;
			}
			this.titleDayModel.label = this.week[this.day];
			this.controller.modelChanged(this.topMenuModel);
			/* Recupere les donnees du serveur */
			this.readRemoteDbTable();
		break;
    }
  }
};
/*
ThirdAssistant.prototype.setupChannelChoices = function() {
	var temp = this.cookieListContent.channel.split('|');
	this.myChannelChoice = new Array();
	for (var i = 1; i < temp.length - 1; i++;) {
		this.myChannelChoice.push({'label': temp[i], 'value': temp[i]});
	}
	
	this.selectorsChannelModel = {current: this.myChannelChoice[0].label};
};
*/
ThirdAssistant.prototype.selectorChannelChanged = function(event) {
	this.channel = event.value;
	/* Recupere les donnees du serveur */
	this.readRemoteDbTable();
};

ThirdAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

ThirdAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

ThirdAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
