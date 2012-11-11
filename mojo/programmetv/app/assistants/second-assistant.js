function SecondAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

SecondAssistant.prototype.setup = function() {
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
	var textNight = ["Aquesta nit", "Ce soir", "Tonight", "Abend", "Esta noche", "Stasera"];
	this.controller.get("title-app").update(textNight[this.cookieContent.lang]);
	/* Liste */
	this.list = [];
	this.listModel = {listTitle: 'list', items: this.list};
	this.controller.setupWidget('myList',
		{
			itemTemplate: 'second/listitem',
			listTemplate: 'second/listcontainer',
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
					{ label: "Menu", toggleCmd:'nightView',
					items:[
						{iconPath:'images/now.png', command: "nowView" },
						{iconPath:'images/night.png', command: "nightView" },
						{iconPath:'images/channels.png', disabled: false, command: "channelView"}
					] },
					{}
				]
			}
		]
	};
	this.controller.setupWidget( Mojo.Menu.commandMenu, {}, this.bottomMenuModel );
	
};

SecondAssistant.prototype.readRemoteDbTable = function() {
    var url = 'http://palmsnipe.cat/programmetv-126.php';
    var request = new Ajax.Request(url,{
            method: 'post',
            parameters: {
				'view': 'night',
				'nightHour':this.cookieContent.nightHour,
				'nightMinutes': this.cookieContent.nightMinutes,
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
            evalJSON: 'true',
            onSuccess: this.readRemoteDbTableSuccess.bind(this),
            onFailure: function(){
                Mojo.Log.error('Failed to get Ajax response');
            }
        });
};
 
SecondAssistant.prototype.readRemoteDbTableSuccess = function(response) {
	/* Traduction du texte */
	var textLength = ["Durada", "Dur\351e", "Length", "L\344nge", "Duraci\363n", "Durata"];
	var textStart = ["Comen\347ament", "D\351but", "Start", "Anfang", "Comienzo", "Inizio"];
	var textEnd = ["Final", "Fin", "End", "Ende", "Final", "Fine"];
	var textProd = ["Data de producci\363", "Date de production", "Date of production", "aus dem Jahr", "Fecha de producci\363n", "Data di produzione"];
	var textRating = ["Nota", "Note", "Note", "Beachten", "Nota", "Nota"];
	
	
	var json = response.responseJSON;
	var tmp = new Array();
	
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
		if (json[field].rating != "") {
			var rating = "<br />" + textRating[this.cookieContent.lang] + ": " + json[field].rating;
		}
		else {
			var rating = "";
		}
		var start = json[field].start;
		var stop = json[field].stop;
		var length = json[field].length;
		var minutesBegin = ((new Date(start * 1000)).getMinutes() < 10) ? "0" + (new Date(start * 1000)).getMinutes() : (new Date(start * 1000)).getMinutes();
		var minutesEnd = ((new Date(stop * 1000)).getMinutes() < 10) ? "0" + (new Date(stop * 1000)).getMinutes() : (new Date(stop * 1000)).getMinutes();
		var begin = (new Date(start * 1000)).getHours() + 'h' + minutesBegin;
		var end = (new Date(stop * 1000)).getHours() + 'h' + minutesEnd;
		var prod = '<br />' + textProd[this.cookieContent.lang] + ' : ' + json[field].date;
		length = length + ' min';
		var text = textStart[this.cookieContent.lang] + ' : ' + begin;
		tmp.push({'id': field, 'image': image, 'channel': channel, 'title': title, 'length': length, 'desc': desc, 'rating': rating, 'text': text, 'prod': prod});
	}
	/* Trie le tableau */
	var tab = new Array();
	var b = 0;
	for(var i = 0; i < tmp.length; i++){
		var content = '<div class="palm-body-title">' + tmp[i].title + '</div><div class="palm-body-text">' + tmp[i].text + tmp[i].rating + '</div>';
		var drawer = '<div class="palm-body-title">' + tmp[i].title + ' (' + tmp[i].length + ')' + '</div><div class="palm-body-text">' + tmp[i].desc + '</div>';
		if (i > 0 && tab[tab.length - 1].channel == tmp[i].channel) {
			if (tmp[i - 1].title != tmp[i].title) {
				tab[tab.length - 1].content = tab[tab.length - 1].content + content;
			}
			tab[tab.length - 1].drawer = tab[tab.length - 1].drawer + drawer;
		}
		else {
			tab.push({'id': b,  'image': tmp[i].image, 'channel': tmp[i].channel, 'content': content, 'drawer': drawer});
			b++;
		}
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
      newTab[k] = {'id': tab[j].id, 'image': tab[j].image, 'channel': tab[j].channel, 'content': tab[j].content, 'drawer': tab[j].drawer};  
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
};

SecondAssistant.prototype.listClickHandler = function(event) {
	var drawerID = event.item.id + '-drawer';
	 this.controller.get(drawerID).mojo.toggleState();
	// event.item.drawer.mojo.setOpenState(!event.item.drawer.mojo.getOpenState()); 
	// Mojo.Controller.getAppController().showBanner({messageText: event.item.title}, "launchArguments", "myCategory");
};

SecondAssistant.prototype.handleReorder = function(event) {  
   
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

SecondAssistant.prototype.handleCommand = function(event) {
  if(event.type == Mojo.Event.command) {
    switch(event.command) {
      case 'nowView':
			Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.crossFade, name:"first"});
        break;
      case 'nightView':
			// Mojo.Controller.stageController.swapScene("second");
        break;
		case 'channelView':
				Mojo.Controller.stageController.swapScene({transition: Mojo.Transition.crossFade, name:"third"});
			break;
    }
  }
};

SecondAssistant.prototype.handleDelete = function(event) {
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

SecondAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

SecondAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

SecondAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
