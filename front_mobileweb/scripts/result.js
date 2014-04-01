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

$(document).ready(function () {

	var weeksInPast = 0;
	var today = new Date();
	if (hasURLVars()){
		var urlVars = getUrlVars();
 		weeksInPast = parseInt(urlVars["week"]);
 		today.setDate(today.getDate()+(7*weeksInPast));
 	}
 	//alert(today.toString());
 	alert("today is " + today);
	var weekday = today.getDay(); //0-6 (Sunday-Saturday);
	alert("weekday is "+weekday);
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
	
	$(this).find("#_date").html( prettifyDate(startSunday) + " - " + prettifyDate(lastSaturday));
	var lineChartData = {
		labels : ["S", "M", "T", "W", "T", "F", "S"],
		datasets : [
			{
				fillColor : "rgba(227,189,145,0.5)",
				strokeColor : "rgba(227,189,145,1)",
				pointColor : "rgba(227,189,145,1)",
				pointStrokeColor : "#fff",
				data : [7,8,4,5,3,6,5]
			}	
		]	
	};

	var options= {

	//Boolean - If we show the scale above the chart data			
	scaleOverlay : true,

	//Boolean - If we want to override with a hard coded scale
	scaleOverride : true,

	//For scale, now it is hardcoded. But we should choose both based on our highest value in the data

	//** Required if scaleOverride is true **
	//Number - The number of steps in a hard coded scale
	scaleSteps : 8,
	//Number - The value jump in the hard coded scale
	scaleStepWidth : 1,
	//Number - The scale starting value
	scaleStartValue : 0,

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

	var ctx = document.getElementById("canvas").getContext("2d");
	var myLine = new Chart(ctx).Line(lineChartData, options);

});
	