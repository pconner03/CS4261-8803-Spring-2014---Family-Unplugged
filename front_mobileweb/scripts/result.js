enforceLogins = true; //togglable for local testing

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

function updateData(){
	while (physicalArr.length>0 | mentalArr.length>0 | socialArr.length>0){
		physicalArr.pop();
        mentalArr.pop();
        socialArr.pop();
	}

	$.each(info, function (i, day) {
        physicalArr.push(day["PhysicalPoints"]);
        mentalArr.push(day["MentalPoints"]);
        socialArr.push(day["SocialPoints"]);
    });
}

$(document).ready(function () {

	var weeksInPast = 0;
	var today = new Date();
	if (hasURLVars()){
		var urlVars = getUrlVars();
 		weeksInPast = parseInt(urlVars["week"]);
 		today.setDate(today.getDate()+(7*weeksInPast));
 	}

	var weekday = today.getDay(); //0-6 (Sunday-Saturday);
	var lastSaturday = new Date(today.getTime()); //effectively clones "today"
	lastSaturday.setDate(lastSaturday.getDate() - (weekday + 1));
	var startSunday = new Date(lastSaturday.getTime()); //effectively clones "last saturday" **what we clone is important for resetting the date
	startSunday.setDate(lastSaturday.getDate() - 6);
    
    if (weeksInPast>=0){
    	$("#_next").addClass('ui-state-disabled');
    }
    
    $("#_prev").click(function(){
    	weeksInPast+=(-1);
    	window.location.href = "result.html?week="+weeksInPast;
    });
    	
    $("#_next").click(function(){
    	weeksInPast+=1;
    	window.location.href = "result.html?week="+weeksInPast;
    });
    $(this).find("#_date").text( prettifyDate(startSunday) + " - " + prettifyDate(lastSaturday));
    
    //INSERT AJAX CALL HERE
    //get this person's teams
    var teams = teams = [{"Name": "Hardcode Team 1", "ID": "AJHGYD67", "Members": ["Katy", "John"]}, {"Name": "Hardcode Team 2", "ID": "AJHGYD68", "Members": ["Doug", "Steve", "Jack"]}];
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
				if (dataBack["Error"]=="Session Expired"){
					if (enforceLogins){
						window.location.replace("login.html");
					}
				}
				teams = [{"Name": "Hardcode Team 1", "ID": "AJHGYD67", "Members": ["Katy", "John"]}, {"Name": "Hardcode Team 2", "ID": "AJHGYD68", "Members": ["Doug", "Steve", "Jack"]}];
			}
			else{
				teams=dataBack;
			}
		}
	
     
    	var opt = '<option val="me">Me</option>';
    	$.each(teams, function (i, team) {
        	opt+='<option val="' + team.ID + '">' + team.Name + '</option>';
    	});
    
    	$("#_selectTeam").html(opt).promise().done(function(){
		
    		info = [{"Date":"2014-04-01","MentalPoints":3,"PhysicalPoints":9,"SocialPoints":0},{"Date":"2014-04-02","MentalPoints":1,"PhysicalPoints":9,"SocialPoints":0},{"Date":"2014-04-03","MentalPoints":8,"PhysicalPoints":8,"SocialPoints":8},{"Date":"2014-04-04","MentalPoints":2,"PhysicalPoints":0,"SocialPoints":0},{"Date":"2014-04-05","MentalPoints":9,"PhysicalPoints":3,"SocialPoints":3},{"Date":"2014-04-06","MentalPoints":0,"PhysicalPoints":0,"SocialPoints":0},{"Date":"2014-04-07","MentalPoints":0,"PhysicalPoints":0,"SocialPoints":0}];
	
			reportsAPI = 'http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/reports?';
			args = {
				"startDate": toPHPFormat(startSunday),
				"endDate": toPHPFormat(lastSaturday)
			};
	
			//get their points for the graph.
			$.getJSON( reportsAPI, args).done(function( dataBack ) {
				//testing
				if (dataBack==undefined){
					console.log("Error: data undefined");
				}
				else{
					if (dataBack["Error"]!=undefined){
						console.log(dataBack["Error"]);
						if (dataBack["Error"]=="Session Expired"){
							if (enforceLogins){
								window.location.replace("login.html");
							}
						}
					}
					else{
						info=dataBack;
					}
				}
	
			Array.max = function( array ){
    			return Math.max.apply( Math, array );
			};	
			
			Array.min = function( array ){
    			return Math.min.apply( Math, array );
			};	
	
			//on the callback from the api call do all of the following:
			physicalArr = new Array();
			mentalArr = new Array();
			socialArr = new Array();
			updateData();
   	
   			var ctx = document.getElementById("canvas").getContext("2d");
			chartObject = new Chart(ctx);
   			loadChart(chartObject, physicalArr);


			$('input[type=radio]').change(function () {
    			var whichSelected = $('input[type=radio]').filter(':checked').val();
    			if (whichSelected=="PhysicalPoints"){
    				loadChart(chartObject, physicalArr);
    			}
    			if (whichSelected=="MentalPoints"){
    				loadChart(chartObject, mentalArr);
    			}
    			if (whichSelected=="SocialPoints"){
    				loadChart(chartObject, socialArr);
    			}
  			});

  	
  			});//end of getting info for chart
  		
  		}); //end of team selector filling
  	
  		$("#_selectTeam").change(function(){
  			//INSERT AJAX CALL HERE
  			var teamID = $("#_selectTeam").val();
  			
  			argsTemp = args;
  			argsTemp["TeamID"] = teamID;
  			
  			$.getJSON( reportsAPI, argsTemp).done(function( dataBack ) {
				//testing
				if (dataBack==undefined){
					console.log("Error: data undefined");
				}
				else{
					if (dataBack["Error"]!=undefined){
						if (dataBack["Error"]=="Session Expired"){
							if (enforceLogins){
								window.location.replace("login.html");
							}
						}
						info = [{"Date":"2014-04-01","MentalPoints":7,"PhysicalPoints":0,"SocialPoints":0},
						{"Date":"2014-04-02","MentalPoints":5,"PhysicalPoints":1,"SocialPoints":0},
						{"Date":"2014-04-03","MentalPoints":2,"PhysicalPoints":2,"SocialPoints":8},
						{"Date":"2014-04-04","MentalPoints":3,"PhysicalPoints":9,"SocialPoints":0},
						{"Date":"2014-04-05","MentalPoints":2,"PhysicalPoints":3,"SocialPoints":3},
						{"Date":"2014-04-06","MentalPoints":4,"PhysicalPoints":1,"SocialPoints":2},
						{"Date":"2014-04-07","MentalPoints":9,"PhysicalPoints":1,"SocialPoints":0}];
						updateData();
						var radio = $("input[type=radio]");
    					radio[0].checked = true;
    					radio.checkboxradio("refresh");
						loadChart(chartObject, physicalArr);
					}
					else{
						info=dataBack;
						updateData();
						var radio = $("input[type=radio]");
    					radio[0].checked = true;
    					radio.checkboxradio("refresh");
    					loadChart(chartObject, physicalArr);
					}
				}
  			
  			});
  		});
  	});
  	
});

function loadChart(chartObject, toggleArr){

	var lineChartData = {
		labels : ["S", "M", "T", "W", "T", "F", "S"],
		datasets : [
			{
				fillColor : "rgba(227,189,145,0.5)",
				strokeColor : "rgba(227,189,145,1)",
				pointColor : "rgba(227,189,145,1)",
				pointStrokeColor : "#fff",
				data : toggleArr
			}	
		]	
	};

	var arrMax = Array.max(toggleArr);
	
	var arrMin = Array.min(toggleArr);
	var absMin = Math.abs(arrMin);
	var rangePos = (absMin > arrMax) ? absMin : arrMax;
	var rangeNeg = (-1)*rangePos;
	

	var options= {

	//Boolean - If we show the scale above the chart data			
	scaleOverlay : true,

	//Boolean - If we want to override with a hard coded scale
	scaleOverride : true,

	//For scale, now it is hardcoded. But we should choose both based on our highest value in the data

	//** Required if scaleOverride is true **
	//Number - The number of steps in a hard coded scale
	scaleSteps : 11,
	//Number - The value jump in the hard coded scale
	scaleStepWidth : Math.ceil((Math.abs(rangeNeg)+rangePos)/10),
	//Number - The scale starting value
	scaleStartValue : rangeNeg,

	//String - Colour of the scale line	
	scaleLineColor : "rgba(0,0,0,.1)",

	//Number - Pixel width of the scale line	
	scaleLineWidth : 1,

	//Boolean - Whether to show labels on the scale	
	scaleShowLabels : true,

	//Interpolated JS string - can access value
	scaleLabel : "<%=value%>",

	//String - Scale label font declaration for the scale label
	scaleFontFamily : "'Arial'",

	//Number - Scale label font size in pixels	
	scaleFontSize : 12,

	//String - Scale label font weight style	
	scaleFontStyle : "normal",

	//String - Scale label font colour	
	scaleFontColor : "#666",	

	///Boolean - Whether grid lines are shown across the chart
	scaleShowGridLines : true,

	//String - Colour of the grid lines
	scaleGridLineColor : "rgba(0,0,0,.05)",

	//Number - Width of the grid lines
	scaleGridLineWidth : 1,	

	//Boolean - Whether the line is curved between points
	bezierCurve : true,

	//Boolean - Whether to show a dot for each point
	pointDot : true,

	//Number - Radius of each point dot in pixels
	pointDotRadius : 3,

	//Number - Pixel width of point dot stroke
	pointDotStrokeWidth : 1,

	//Boolean - Whether to show a stroke for datasets
	datasetStroke : true,

	//Number - Pixel width of dataset stroke
	datasetStrokeWidth : 2,

	//Boolean - Whether to fill the dataset with a colour
	datasetFill : true,

	//Boolean - Whether to animate the chart
	animation : true,

	//Number - Number of animation steps
	animationSteps : 60,

	//String - Animation easing effect
	animationEasing : "easeOutQuart",

	//Function - Fires when the animation is complete
	onAnimationComplete : null

	}
	
	chartObject.Line(lineChartData, options);
}

