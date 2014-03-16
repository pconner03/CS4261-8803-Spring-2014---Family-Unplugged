<?php

include 'dbhelp.php';

function listActivities(){
	$dbQuery = sprintf("SELECT Name, ActivityID FROM ActivityCatalog");
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



function getUserInfo(){
	header("Content-type: application/json");
	session_start();
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
	header("Content-type: application/json");
	if(validate_user($username, $password)){
		session_start();

		//maybe roll getPersonID into validator to 
		//get rid of a db access
    	$_SESSION["personID"] = getPersonID($username);//primary identifier
    	$_SESSION["sessData"] = Array();
    	$_SESSION["sessData"]["time"] = time();

	    echo json_encode(Array("sessionID"=>session_id()));
	}
	else{
		echo json_encode(Array("Error"=>"Invalid username or password"));
	}
	
}

function testSID(){
	header("Content-type: application/json");
	session_start();

	if(array_key_exists("personID", $_SESSION)){
		$_SESSION["sessData"]["time"] = time();
		echo json_encode($_SESSION);
	}
	else{
		sessionExpiredError();
	}
}

function sessionExpiredError(){
	echo json_encode(Array("Error"=>"Session Expired"));
}

function getDayEvents($date){
	header("Content-type: application/json");
	session_start();
	if(array_key_exists("personID",$_SESSION)){
		$_SESSION["sessData"]["time"] = time();
		echo json_encode(dayEventsQuery($_SESSION["personID"],$date));
	}
	else{
		sessionExpiredError();
	}
}

//untested, because curl wasn't working
function postEvent($date, $activityID, $note, $hours){
	session_start();
	if(array_key_exists("personID", $_SESSION)){
		$_SESSION["sessData"]["time"] = time();
		_postEvent($_SESSION["personID"], $date, $activityID, $note, $hours);
	}
	else{
		header("Content-type: application/json");
		sessionExpiredError();
	}
}

function _postEvents($personID, $date, $activityID, $note, $hours){
	header("Content-type: application/json");
	$dbQuery = sprintf("INSERT INTO Event 
		(PersonID, Date, ActivityID, Hours, Note, ThirdPartyEntry, ReportedBy)
		VALUES ('%s', '%s', %s, %s, '%s', FALSE, 'Me')",
		mysql_real_escape_string($personID),
		mysql_real_escape_string($date),
		mysql_real_escape_string($activityID),
		mysql_real_escape_string($hours),
		mysql_real_escape_string($note)
		);
	if(insertQuery($dbQuery)){
		echo json_encode(Array("Success"=>"Data inserted successfully"));
	}
	else{
		echo json_encode(Array("Error"=>"Database Error"));
	}
}

?>