<?php

//request info from api


//connect to db
$db = new SQLite3('cache');

//loop results
$count = count();
for($i = 0 ; $i<$count; $i++) 
{

	//query db
	$query = $db->prepare("INSERT INTO messages (title, message, time) VALUES (:title, :message, :time)");
	$results = $query->execute();
	
}

?>