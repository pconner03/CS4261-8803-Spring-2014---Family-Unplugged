$(document).ready(function () {

	var lineChartData = {
		labels : ["Week 1", "Week 2", "Week 3", "Week4"],
		datasets : [
			{
				fillColor : "rgba(145,227,189,0.5)",
				strokeColor : "rgba(145,227,189,1)",
				pointColor : "rgba(145,227,189,1)",
				pointStrokeColor : "#fff",
				data : [9,6,4,2]
			},
			{
				fillColor : "rgba(145,226,227,0.5)",
				strokeColor : "rgba(145,226,227,1)",
				pointColor : "rgba(145,226,227,1)",
				pointStrokeColor : "#fff",
				data : [2,3,1,2]
			},
			{
				fillColor : "rgba(227,147,145,0.5)",
				strokeColor : "rgba(227,147,145,1)",
				pointColor : "rgba(227,147,145,1)",
				pointStrokeColor : "#fff",
				data : [4,0,0,1]
			},
			{
				fillColor : "rgba(227,189,145,0.5)",
				strokeColor : "rgba(227,189,145,1)",
				pointColor : "rgba(227,189,145,1)",
				pointStrokeColor : "#fff",
				data : [7,8,4,5]
			},
			{
				fillColor : "rgba(221,227,145,0.5)",
				strokeColor : "rgba(221,227,145,1)",
				pointColor : "rgba(221,227,145,1)",
				pointStrokeColor : "#fff",
				data : [4,4,5,5]
			},
			{
				fillColor : "rgba(162,227,145,0.5)",
				strokeColor : "rgba(162,227,145,1)",
				pointColor : "rgba(162,227,145,1)",
				pointStrokeColor : "#fff",
				data : [0,2,1,0]
			}		
		]	
	};

	var options= {

	//Boolean - If we show the scale above the chart data			
	scaleOverlay : true,

	//Boolean - If we want to override with a hard coded scale
	scaleOverride : false,

	//** Required if scaleOverride is true **
	//Number - The number of steps in a hard coded scale
	scaleSteps : null,
	//Number - The value jump in the hard coded scale
	scaleStepWidth : null,
	//Number - The scale starting value
	scaleStartValue : null,

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
	