enforceLogins = true; //togglable for local testing

$(document).ready(function () {
	
	$("#_logout").click(function(){
		$.get( "http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/logout", function(data) {
  			if (data["Error"]!=undefined){
  				console.log("Error: "+ data["Error"]);
  				if (dataBack["Error"]=="Session Expired"){
					if (enforceLogins){
						window.location.replace("login.html");
					}
				}
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