$(document).ready(function () {
	
	$("#_logout").click(function(){
		$.get( "http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/logout", function(data) {
  			if (data["Error"]!=undefined){
  				alert(data["Error"]);
  			}
    	})
    		.done(function() {
    			window.location.href = "login.html";
  			})
  			.fail(function( jqXHR, textStatus ) {
  				alert( "Request failed: " + textStatus );
			})
	})
});