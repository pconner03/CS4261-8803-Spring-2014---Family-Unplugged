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

$(document).ready(function () {

	$("#loginForm").submit(function(e){
	
		e.preventDefault();
		
		var str = $( "#loginForm" ).serialize();
		
		var loginAPI = 'http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/login?';
		
		$.getJSON( loginAPI, str).done(function( data ) {
			if (data.sessionID!=undefined){
				//get date
				var d = new Date();
				//add url params
				var url = "index.html?date=" +toPHPFormat(d);
				//redirect
				window.location.replace(url);
			}
			else{
				alert("error");
			}
		});
		
	
	});

});