<?php

function databaseError(){
	echo json_encode(Array("Error"=>"Database Error"));
}

function sessionExpiredError(){
	echo json_encode(Array("Error"=>"Session Expired"));
}

function invalidCredentialsError(){
	echo json_encode(Array("Error"=>"Invalid username or password"));
}

?>
