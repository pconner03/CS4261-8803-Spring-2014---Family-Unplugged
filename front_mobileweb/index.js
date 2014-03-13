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

function cutDate(dateString){
	return dateString.slice(0,dateString.indexOf('T'));
}


$(document).ready(function () {

	// 1) get url params
	var urlVars = getUrlVars();
 	var jsonDate = urlVars["date"];
 	objectDate=new Date(jsonDate);
 	apiDate = cutDate(jsonDate);

	info = [{"EventID":"40337008-a6f6-11e3-8e6b-005056962b81","PersonID":"99322e1a-a552-11e3-8e6b-005056962b81","DATE":"2014-03-08","Hours":"2","Note":"Not from call","EntryTimeStamp":"2014-03-08 14:17:12","ThirdPartyEntry":"0","ReportedBy":"Me","Name":"NOTFROMCALLActivity"}];
	
	var eventsAPI = 'http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/events?';
	var args = {
		"date": apiDate
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
			}
			else{
				alert("Session is not expired. We are receiving data.");
				//info=dataBack;
			}
		}
		//no matter what return this.
		info = [{"EventID":"40337008-a6f6-11e3-8e6b-005056962b81","PersonID":"99322e1a-a552-11e3-8e6b-005056962b81","DATE":"2014-03-08","Hours":"2","Note":"This is a test","EntryTimeStamp":"2014-03-08 14:17:12","ThirdPartyEntry":"0","ReportedBy":"Me","Name":"TestActivity"}];;
	
		// 3) fill HTML elements
		$("#_date").text(apiDate);
	

    	//set up string for adding <li/>
    	var li = "";
    	//container for $li to be added
    	$.each(info, function (i, activity) {
        	//add the <li> to "li" variable
        	//note the use of += in the variable
        	//meaning I'm adding to the existing data. not replacing it.
        	//store index value in array as id of the <a> tag
        	li += '<li><a href="#" id="'+ i;
        	if (!activity.ThirdPartyEntry){
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
        
        	$("#_prev").click(function(){
    			//subtract day
    			objectDate.setDate(objectDate.getDate() - 1);
    			window.location.href = "index.html?date="+objectDate.toJSON();
    		});
    	
    		//$("#_next").hide();
    	
    		$("#_next").click(function(){
    			//subtract day
    			objectDate.setDate(objectDate.getDate() + 1);
    			window.location.href = "index.html?date="+objectDate.toJSON();
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
});


$(document).on("pagebeforeshow", "#add-page", function () {
    $(this).find("#_date").html("hardCodedNow");
    
    //var date = "2014-03-08"
    //var submitURL = 'http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/events?';
    //submitURL = submitURL + "?date=" + date;
    //$("form").submit(function(){
    //	$.post( submitURL, $("form").serialize(), function(data) {
        	//$("#main-page").data("info", info);
    //    	alert(data["Error"]);
    //	}, 'json');
    //});
});