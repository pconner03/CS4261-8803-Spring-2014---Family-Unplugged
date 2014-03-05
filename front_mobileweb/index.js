//assuming this comes from an ajax call
var info = [
	{
		id: 111112,
		date: "3/5/14",
   		activityType: "ex_heavy",
    	description: "Running",
    	duration: 0.5,
    	timestamp: "3/5/14, 11:57pm",
    	provider: "me"
	},
	{
		id: 111113,
		date: "3/5/14",
    	activityType: "social",
    	description: "Chili's with the team",
    	duration: 1.5,
    	timestamp: "3/5/14, 11:58pm",
    	provider: "me"
	},
	{
		id: 111114,
		date: "3/5/14",
    	activityType: "TVmovies",
    	description: "House of Cards",
    	duration: 5,
    	timestamp: "3/5/14, 11:59pm",
    	provider: "Netflix"
	}
];
	
var activityTranslator = {
	browsing: "Browsing the Web/Social Media",
	creative: "Creative",
	education: "Educational",
	ex_light: "Exercise (Light)",
	ex_heavy: "Exercise (Heavy)",
	social: "Social/Relationship Building",
	TVmovies: "TV/Movie",
	videogames: "Videogames",
	volunteer: "Volunteering"
}

//pageinit event for first page
//triggers only once
//write all your on-load functions and event handlers pertaining to page1
$(document).on("pageinit", "#main-page", function () {


    //set up string for adding <li/>
    var li = "";
    //container for $li to be added
    $.each(info, function (i, activity) {
        //add the <li> to "li" variable
        //note the use of += in the variable
        //meaning I'm adding to the existing data. not replacing it.
        //store index value in array as id of the <a> tag
        li += '<li><a href="#" id="'+ i;
        if (activity.provider=='me'){
        	li += '" class="edit"><h2>'+activityTranslator[activity.activityType];
        }else{
        	li += '" class="view"><h2>'+activityTranslator[activity.activityType];
        }
        li+= '</h2><p>'+activity.description+'</p><p>'+activity.duration+'</p><p class="ui-li-aside">Provided by <strong>'+activity.provider+'</strong></p></a></li>';
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

            $.mobile.changePage("#view-page");
        });
        
        //if we click an edit type
        $(this).on("click", ".edit", function (e) {
            e.preventDefault();
            
            //store the information in the next page's data
            $("#edit-page").data("info", info[this.id]);

            $.mobile.changePage("#edit-page");
        });

        //refresh list to enhance its styling.
        $(this).listview("refresh");
    });
});



$(document).on("pagebeforeshow", "#view-page", function () {
    var info = $(this).data("info");
    
    $(this).find("#_date").html(info.date);
    
    $(this).find("#_activity").html(activityTranslator[info.activityType]);
    $(this).find("#_description").html(info.description);
    $(this).find("#_duration").html(info.duration);
    $(this).find("#_provider").html(info.provider);
    $(this).find("#_timestamp").html(info.timestamp);

});





$(document).on("pagebeforeshow", "#edit-page", function () {
    var info = $(this).data("info");
    
    $(this).find("#_date").html(info.date);
    $(this).find("#_selectActivity").val(info.activityType); //fix me
    $(this).find("#_description").val(info.description);
    $(this).find("#_duration").val(info.duration); //fix me
	$(this).find("#_timestamp").html(info.timestamp);
});