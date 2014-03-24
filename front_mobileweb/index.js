//***HELPER FUNCTIONS***//
function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function hasURLVars(){
	return window.location.href.indexOf('?')>0;
}

function cutDate(in_date){
	return in_date.slice(0,in_date.indexOf('T'));
}

function prettifyDate(d){
	//was using .toLocaleDateString(), but sometimes this included the day of the week
	return (d.getUTCMonth()+1) +"/" +d.getUTCDate() + "/" + (d.getUTCFullYear()%1000);
}

$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError){
	alert(thrownError);
});

$(document).ready(function () {

	today = new Date();
	// 1) get url params
	if (hasURLVars()){
		var urlVars = getUrlVars();
 		dateString = urlVars["date"];
 		objectDate=new Date(dateString);
 	}else{
 		objectDate = new Date();
 		dateString = cutDate(objectDate.toJSON());
 	}

	info = [{"EventID":"40337008-a6f6-11e3-8e6b-005056962b81","PersonID":"99322e1a-a552-11e3-8e6b-005056962b81","DATE":"2014-03-08","Hours":"2","Note":"Hardcoded activity","EntryTimeStamp":"2014-03-08 14:17:12","ThirdPartyEntry":"0","ReportedBy":"Me","Name":"Educational"}];;
	
	var eventsAPI = 'http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/events?';
	var args = {
		"date": dateString
	};

	// 2) get events from API
	$.getJSON( eventsAPI, args).done(function( dataBack ) {
		//testing
		if (dataBack==undefined){
			alert("error");
		}
		else{
			if (dataBack["Error"]!=undefined){
				alert(dataBack["Error"]);
				if (dataBack["Error"]=="Session Expired"){
					//window.location.replace("login.html");
				}
			}
			else{
				alert("Session is not expired. We are receiving data.");
				info=dataBack;
			}
		}

	
		// 3) fill HTML elements
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var dayStr = days[objectDate.getUTCDay()];
		$("#_day").text(dayStr);
		$("#_date").text(prettifyDate(objectDate));

    	//set up string for adding <li/>
    	var li = "";
    	//container for $li to be added
    	$.each(info, function (i, activity) {
        	//add the <li> to "li" variable
        	//note the use of += in the variable
        	//meaning I'm adding to the existing data. not replacing it.
        	//store index value in array as id of the <a> tag
        	li += '<li><a href="#" id="'+ i;
        	if (activity.ThirdPartyEntry=="0"){//!activity.ThirdPartyEntry){
        		li += '" class="edit"><h2>'+activity.Name;
        	}else{
        		li += '" class="view"><h2>'+activity.Name;
       		}
        	li+= '</h2><p>'+activity.Note+'</p><p>'+activity.Hours+' hours</p><p class="ui-li-aside">Provided by <strong>'+activity.ReportedBy+'</strong></p></a></li>';
    	});
    	//append list to ul
    	$("#activity-list").append(li).promise().done(function () {
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
        
        	//if we click an edit type
        	$(this).on("click", ".edit", function (e) {
            	e.preventDefault();
            
            	//store the information in the next page's data
            	$("#edit-page").data("info", info[this.id]);

           		$( ":mobile-pagecontainer" ).pagecontainer( "change", "#edit-page");
        	});

        	//refresh list to enhance its styling.
        	$(this).listview("refresh");
        
        	//only can view prev day if within a week of today
        	var lastWeekDate = today.getUTCDate()-5;
        	if (objectDate.getUTCDate()<lastWeekDate){
        		$("#_prev").addClass('ui-state-disabled');
        	}
        	
        	//only view next day if it isn't in the future.
        	if (objectDate.getUTCDate()==today.getUTCDate() 
    				& objectDate.getUTCMonth()==today.getUTCMonth() 
    					& objectDate.getUTCFullYear()==today.getUTCFullYear() ){
    			$("#_next").addClass('ui-state-disabled');
    		}
        
        	$("#_prev").click(function(){
    			//subtract day
    			objectDate.setDate(objectDate.getDate() - 1);
    			window.location.href = "index.html?date="+cutDate(objectDate.toJSON());
    		});
    	
    		$("#_next").click(function(){
    			//subtract day
    			objectDate.setDate(objectDate.getDate() + 1);
    			window.location.href = "index.html?date="+cutDate(objectDate.toJSON());
    		});
    	});
   });
    
});



$(document).on("pagebeforeshow", "#view-page", function () {
    var info = $(this).data("info");
    
    $(this).find("#_date").html(info.EventDate);
    
    $(this).find("#_activity").html(info.Name);
    $(this).find("#_description").html(info.Note);
    $(this).find("#_duration").html(info.Hours);
    $(this).find("#_provider").html(info.ReportedBy);
    $(this).find("#_timestamp").html(info.EntryTimeStamp);

});


$(document).on("pagebeforeshow", "#edit-page", function () {
    var info = $(this).data("info");
    
    //set date
    $(this).find("#_date").html(info.EventDate);
    
    //select activity name (using display name)
    $('[name=selectActivity] option').filter(function() { 
        return ($(this).text() == info.Name); //To select Blue
    }).prop('selected', true);
    
    //set description
    $(this).find("#_description").val(info.Note);
    
    //select duration (using value)
    $('[name=selectDuration] option').filter(function() { 
        	return ($(this).val() == info.Hours); //To select Blue
    	}).prop('selected', true);
    
    //set timestamp
	$(this).find("#_timestamp").html(info.EntryTimeStamp);

	//refresh select menus or changes won't display
	$("#_selectActivity").selectmenu( "refresh" );
	$("#_selectDuration").selectmenu( "refresh" );
	
	$("#_delete").click(function(){
		var jqxhr = $.ajax({
  			type: "DELETE",
  			url: "http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/events/"+info.EventID
		})
    	.done(function() {
    		alert( info.EventID );
    		window.location.href = "index.html?date="+cutDate(objectDate.toJSON());
  		})
  		.fail(function( jqXHR, textStatus ) {
  			alert( "Request failed: " + textStatus );
		});
    	
    });
});

//$( document ).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
//  	alert(thrownError);
//});

$(document).on("pagebeforeshow", "#add-page", function () {
    $(this).find("#_date").html("hardCodedNow");
    
    $("form").submit(function(){
    	//alert("before post");
    	var note = $(this).find("#_description").val();
    	var hours = $(this).find("#_duration").val();
    	var activity = $(this).find("#_selectActivity").val();
    	alert(activity);
    	var jqxhr = $.post( "http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/events",  
    		{
  				"date": dateString,
  				"note": note,
  				"activityID": activity,
  				"hours": hours
  			}, 
  			function(data) {
        	//alert("callback post");
    	})
    		.done(function() {
    			//alert( "done post" );
    			window.location.href = "index.html?date="+cutDate(objectDate.toJSON());
  			})
  			.fail(function( jqXHR, textStatus ) {
  				alert( "Request failed: " + textStatus );
			})
  			//.always(function() {
    		//	alert( "always post" );
			//});
    	//alert("after after post");
    });
    
        //$.post( submitURL, $("form").serialize(), function(data) {
        	//$("#main-page").data("info", info);
        	//alert('hey again');
        	
        	//alert(data["Error"]);
    	//}, 'json');
});