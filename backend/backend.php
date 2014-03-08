<?php

include 'dbhelp.php';

function listActivities(){
	$dbQuery = sprintf("SELECT * FROM activity_temp");
	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

function getActivity($acName){
	$dbQuery = sprintf("SELECT * FROM activity_temp WHERE name LIKE '%%%s%%'", mysql_real_escape_string($acName));
	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

/**
 * Doesn't work anymore
 */
function getUserKey($encUsername, $encPassword){
	$dbQuery = sprintf("SELECT PersonID from Person WHERE 
		LoginID='%s' AND PasswordHash=SHA2('%s', 256)", 
		mysql_real_escape_string(base64_decode(urldecode($encUsername))), 
		mysql_real_escape_string(base64_decode(urldecode($encPassword))));
	//We are using SHA-256 hashing

	$result = getDBResultsArray($dbQuery);
	header("Content-type: text/plain");
	echo json_encode($result[0]); //Since there should only be one result, just return first array element
}


//Doesn't work anymore. Replace
function getUserInfo($attribute, $encUsername, $encPassword){

	switch($attribute){
		case "Email":
		case "DateOfBirth":
		case "Name":
		case "TrackHours":
			break;//make sure invalid field wasn't entered
		default:
			echo "";
			return;
	}
	//Should I encode the attribute, too?
	$dbQuery = sprintf("SELECT %s from Person WHERE 
		LoginID='%s' AND PasswordHash=SHA2('%s', 256)", $attribute,
		mysql_real_escape_string(base64_decode(urldecode($encUsername))), 
		mysql_real_escape_string(base64_decode(urldecode($encPassword))));
	$result = getDBResultsArray($dbQuery);
	header("Content-type: text/plain");
	echo json_encode($result[0]);

}


function test(){
	echo "nothing";
}


//TODO - Encode username and password
function getSID($username, $password){
	//echo "Hello ".$username." ".$password;
	//passing raw password until I figure out what hash function we're using
	if(validate_user($username, $password)){
		session_start();
		$strName; //TODO - decide what session variables to use
		//these are placeholders
		$hashPassword;
		$sessData;
    	// registering session variables
    	$_SESSION["strName"] = $username;
    	$_SESSION["pass"] = $password;
    	$_SESSION["sessData"] = Array();
    	$_SESSION["sessData"]["time"] = time();
    	$strName = $username;
    	$pass = $password;

	    echo json_encode(Array("sesionID"=>session_id()));
	}
	else{
		echo json_encode(Array("Error"=>"Invalid username or password"));
	}
	
}


function testSID($id){
	session_start($id);

	if(array_key_exists("strName", $_SESSION)){
		echo json_encode($_SESSION);
	}
	else{
		echo json_encode(Array("Error","Session Expired"));
	}
}

?>