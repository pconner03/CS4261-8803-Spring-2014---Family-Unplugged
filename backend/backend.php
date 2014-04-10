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
		echo json_encode($_SESSION);
	}
	else{
		sessionExpiredError();
	}
}

function getDayEvents($date, $startDate, $endDate){
	header("Content-type: application/json");
	session_start();
	if(sessionValid()){
		if($startDate !="" && $endDate != ""){
			echo json_encode(dateRangeEventsQuery($_SESSION["personID"], $startDate, $endDate));
		}
		else{
			echo json_encode(dayEventsQuery($_SESSION["personID"],$date));
		}
	}
	else{
		sessionExpiredError();
	}
}

function postEvent($date, $activityID, $note, $hours){
	session_start();
	header("Content-type: application/json");
	if(sessionValid()){
		_postEvent($_SESSION["personID"], $date, $activityID, $note, $hours);
	}
	else{
		sessionExpiredError();
	}
}

function _postEvent($personID, $date, $activityID, $note, $hours){
	$dbQuery = sprintf("INSERT INTO Event (PersonID, Date, ActivityID, Hours, Note, ThirdPartyEntry, ReportedBy, EventID) VALUES ('%s', '%s', '%s', %s, '%s', FALSE, 'Me', UUID())", 
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
		//echo $dbQuery;
		databaseError();
	}
}

function putEvent($eventID, $date, $activityID, $note, $hours){
	session_start();
	header("Content-type: application/json");
	if(sessionValid()){
		_putEvent($_SESSION["personID"],$eventID, $date, $activityID, $note, $hours);
	}
	else{
		sessionExpiredError();
	}
}

function _putEvent($personID, $eventID, $date, $activityID, $note, $hours){
	$dbQuery = sprintf("UPDATE Event SET Date='%s', ActivityID='%s', Note='%s', Hours='%s' WHERE EventID='%s' AND PersonID='%s'",
		mysql_real_escape_string($date),
		mysql_real_escape_string($activityID),
		mysql_real_escape_string($note),
		mysql_real_escape_string($hours),
		mysql_real_escape_string($eventID),
		mysql_real_escape_string($personID));
	if(insertQuery($dbQuery)){
		echo json_encode(Array("Success"=>"Data updated successfully"));
	}
	else{
		//echo json_encode(Array("Error"=>$dbQuery));
		databaseError();
	}
}

function deleteEvent($eventID){
	session_start();
	header("Content-type: application/json");
	if($eventID==""){
		echo json_encode(Array("Error"=>"Event ID is null"));
		return;
	}

	if(sessionValid()){
		if(_deleteEvents($eventID)){
			echo json_encode(Array("Success"=>"Event ".$eventID." deleted"));
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
	if(array_key_exists("personID", $_SESSION)){
		$_SESSION["sessData"]["time"] = time();
		return True;
	}
	return False;
}

function registerUser($username, $password, $name, $email, $dateOfBirth){
	header("Content-type: application/json");
	if(usernameExists($username)){
			usernameExistsError();
	}
	else{
		if(_registerUser($username, $password, $name, $email, $dateOfBirth)){
			echo json_encode(Array("Success"=>"User registered"));
		}
		else{
			databaseError();
		}
	}
}

function _registerUser($username, $password, $name, $email, $dateOfBirth){
	$dbQuery = sprintf("INSERT INTO Person
		(loginID, Password, Name, Email, DateOfBirth, PersonID) VALUES
		('%s', SHA2('%s', 256), '%s', '%s', '%s', UUID())",
		mysql_real_escape_string($username),
		mysql_real_escape_string($password),
		mysql_real_escape_string($name),
		mysql_real_escape_string($email),
		mysql_real_escape_string($dateOfBirth));
	return insertQuery($dbQuery);
}

function createTeam($name){
	session_start();
	header("Content-type: application/json");
	if(sessionValid()){
		_createTeam($name, $_SESSION['personID']);
	}
	else{
		sessionExpiredError();
	}
}

function _createTeam($name, $personID){
	//TODO - CHECK IF TEAM ALREADY EXISTS, RETURN ERROR IF TRUE

	$dbQuery = sprintf("INSERT INTO Team
		(Name, PersonID) VALUES
		('%s', '%s')",
		mysql_real_escape_string($name),
		mysql_real_escape_string($personID));
	if(!insertQuery($dbQuery)){
		databaseError();
	}
	else{

		$teamIDQ = sprintf("SELECT TeamID FROM Team
			WHERE Name='%s' AND PersonID='%s'",
			mysql_real_escape_string($name),
			mysql_real_escape_string($personID));
		$id = getDBResultsArray($teamIDQ)[0]['TeamID'];
		//Without triggers, there's no better way to do this
		$insertMemberQ = sprintf("INSERT INTO TeamMembers (TeamID, PersonID) VALUES
			('%s', '%s')",
			mysql_real_escape_string($id),
			mysql_real_escape_string($personID));
		if(!insertQuery($insertMemberQ)){
			databaseError();//TODO - anything but this
		}
		else{
			echo json_encode(Array("Success"=>"Team Created"));
		}
	}
}

function logout(){
	session_start();
	if(sessionValid()){
		session_unset();
		session_destroy();
	}
	header("Content-type: application/json");
	echo json_encode(Array("Success"=>"Session ended"));
}



function getIndividualReport($startDate, $endDate){
	session_start();
	header("Content-type: application/json");
	if(sessionValid()){
		echo json_encode(_getIndividualReport($startDate, $endDate, $_SESSION["personID"]));	
	}
	else{
		sessionExpiredError();
	}	
}

function _getIndividualReport($startDate, $endDate, $personID){
	$_startDate = new DateTime($startDate);
	$_endDate = new DateTime($endDate);
	$output = Array();
	while($_startDate <= $_endDate){
		$dbQuery = sprintf("SELECT 
			Event.Date, SUM(IF(Event.Hours - Scoring.Threshold > 0,(Event.Hours - Scoring.Threshold)*Scoring.Mental,0)) AS MentalPoints,
			SUM(IF(Event.Hours - Scoring.Threshold > 0,(Event.Hours - Scoring.Threshold)*Scoring.Physical,0)) AS PhysicalPoints,
			SUM(IF(Event.Hours - Scoring.Threshold > 0,(Event.Hours - Scoring.Threshold)*Scoring.Social,0)) AS SocialPoints 
			FROM 
				Event NATURAL JOIN Scoring 
			WHERE 
				Event.PersonID='%s' AND Event.Date = '%s'",
			mysql_real_escape_string($personID),
			mysql_real_escape_string(date_format($_startDate, "Y-m-d")));
		$arr = getDBResultsArray($dbQuery)[0];
		if($arr["Date"]==null){
			$arr["Date"] = date_format($_startDate, "Y-m-d");
			$arr["MentalPoints"] = "0.0";
			$arr["PhysicalPoints"] = "0.0";
			$arr["SocialPoints"] = "0.0";
		} 	
		array_push($output, $arr);
		$_startDate->modify("+1 day");
		//echo $dbQuery;
	}
	//echo json_encode($output);
	return $output;
}

function getTeamReport($teamID, $startDate, $endDate){
	header("Content-type: application/json");
	session_start();
	if(sessionValid()){
		echo json_encode(_getTeamReport($teamID, $startDate, $endDate));	
	}
	else{
		sessionExpiredError();
	}
}

function _getTeamReport($teamID, $startDate, $endDate){
	//TODO - assert valid team membership for logged user
	$getMemberQuery = sprintf("SELECT PersonID FROM TeamMembers WHERE TeamID = '%s'",
		mysql_real_escape_string($teamID));
	$members = getDBResultsArray($getMemberQuery);
	$output = Array();
	foreach($members as &$v){
		//var_dump(getUsername($v["PersonID"]));
		$uname = getUsername($v["PersonID"])[0]["LoginID"];
		//echo $uname."</br>";
		//var_dump(getUsername($v["PersonID"]));
		$userRes = _getIndividualReport($startDate, $endDate, $v["PersonID"]);
		//var_dump($userRes);
		array_push($output, Array($uname => $userRes));
	}
	return $output;
}

?>