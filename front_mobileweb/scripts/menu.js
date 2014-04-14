$(document).ready(function () {
	
	$("#_logout").click(function(){
		$.get( "http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/logout", function(data) {
  			if (data["Error"]!=undefined){
  				console.log("Error: "+ data["Error"]);
  			}
    	})
    		.done(function() {
    			window.location.href = "login.html";
  			})
  			.fail(function( jqXHR, textStatus ) {
  				console.log( "Request failed: " + textStatus );
			})
	})
});