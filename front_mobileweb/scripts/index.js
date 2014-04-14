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

function toPHPFormat(d){
	var monthStr = "" +(d.getMonth()+1);
	if (monthStr.length<2){
		monthStr = "0" + monthStr;
	}
	var dateStr = "" + d.getDate();
	if (dateStr.length<2){
		dateStr = "0" + dateStr;
	}
	return d.getFullYear() + "-" + monthStr + "-" + dateStr;
}

function prettifyDate(d){
	//was using .toLocaleDateString(), but sometimes this included the day of the week
	return (d.getMonth()+1) +"/" +d.getDate() + "/" + (d.getFullYear()%1000);
}

function toDateObject(phpString){
		var arr= phpString.split("-");
		var year = arr[0];
		var month = arr[1];
		var day = arr[2];
		var betterformat= month+"/"+day+"/"+year;
 		return new Date(betterformat);
}

$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError){
	console.log(thrownError);
});

$(document).ready(function () {

	today = new Date();
	// 1) get url params
	if (hasURLVars()){
		var urlVars = getUrlVars();
 		phpFormatDate = urlVars["date"];
 		objectDate = toDateObject(phpFormatDate)
 	}else{
 		objectDate = new Date();
 		phpFormatDate = toPHPFormat(objectDate);
 	}

	info = [{"EventID":"40337008-a6f6-11e3-8e6b-005056962b81","PersonID":"99322e1a-a552-11e3-8e6b-005056962b81","DATE":"2014-03-08","Hours":"2","Note":"Hardcoded activity","EntryTimeStamp":"2014-03-08 14:17:12","ThirdPartyEntry":"0","ReportedBy":"Me","Name":"Educational"}];
	
	var eventsAPI = 'http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/events?';
	var args = {
		"date": phpFormatDate
	};

	// 2) get events from API
	$.getJSON( eventsAPI, args).done(function( dataBack ) {
		//testing
		if (dataBack==undefined){
			console.log("error");
		}
		else{
			if (dataBack["Error"]!=undefined){
				console.log("Error" + dataBack["Error"]);
				if (dataBack["Error"]=="Session Expired"){
					//window.location.replace("login.html");
				}
			}
			else{
				info=dataBack;
			}
		}
		
		//Add fake report
		info.push({"EventID":"85acc5be-b220-11e3-8e6b-005056962b81","DATE":phpFormatDate,"Hours":"0.5","Note":"Running","EntryTimeStamp":"2014-03-29 14:17:12","ThirdPartyEntry":"1","ReportedBy":"FitBit, Inc.","Name":"Exercise (Heavy)"});
		info.push({"EventID":"5108f6d8-b221-11e3-8e6b-005056962b81","DATE":phpFormatDate,"Hours":"5.0","Note":"Breaking Bad","EntryTimeStamp":"2014-03-29 14:17:12","ThirdPartyEntry":"1","ReportedBy":"Netflix, Inc.","Name":"Watching TV/Movie"});
	
		// 3) fill HTML elements
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var dayStr = days[objectDate.getDay()];
		$("#_day").text(dayStr);
		$("#_date").text(prettifyDate(objectDate));


   		var li="";
    	firstInternal = true;
    	firstExternal = true;
    	//container for $li to be added
    	$.each(info, function (i, activity) {
        	//add the <li> to "li" variable
        	//note the use of += in the variable
        	//meaning I'm adding to the existing data. not replacing it.
        	//store index value in array as id of the <a> tag
        	if (activity.ThirdPartyEntry=="0"){
        		if (firstInternal){
        			li+='<li data-role="list-divider">Self-Reported</li>';
        			firstInternal = false;
        		}
        		li += '<li><a href="#" id="'+ i;
        		li += '" class="edit"><h2>'+activity.Name;
        		li+= '</h2><p>'+activity.Note+'</p><p>'+activity.Hours+' hours</p></a></li>';
        	}else{
        		if (firstExternal){
        			li+='<li data-role="list-divider">Automatically Reported</li>';
        			firstExternal = false;
        		}
        		li += '<li><a href="#" id="'+ i;
        		li += '" class="view"><h2>'+activity.Name;
        		li+= '</h2><p>'+activity.Note+'</p><p>'+activity.Hours+' hours</p><p class="ui-li-aside">Provided by <strong>'+activity.ReportedBy+'</strong></p></a></li>';
       		}
    	});

    	//append list to ul
    	$("#activity-list").html(li).promise().done(function () {
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
        	var lastWeekDate = today.getDate()-5;
        	if (objectDate.getDate()<lastWeekDate){
        		$("#_prev").addClass('ui-state-disabled');
        	}
        	
        	//only view next day if it isn't in the future.
        	if (objectDate.getDate()==today.getDate() 
    				& objectDate.getMonth()==today.getMonth() 
    					& objectDate.getFullYear()==today.getFullYear() ){
    			$("#_next").addClass('ui-state-disabled');
    		}
        
        	$("#_prev").click(function(){
    			//subtract day
    			objectDate.setDate(objectDate.getDate() - 1);
    			window.location.href = "index.html?date="+toPHPFormat(objectDate);
    		});
    	
    		$("#_next").click(function(){
    			//subtract day
    			objectDate.setDate(objectDate.getDate() + 1);
    			window.location.href = "index.html?date="+toPHPFormat(objectDate);
    		});
    	});
   });
    
});



$(document).on("pagebeforeshow", "#view-page", function () {
    var info = $(this).data("info");
    
    $(this).find("#_date").html(prettifyDate(toDateObject(info.DATE)));
    
    $(this).find("#_activity").html(info.Name);
    $(this).find("#_description").html(info.Note);
    $(this).find("#_duration").html(info.Hours);
    $(this).find("#_provider").html(info.ReportedBy);
    $(this).find("#_timestamp").html(info.EntryTimeStamp);

});


$(document).on("pagebeforeshow", "#edit-page", function () {
    var info = $(this).data("info");
    
    //set date
    $(this).find("#_date").html(prettifyDate(toDateObject(info.DATE)));
    
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
	
	$("form").submit(function(){
    	var note = $(this).find("#_description").val();
    	var hours = $(this).find("#_selectDuration").val();
    	var activity = $(this).find("#_selectActivity").val();
    	var jqxhr = $.post( "http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/eventEdit",  
    		{
    			"eventID": info.EventID,
  				"date": phpFormatDate,
  				"note": note,
  				"activityID": activity,
  				"hours": hours
  			}, 
  			function(data) {
    	})
    		.done(function() {
    			window.location.href = "index.html?date="+toPHPFormat(objectDate);
  			})
  			.fail(function( jqXHR, textStatus ) {
  				console.log( "Request failed: " + textStatus );
			})
    });
	
	$("#_delete").click(function(){
		var jqxhr = $.ajax({
  			type: "DELETE",
  			url: "http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/events/"+info.EventID
		})
    	.done(function() {
    		window.location.href = "index.html?date="+phpFormatDate;
  		})
  		.fail(function( jqXHR, textStatus ) {
  			console.log( "Request failed: " + textStatus );
		});
    	
    });
});

$(document).on("pagebeforeshow", "#add-page", function () {
    $(this).find("#_date").html(prettifyDate(objectDate));
    
    $("form").submit(function(){
    	var note = $(this).find("#_description").val();
    	var hours = $(this).find("#_duration").val();
    	var activity = $(this).find("#_selectActivity").val();
    	var jqxhr = $.post( "http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/events",  
    		{
  				"date": phpFormatDate,
  				"note": note,
  				"activityID": activity,
  				"hours": hours
  			}, 
  			function(data) {
    	})
    		.done(function() {
    			window.location.href = "index.html?date="+phpFormatDate;
  			})
  			.fail(function( jqXHR, textStatus ) {
  				console.log( "Request failed: " + textStatus );
			})
    });
    
});