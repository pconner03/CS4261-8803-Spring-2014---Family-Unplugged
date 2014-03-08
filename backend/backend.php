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



function getUserInfo($sessionID){
	session_start($id);
	if(!array_key_exists("personID",$_SESSION)){
		sessionExpiredError();
	}
	else{
		echo json_encode(userInfoQuery($_SESSION["personID"]));
	}
}


function test(){
	echo "nothing";
}


//TODO - Encode username and password
function getSID($username, $password){
	//passing raw password until I figure out what hash function we're using
	if(validate_user($username, $password)){
		session_start();

		//maybe roll getPersonID into validator to 
		//get rid of a db access
    	$_SESSION["personID"] = getPersonID($username);//primary identifier
    	$_SESSION["sessData"] = Array();
    	$_SESSION["sessData"]["time"] = time();

	    echo json_encode(Array("sesionID"=>session_id()));
	}
	else{
		echo json_encode(Array("Error"=>"Invalid username or password"));
	}
	
}


function testSID($id){
	session_start($id);

	if(array_key_exists("personID", $_SESSION)){
		echo json_encode($_SESSION);
	}
	else{
		sessionExpiredError();
	}
}

function sessionExpiredError(){
	echo json_encode(Array("Error","Session Expired"));
}

function getDayEvents($sessionID, $date){
	session_start($id);
	if(!array_key_exists("personID",$_SESSION)){
		sessionExpiredError();
	}
	else{
		echo json_encode(dayEventsQuery($_SESSION["personID"],$date));
	}
}

?>