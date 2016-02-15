$(document).ready(function(){	

		$(".switch").click(function() {
  		  $(".switch").removeClass("active");
   		   $(this).addClass("active");

   		   var status = $(this).attr('class');
   		   status = status.split(" ");
   		   console.log(status[0]);

   		 	if (status[0] === "all") {
   		   		$(".twitch-user-online ").show();
   		   		$(".twitch-user-offline").show();
   		 	}

   		   if (status[0] === "online") {
   		   		$(".twitch-user-online ").show();
   		   		$(".twitch-user-offline").hide();
   		   }

   		   if (status[0] === "offline") {
   		   	$(".twitch-user-online ").hide();
   		   	$(".twitch-user-offline").show();
   		   }
   		});

		

    	$(".btn1").click(function() {
			searchUsr();
		});

		$('.twitch-search').keypress(function(e){
      		if(e.keyCode==13)
     	 	searchUsr();
    	});

    	function searchUsr(){

    		var searchWord = document.getElementsByClassName("twitch-search")[0].value;

    		$('.twitch-user > .usr > a').each(function () {

    			if (this.innerHTML.toLowerCase() === searchWord.toLowerCase()) {
	    			$(this).closest('.twitch-user').show();
    			} else {
   					$(this).closest('.twitch-user').hide();
   				}
   			 
			});

    	}


   	function getStreamerStatus() {

		var streamers = ["sceneofactionmusic", "freecodecamp", "jcarverpoker", "habathcx", "lirik", "thomasballinger", "brunofin", "comster404", "beohoff", "ogamingsc2", "esl_sc2", "sheevergaming"];
 
   		var streamURL = 'https://api.twitch.tv/kraken/streams/';
        var html ="";

        // main ajax loop
 		for (var i = 0; i < streamers.length; i++) {
      		$.ajax({
         		url: streamURL + streamers[i],
                dataType: 'jsonp',
                type: 'GET',
                headers: { 'Accept': 'application/vnd.twitchtv.v3+json' },
                success: function(dataWeGotViaJsonp){

                   var results = dataWeGotViaJsonp;
                   //console.log(results);

					if (results.stream === null || typeof(results.stream) == "object") {

						var channel = results._links.channel;
						
						
	             	//ajax call to get the logo
	            	$.ajax({
		            	url: channel,
	                    dataType: 'jsonp',
	                    type: 'GET',
	                    headers: { 'Accept': 'application/vnd.twitchtv.v3+json' },
	            		success: function(photoWeGotViaJsonp) {
	                  	// all the code to construct the HTML would go here
	                 	// here we have access both to the main stream data here and the stream logo
	                 	
							var photo_result = photoWeGotViaJsonp;
	                 	
	                 	if (results.stream !== null) {
	                 	
	                		var onlineUsr = results.stream.channel.display_name;
	                    	var usrPhoto = photo_result.logo;
	                    	var streamDetails = results.stream.game;
	                    	var onlineUsrURL = "http://www.twitch.tv/" + onlineUsr;
	                    	var viewers = results.stream.viewers;
	                    	var status = results.stream.channel.status;

						
							html = "<div class = 'row twitch-user twitch-user-online'><div class = 'col-lg-2'><img class = 'streamer-logo' src = '" + usrPhoto + "'></div><div class = 'col-lg-5 usr'><a href ='" + onlineUsrURL + "' target='_blank'>" + onlineUsr + "</a>  ( " + viewers + "viewers )</div><div class = 'col-lg-5'>" + streamDetails + " - " + status + "</div></div>";
                        
                        	$(".status_wrap").prepend(html); 
                        }   

                        if (results.stream === null) {

	                        var url = results._links.channel;
	                        var offineUsr = url.split('/').pop();
	                        var offlineUsrPhoto;
	                        var offlineUsrURL = "http://www.twitch.tv/" + offineUsr;

	                        if (photo_result.logo === null) {
								offlineUsrPhoto = "http://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F";
	                        } else {
	                        	offlineUsrPhoto = photo_result.logo;
	                        }

                        	html = "<div class = 'row twitch-user twitch-user-offline'><div class = 'col-lg-2'><img class = 'streamer-logo' src = '" + offlineUsrPhoto + "'></div><div class = 'col-lg-5 usr'><a href ='" + offlineUsrURL + "' target='_blank'>" + offineUsr + "</a></div><div class = 'col-lg-5'> Offline </div></div>";
                        
                        	$(".status_wrap").append(html); 

                        }

	             	}
            		}); // end of second ajax call

	            	} else {
	            		var unexistentUser = results.message;
	            		unexistentUser = unexistentUser.split(' ');
	            		unexistentUser = unexistentUser[1].replace(/'/gm,'')
	            		var unexistentUserPhoto = "http://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F";
	            		var unexistentUserURL = "http://www.twitch.tv/" + unexistentUser; 

	            		html = "<div class = 'row twitch-user twitch-user-offline'><div class = 'col-lg-2'><img class = 'streamer-logo' src = '" + unexistentUserPhoto + "'></div><div class = 'col-lg-5 usr'><a href ='" + unexistentUserURL + "' target='_blank'>" + unexistentUser + "</a></div><div class = 'col-lg-5'> Account Closed </div></div>";

	            		$(".status_wrap").append(html); 
	            	}
	            }
     		});

		} // end of for loop

    } // end of getStreamerStatus()

	getStreamerStatus();

});
