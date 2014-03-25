function emailValidator(emailEntered){
    var emailvalid = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(emailEntered.match(emailvalid)){
        return true;
    }else{
        return false;
    }
}

function popupErrorMessage(message){
	$("#_errorMsg").text(message);
	$("#popupDialog").popup( "open" );
}

$(document).ready(function () {
	$("#_registerForm").submit(function(event){
    	var username = $(this).find("#_username").val();
    	var p1 = $(this).find("#_passwordorig").val();
    	var p2 = $(this).find("#_passwordconfirm").val();
    	var year = $(this).find("#_dobyear").val();
    	var month = $(this).find("#_dobmonth").val();
    	var day = $(this).find("#_dobday").val();
    	var first = $(this).find("#_first").val();
    	var last = $(this).find("#_last").val();
    	var email= $(this).find("#_email").val();
    	
		//time to validate
		var missingStr = "Form is missing required fields.";
		var msg="";
		if (!first){
			msg = missingStr;
		}
		if (!last){
			msg = missingStr;
		}
		if (!email){
			msg = missingStr;
		}
		if (!username){
			msg = missingStr;
		}
		if (!p1){
			msg = missingStr;
		}
		if (!p2){
			msg = missingStr;
		}

		//email
		if (!msg){
			if (!emailValidator(email)){
				msg="Invalid e-mail.";
			}
		}
		//password
		if (!msg){
			if (p1!=p2){
				msg="Passwords do not match.";
			}
		}
		//super sophisticated error checking
		if (msg){
			event.preventDefault();
			popupErrorMessage(msg);
		}else{
			event.preventDefault();
    		var jqxhr = $.post( "http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/register",  
    			{
  					"username": username,
  					"password": p1,
  					"name": (first+" "+last),
  					"email": email,
  					"dateOfBirth": (year+"-"+month+"-"+day),
  				}, 
  				function(data) {
    			})
    			.done(function() {
    				var loginAPI = 'http://dev.m.gatech.edu/d/pconner3/w/4261/c/api/login?';
    				$.getJSON( loginAPI, {"username": username, "password": p1}).done(function( data ) {
						if (data.sessionID!=undefined){
							window.location.replace("index.html");
						}
						else{
							alert("error");
						}
					});
  				})
  				.fail(function( jqXHR, textStatus ) {
  					popupErrorMessage(textStatus);
				});
    	}//end else
    });
});