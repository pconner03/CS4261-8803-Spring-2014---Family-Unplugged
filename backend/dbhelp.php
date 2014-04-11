<?php

include 'db_credentials.php';


$connection = mysql_connect($db_host, $db_username, $db_password);

if (!$connection){
	die("Error connecting to the database.<br /><br />" . mysql_error());
}

$db_select = mysql_select_db($db_database);
if (!$db_select){
	die("Error with db select.<br /><br />" . mysql_error());
}


function getDBResultsArray($dbQuery) {
    $dbResults = mysql_query($dbQuery);
	if (!$dbResults) {
		return Array();
	}
	$resultsArray = array();
	if (mysql_num_rows($dbResults) > 0) {
		while ($row = mysql_fetch_assoc($dbResults)) {
			$resultsArray[] = $row;
		}	
    } 
    else {
 		return Array();
    }
	return $resultsArray;
}


//TODO - Encode params 
function validate_user($username, $password){
	$dbQuery = sprintf("SELECT EXISTS (SELECT 1 FROM Person WHERE LoginID='%s' AND Password=SHA2('%s',256))", 
		mysql_real_escape_string($username), 
		mysql_real_escape_string($password));
	//echo $dbQuery;26b3da94639490906f114f57b85d236e
	$result = mysql_query($dbQuery);
	return mysql_fetch_row($result)[0]=='1'? True: False;
}

function getPersonID($username){
	$dbQuery = sprintf("SELECT PersonID FROM Person WHERE LoginID='%s'", 
		mysql_real_escape_string($username));
	return mysql_fetch_row(mysql_query($dbQuery))[0];
}

function dayEventsQuery($personID, $date){
	$dbQuery = sprintf("SELECT EventID, PersonID, DATE, Hours, 
		Note, EntryTimeStamp, ThirdPartyEntry, ReportedBy, Name 
		FROM Event, ActivityCatalog
		WHERE PersonID =  '%s' 
		AND DATE =  '%s' 
		AND Event.ActivityID = ActivityCatalog.ActivityID",
		mysql_real_escape_string($personID),
		mysql_real_escape_string($date));
	return getDBResultsArray($dbQuery);
}

function dateRangeEventsQuery($personID, $startDate, $endDate){
	$dbQuery = sprintf("SELECT EventID, PersonID, DATE, Hours, 
		Note, EntryTimeStamp, ThirdPartyEntry, ReportedBy, Name 
		FROM Event, ActivityCatalog
		WHERE PersonID =  '%s' 
		AND DATE >=  '%s'
		AND DATE <= '%s' 
		AND Event.ActivityID = ActivityCatalog.ActivityID",
		mysql_real_escape_string($personID),
		mysql_real_escape_string($startDate),
		mysql_real_escape_string($endDate));
	return getDBResultsArray($dbQuery);
}

//TODO _ error handling
function userInfoQuery($personID){
	$dbQuery = sprintf("SELECT LoginID, Name, Email, DateOfBirth, TrackHours 
		FROM Person WHERE PersonID='%s'", mysql_real_escape_string($personID));
	return getDBResultsArray($dbQuery);
}

function insertQuery($dbQuery){
	return mysql_query($dbQuery);
}

function execDeleteQuery($dbQuery){
	return mysql_query($dbQuery);
}

function usernameExists($username){
	$dbQuery = sprintf("SELECT EXISTS (SELECT 1 FROM Person WHERE loginID='%s'",
		mysql_real_escape_string($username));
	$result = mysql_query($dbQuery);
	return mysql_fetch_row($result)[0]=='1'? True: False;
}

//Fix this eventually
function getUsername($personID){
	$dbQuery = sprintf("SELECT LoginID FROM Person WHERE PersonID='%s'",
		$personID);
	return getDBResultsArray($dbQuery);
}




?>