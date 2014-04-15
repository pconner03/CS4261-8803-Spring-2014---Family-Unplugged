$(document).ready(function () {

	$("#loginForm").submit(function(e){
	
		e.preventDefault();
		
		var str = $( "#loginForm" ).serialize();
		
		var loginAPI = 'http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/login?';
		
		$.getJSON( loginAPI, str).done(function( data ) {
			if (data.sessionID!=undefined){
				//add url params
				var url = "index.html";
				//redirect
				window.location.replace(url);
			}
			else{
				console.log("Failed login.");
			}
		});
		
	
	});

});