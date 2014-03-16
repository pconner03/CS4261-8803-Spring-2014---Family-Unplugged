<?php

include 'dbhelp.php';
include 'apiErrors.php';

function listActivities(){
	$dbQuery = sprintf("SELECT Name, ActivityID FROM ActivityCatalog");
	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
}

function getActivity($acName){
	$dbQuery = sprintf("SELECT * FROM ActivityCatalog WHERE Name LIKE '%%%s%%'", mysql_real_escape_string($acName));
	$result = getDBResultsArray($dbQuery);
	header("Content-type: application/json");
	echo json_encode($result);
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
		invalidCredentialsError();
	}
	
}

function testSID(){
	header("Content-type: application/json");
	session_start();
	if(sessionValid()){
		$_SESSION["sessData"]["time"] = time();
		echo json_encode($_SESSION);
	}
	else{
		sessionExpiredError();
	}
}

function getDayEvents($date){
	header("Content-type: application/json");
	session_start();
	if(sessionValid()){
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
	header("Content-type: application/json");
	if(sessionValid()){
		$_SESSION["sessData"]["time"] = time();
		_postEvent($_SESSION["personID"], $date, $activityID, $note, $hours);
	}
	else{
		sessionExpiredError();
	}
}

function _postEvents($personID, $date, $activityID, $note, $hours){
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
		databaseError();
	}
}

function deleteEvent($eventID){
	session_start();
	header("Content-type: application/json");
	if(sessionValid()){
		if(_deleteEvents($eventID)){
			json_encode(Array("Success"=>"Event ".$eventID." deleted"));
		}
		else{
			databaseError();
		}
	}
	else{
		sessionExpiredError();
	}
}

function _deleteEvents($eventID){
	$dbQuery = sprintf("DELETE FROM Event WHERE EventID = '%s'", mysql_real_escape_string($eventID));
	return execDeleteQuery($dbQuery);
}

function sessionValid(){
	return array_key_exists("personID", $_SESSION);
}

?>