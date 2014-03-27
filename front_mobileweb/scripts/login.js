function toPHPFormat(d){
	return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
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