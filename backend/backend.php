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
 * Retrieves a user's unique ID, which can be used for stateless data retrieval
 * from the REST api
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
?>