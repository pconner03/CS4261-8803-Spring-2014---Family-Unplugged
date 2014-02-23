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


function getDBResultsArray($dbQuery) {//TODO - get rid of this bullshit
    $dbResults = mysql_query($dbQuery);
 
	if (!$dbResults) {
		$GLOBALS["_PLATFORM"]->sandboxHeader("HTTP/1.1 500 Internal Server Error");
		die();
	}
 
	$resultsArray = array();
	if (mysql_num_rows($dbResults) > 0) {
		while ($row = mysql_fetch_assoc($dbResults)) {
			$resultsArray[] = $row;
		}	
    } 
    else {
		$GLOBALS["_PLATFORM"]->sandboxHeader('HTTP/1.1 404 Not Found');
		die();
    }
	return $resultsArray;
}

?>