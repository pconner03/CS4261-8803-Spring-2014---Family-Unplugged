$(document).ready(function () {
	//assume info is sorted with teams I lead first

	info = [{"Name": "Hardcode Team 1", "ID": "AJHGYD67", "Members": ["Katy", "John"]}, {"Name": "Hardcode Team 2", "ID": "AJHGYD68", "Members": ["Doug", "Steve", "Jack"]}];
    var teamsAPI = 'http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/teams';
	var args = {};

	// 2) get events from API
	$.getJSON( teamsAPI, args).done(function( dataBack ) {
		//testing
		if (dataBack==undefined){
			console.log("Error: data undefined");
		}
		else{
			if (dataBack["Error"]!=undefined){
				console.log(dataBack["Error"]);
				info = [{"Name": "Hardcode Team 1", "ID": "AJHGYD67", "Members": ["Katy", "John"]}, {"Name": "Hardcode Team 2", "ID": "AJHGYD68", "Members": ["Doug", "Steve", "Jack"]}];
			}
			else{
				info=dataBack;
			}
		}
		
		//fake leaders for now.
		info[0].Leader = "Me";

    	//set up string for adding <li/>
    	var li="";
    	if ((info[0]).Leader=="Me"){
    		li += '<li data-role="list-divider">Teams I Lead</li>';
    	}
    	flag = true;
    	//container for $li to be added
    	$.each(info, function (i, team) {
        	//add the <li> to "li" variable
        	//note the use of += in the variable
        	//meaning I'm adding to the existing data. not replacing it.
        	//store index value in array as id of the <a> tag
        	if (team.Leader!="Me" & flag){
        		li+='<li data-role="list-divider">Teams I Joined</li>'
        		flag = false;
        	}
        	li += '<li><a href="#" id="'+ i;
        	li += '" class="view"><h2>'+team.Name;
        	li+= '</h2></a></li>';
    	});
    	//append list to ul
    	$("#team-list").html(li).promise().done(function () {
        	//wait for append to finish - thats why you use a promise()
        	//done() will run after append is done
        	//add the click event for the redirection to happen to #details-page
        
        	//if we click a view type
        	$(this).on("click", ".view", function (e) {
            	e.preventDefault();
            
            	//store the information in the next page's data
            	$("#view-page").data("info", info[this.id]);

            	//$.mobile.changePage("#view-page");
				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#view-page");
        	});

        	//refresh list to enhance its styling.
        	$(this).listview("refresh");

  		});
   });
    
});

$(document).on("pagebeforeshow", "#view-page", function () {
    var info = $(this).data("info");
    
    $(this).find("#_name").html(info.Name);
    
    $(this).find("#_leader").html(info.Leader);
    if (info.Leader=="Me"){
    	$("#_leaveteambtn").text("Delete Team");
    }else{
    	$("#_leaveteambtn").text("Leave Team");
    }
    
    var arr = info.Members;
    var li='';
	for (var i = 0; i < arr.length; i++) {
    	li += '<li>';
     	li += arr[i];
        li += '</li>';
	}
	if (info.Leader=="Me"){
		li += '<li><a href="#invite-page" data-role="button" data-mini="true" data-icon="plus" data-inline="true" data-theme="a">Invite new member(s)</a></li>';
    }
    $("#member-list").html(li).promise().done(function () {
    	$(this).listview("refresh");
    });

});

$(document).on("pagebeforeshow", "#add-page", function () {
   $("form").submit(function(e){
		e.preventDefault();
		var name = $(this).find("#_teamname").val();
		var emailAddresses = $(this).find("#_invitations").val();
		//api call to create team
		var jqxhr = $.post( "http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/eventEdit",  
    		{
    			"name": name
  			}, 
  			function(data) {
    	})
    	.done(function() {
   			window.location.href = 'mailto:'+emailAddresses+'?subject=Join my team on Family Unplugged!&body=Pretty html with link to join my team here.';
   			window.location.replace("teams.html");
  		})
  		.fail(function( jqXHR, textStatus ) {
  			console.log( "Request failed: " + textStatus );
		})
   	});
});

$(document).on("pagebeforeshow", "#invite-page", function () {
	$("form").submit(function(e){
		e.preventDefault();
		var emailAddresses = $(this).find("#_invitations").val();
   		window.location.href = 'mailto:'+emailAddresses+'?subject=Join my team on Family Unplugged!&body=Pretty html with link to join my team here.';
   		window.location.replace("teams.html");
   	});
});