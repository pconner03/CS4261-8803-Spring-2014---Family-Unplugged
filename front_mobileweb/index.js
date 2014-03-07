var dateFromQueryParams = "3/5/14";

//assuming this comes from an ajax call
var info = [
	{
		EventID: 111112,
		EventDate: "3/5/14",
   		ActivityID: 123456,
   		ActivityName: "Exercise (Heavy)",
    	Note: "Running",
    	duration: 0.5,
    	EntryTimeStamp: "3/5/14, 11:57pm",
    	ThirdPartyEntry: false,
    	ReportedBy: "me"
	},
	{
		EventID: 111113,
		EventDate: "3/5/14",
    	ActivityID: 123457,
   		ActivityName: "Social/Relationship Building",
    	Note: "Chili's with the team",
    	duration: 1.5,
    	EntryTimeStamp: "3/5/14, 11:58pm",
    	ThirdPartyEntry: false,
    	ReportedBy: "me"
	},
	{
		EventID: 111114,
		EventDate: "3/5/14",
    	ActivityID: 123457,
   		ActivityName: "TV/Movie",
    	Note: "House of Cards",
    	duration: 5,
    	EntryTimeStamp: "3/5/14, 11:59pm",
    	ThirdPartyEntry: true,
    	ReportedBy: "Netflix"
	},
	{
		EventID: 111115,
		EventDate: "3/5/14",
    	ActivityID: 123458,
   		ActivityName: "Creative",
    	Note: "Painting",
    	duration: 0.5,
    	EntryTimeStamp: "3/5/14, 11:58pm",
    	ThirdPartyEntry: false,
    	ReportedBy: "me"
	},
	{
		EventID: 111116,
		EventDate: "3/5/14",
    	ActivityID: 123459,
   		ActivityName: "Videogames",
    	Note: "Call of Duty",
    	duration: 2,
    	EntryTimeStamp: "3/5/14, 11:58pm",
    	ThirdPartyEntry: true,
    	ReportedBy: "Xbox Live"
	}
];

//deprecated. Delete once we have this info elsewhere	
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

	$("#_date").text(dateFromQueryParams);

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
        	li += '" class="edit"><h2>'+activity.ActivityName;
        }else{
        	li += '" class="view"><h2>'+activity.ActivityName;
        }
        li+= '</h2><p>'+activity.Note+'</p><p>'+activity.duration+' hours</p><p class="ui-li-aside">Provided by <strong>'+activity.ReportedBy+'</strong></p></a></li>';
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
    
    $(this).find("#_date").html(info.EventDate);
    
    $(this).find("#_activity").html(info.ActivityName);
    $(this).find("#_description").html(info.Note);
    $(this).find("#_duration").html(info.duration);
    $(this).find("#_provider").html(info.ReportedBy);
    $(this).find("#_timestamp").html(info.EntryTimeStamp);

});





$(document).on("pagebeforeshow", "#edit-page", function () {
    var info = $(this).data("info");
    
    $(this).find("#_date").html(info.EventDate);
    $(this).find("#_selectActivity").val(info.ActivityID); //fix me
    //$(this).find("<option>+info.activityType").prop({selected: true});
    $(this).find("#_description").val(info.Note);
    $(this).find("#_duration").val(info.duration); //fix me
	$(this).find("#_timestamp").html(info.EntryTimeStamp);
});


$(document).on("pagebeforeshow", "#add-page", function () {
    $(this).find("#_date").html(dateFromQueryParams);
});