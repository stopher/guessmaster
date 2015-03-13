var Datastore = (function(){
	var myPlayer = {
		uuid:null,
		name: ""
	},
	BASE_URL = "http://217.170.201.88/",
	//BASE_URL = "http://localhost:9000/",
	settings =  {
    
		NEW_GUESS_URL : BASE_URL+'guess',
		FETCH_PLAYER_URL : BASE_URL+'player',
	    FETCH_TOPSCORES_URL : BASE_URL+'topscores'
	},
	doRequest = function(url, type, data, doneCallback) {
	    var xhr = $.ajax({
	      type: type,
	      url: url,
	      data: JSON.stringify(data),
	      contentType: 'application/json; charset=UTF-8',
	      dataType: 'json'
	    })
	    .done(function( response ) {
	      if(doneCallback) {
	        doneCallback(response);
	      }	   
	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {	     
	      console.log('An error occured:'+textStatus+". Desc:"+errorThrown);
	    })
	    .always(function( jqXHR, textStatus, errorThrown ) {
	      
	    });  
	},
	doGetRequest = function(url, type, data, doneCallback) {
	    var xhr = $.ajax({
	      type: type,
	      url: url,
	      data: data,
	      dataType: 'json'
	    })
	    .done(function( response ) {
	      if(doneCallback) {
	        doneCallback(response);
	      }	      
	    })
	    .fail(function(jqXHR, textStatus, errorThrown) {
	      console.log('An error occured:'+textStatus+". Desc:"+errorThrown);
	    })
	    .always(function( jqXHR, textStatus, errorThrown ) {
	      
	    });  
	},

	me = {};
	me.getMyPlayer = function() {
		if(!myPlayer.uuid){
			var uuid = guid();
			myPlayer = {"uuid": uuid, "name":""};
		}
		return myPlayer;
	},
	me.savePlayer = function(player) {
		localStorage.setItem("myPlayer", JSON.stringify(player)); // local store
		myPlayer = player;
	},
	me.saveGuess = function(guess, doneCallback) {
    	doRequest(settings.NEW_GUESS_URL, "POST", guess, doneCallback);
	},
	me.fetchPlayer = function(uuid, doneCallback) {
		doGetRequest(settings.FETCH_PLAYER_URL, "GET", {"uuid":uuid}, doneCallback);
	},
	me.fetchTopscores = function(doneCallback) {
		doGetRequest(settings.FETCH_TOPSCORES_URL, "GET", null, doneCallback);
	},
  	me.init = function() {
		if(localStorage.getItem("myPlayer")) {
        	myPlayer = JSON.parse(localStorage.getItem("myPlayer"));
     	}
	};

	return me;
}());