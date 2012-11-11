function FirstAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

FirstAssistant.prototype.setup = function() {
	/* Recuperation du cookie */
	this.cookie = new Mojo.Model.Cookie('preferences' + Mojo.Controller.appInfo.version);
	this.cookieContent = this.cookie.get();

	/* Scrim de demarrage */
	this.spinnerModel = {spinning: false};
	this.controller.setupWidget("progressSpinner",
    this.attributes = {
        spinnerSize: 'large'
    },
     this.spinnerModel);

	
	/* Affichage du menu */
	this.controller.setupWidget(Mojo.Menu.appMenu, myMenuAttr, myMenuModel);
	/* Traduction du texte */
	var textTitle = ["Programes de TV", "Programme TV", "TV Listings", "TV-Programm", "Programas de TV"];
	var textNow = ["Actualment", "Actuellement", "Currently", "Jetzt", "Actualmente", "Attualmente"];
	this.controller.get("title-app").update(textNow[this.cookieContent.lang]);
	/* Liste */
	this.list = [];
	this.listModel = {listTitle: 'list', items: this.list};
	this.controller.setupWidget('myList',
		{
			itemTemplate: 'first/listitem',
			listTemplate: 'first/listcontainer',
			swipeToDelete: true,
			reorderable: true
		}, this.listModel
	);
	 
	
	/* Demmarre spin */
	$('myScrim').show();
	this.spinnerModel.spinning =  true;
	this.controller.modelChanged(this.spinnerModel);
	/* Recupere les donnees du serveur */
	this.readRemoteDbTable();
	
	
	this.listClickHandler = this.listClickHandler.bind(this);
	this.reorderHandler = this.handleReorder.bindAsEventListener(this);
	this.deleteHandler = this.handleDelete.bindAsEventListener(this);
	Mojo.Event.listen(this.controller.get('myList'), Mojo.Event.listTap, this.listClickHandler);
	Mojo.Event.listen(this.controller.get('myList'),Mojo.Event.listReorder, this.reorderHandler);
	Mojo.Event.listen(this.controller.get('myList'),Mojo.Event.listDelete, this.deleteHandler);

	
	/* Menu du bas */
	this.bottomMenuModel = {
		visible: true,
		items: [
			{ 
				label:'My Bottom Menu',
				items: [
					{},
					{ label: "Menu", toggleCmd:'nowView',
					items:[
						{iconPath:'images/now.png', command: "nowView"},
						{iconPath:'images/night.png', command: "nightView"},
						{iconPath:'images/channels.png', disabled: false, command: "channelView"}
					] },
					{}
				]
			}
		]
	};
	this.controller.setupWidget( Mojo.Menu.commandMenu, {}, this.bottomMenuModel );
	
	
};

FirstAssistant.prototype.readRemoteDbTable = function() {
    var url = 'http://palmsnipe.cat/programmetv-126.php';
    var request = new Ajax.Request(url,{
            method: 'post',
            parameters: {
				'view': 'now',
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
				'timestamp': ((new Date()).getTime()) / 1000,
				'timeDiff': -(new Date()).getTimezoneOffset()/60
			},
			asynchronous: true,
            evalJSON: 'true',
			on0: function (ajaxResponse) {  
            // connection failed, typically because the server is overloaded or has gone down since the page loaded  
            Mojo.Log.error("Connection failed");
			Mojo.Controller.errorDialog('Connection failed');
            },
            on403: function (ajaxResponse) {  
            // connection failed, typically because the server is overloaded or has gone down since the page loaded  
            Mojo.Log.error("Connection failed");
			Mojo.Controller.errorDialog('Connection failed 403');
            },
            on404: function (ajaxResponse) {  
            // connection failed, typically because the server is overloaded or has gone down since the page loaded  
            Mojo.Log.error("Connection failed");
			Mojo.Controller.errorDialog('Connection failed 404');
            },
            onSuccess: this.readRemoteDbTableSuccess.bind(this),
            onFailure: function(){
				/* Arrete spin */
	$('myScrim').hide();
	this.spinnerModel.spinning =  false;
	this.controller.modelChanged(this.spinnerModel);
                Mojo.Log.error('Failed to get Ajax response');
				Mojo.Controller.errorDialog('Failed to get Ajax response');
            }
        });
}
 
FirstAssistant.prototype.readRemoteDbTableSuccess = function(response) {



	/* Traduction du texte */
	var textLength = ["Durada", "Dur\351e", "Length", "L\344nge", "Duraci\363n", "Durata"];
	var textStart = ["Comen\347ament", "D\351but", "Start", "Anfang", "Comienzo", "Inizio"];
	var textEnd = ["Final", "Fin", "End", "Ende", "Final", "Fine"];
	var textProd = ["Data de producci\363", "Date de production", "Date of production", "aus dem Jahr", "Fecha de producci\363n", "Data di produzione"];
	
	var json = response.responseJSON;
	var tab = new Array();
		
	for(var field = 0; field < json.length; field++){
		var id = field;
		var title = json[field].title;
		if (json[field].name2 != "") {
			var channel = json[field].name2;
		}
		else {
			var channel = json[field].name;
		}
		var image = 'images/icons/' + channel.toLowerCase().replace(/[ \+<>\.()!-/]/g, '').replace(/[\350\351\352]/g, 'e').replace(/\374/g, 'u').replace(/\347/g, 'c').replace(/\357/g, 'i').replace(/[\324\364]/g, 'o') + '.png';
		var desc = json[field].desc;
		var start = json[field].start;
		var stop = json[field].stop;
		var length = json[field].length;
		var minutesBegin = ((new Date(start * 1000)).getMinutes() < 10) ? "0" + (new Date(start * 1000)).getMinutes() : (new Date(start * 1000)).getMinutes();
		var minutesEnd = ((new Date(stop * 1000)).getMinutes() < 10) ? "0" + (new Date(stop * 1000)).getMinutes() : (new Date(stop * 1000)).getMinutes();
		var begin = (new Date(start * 1000)).getHours() + 'h' + minutesBegin;
		var end = (new Date(stop * 1000)).getHours() + 'h' + minutesEnd;
		if (((new Date()).getTime() / 1000) > start) {
			var diff = Math.round(Math.abs(((new Date()).getTime() / 1000) - start) / Math.abs(stop - start) * 1000) / 1000;
		}
		else {
			var diff = 0;
		}
		var prod = '<br />' + textProd[this.cookieContent.lang] + ' : ' + json[field].date;
		var text = textLength[this.cookieContent.lang] + ' : ' + length + ' min<br />' + begin + ' - ' + end;
		tab.push({'id': id, 'image': image, 'channel': channel, 'title': title, 'desc': desc, 'value': diff, 'text': text, 'prod': prod});
	}
	
	
	this.cookieList = new Mojo.Model.Cookie("list" + this.cookieContent.catalog);
	this.cookieListContent = this.cookieList.get();
	if (this.cookieListContent == undefined) {
		var listId = '|';
		var listChannel = '|';
		for(var f = 0; f < tab.length; f++){
			listId += f + '|';
			listChannel += tab[f].channel + '|';
		}
		this.cookieListContent = {'id': listId, 'channel': listChannel};
		this.cookieList.put(this.cookieListContent);
	}
	var temp=this.cookieListContent.id.split('|');
	var newTab = new Array();
var k = 0;
for (var i=1;i < temp.length-1;i++) {  
  for (var j=0;j < tab.length;j++) {  
    if (tab[j].id == temp[i]) {  
      newTab[k] = {'id': tab[j].id, 'image': tab[j].image, 'channel': tab[j].channel, 'title': tab[j].title, 'desc': tab[j].desc, 'value': tab[j].value, 'text': tab[j].text, 'prod': tab[j].prod};
      k++;  
    }  
  }  
} 

	
	this.listModel["items"] = newTab;
	this.controller.modelChanged(this.listModel , this);
	
	/* Arrete spin */
	$('myScrim').hide();
	this.spinnerModel.spinning =  false;
	this.controller.modelChanged(this.spinnerModel);
}

FirstAssistant.prototype.listClickHandler = function(event) {
	var drawerID = event.item.id + '-drawer';
	 this.controller.get(drawerID).mojo.toggleState();
	// event.item.drawer.mojo.setOpenState(!event.item.drawer.mojo.getOpenState()); 
	// Mojo.Controller.getAppController().showBanner({messageText: event.item.title}, "launchArguments", "myCategory");
};

FirstAssistant.prototype.handleCommand = function(event) {
	if(event.type == Mojo.Event.command) {
		switch(event.command) {
			case 'nowView':
				// Mojo.Controller.stageController.swapScene("first");
			break;
			case 'nightView':
				Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.crossFade, name:"second"});
			break;
			case 'channelView':
				Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.crossFade, name:"third"});
			break;
    }
  }
};

FirstAssistant.prototype.handleReorder = function(event) {  
   
    var tempId='';   
    var tempChannel='';   
  
  this.listModel.items.splice(event.fromIndex, 1);  
  this.listModel.items.splice(event.toIndex, 0, event.item);  
  
  for (var j=0;j < this.listModel.items.length;j++) { 
    tempId += this.listModel.items[j].id + '|';
    tempChannel += this.listModel.items[j].channel + '|';	
  }  
	this.cookieListContent.id = '|' + tempId;  
	this.cookieListContent.channel = '|' + tempChannel;  

	this.cookieList.put(this.cookieListContent);  
}

FirstAssistant.prototype.handleDelete = function(event) {
  Mojo.Log.info("delete event "+event.item);
  this.listModel.items.splice(this.listModel.items.indexOf(event.item), 1);

    var tempId='';   
    var tempChannel='';   

  for (var j=0;j < this.listModel.items.length;j++) {
    tempId += this.listModel.items[j].id + '|';
    tempChannel += this.listModel.items[j].channel + '|';
  }
	this.cookieListContent.id = '|' + tempId;  
	this.cookieListContent.channel = '|' + tempChannel;  

	this.cookieList.put(this.cookieListContent); 

}
 

FirstAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

FirstAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

FirstAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	Mojo.Event.stopListening(this.controller.get('myList'),Mojo.Event.listReorder, this.reorderHandler);
	Mojo.Event.stopListening(this.controller.get('myList'),Mojo.Event.listDelete, this.deleteHandler);
};
