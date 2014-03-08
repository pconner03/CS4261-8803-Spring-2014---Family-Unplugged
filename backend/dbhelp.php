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


function getDBResultsArray($dbQuery) {//TODO - get rid of this 
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
	//TESTING - doesn't hash password. Fix soon
	$dbQuery = sprintf("SELECT EXISTS (SELECT 1 FROM Person WHERE LoginID='%s' AND Password='%s')", 
		mysql_real_escape_string($username), 
		mysql_real_escape_string($password));
	$result = mysql_query($dbQuery);
	return mysql_fetch_row($result)[0]=='1'? True: False;
}
?>