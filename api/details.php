<?php

/** Init **/
if ( isset($_GET['movieId']) ) 
{
	echo findMovieDetails();
}

/** Find Movies Info **/
function findMovieDetails() 
{
	// api key
	$APIKEY = trim(file_get_contents('.apikey'));

	// create rotten tomatoes api request url
	$url = 'http://api.rottentomatoes.com/api/public/v1.0/movies/'.
	intval($_GET['movieId']).'.json'.
	'?apikey='.$APIKEY;

	// request and decode json api data
	$data = json_decode(file_get_contents($url), true);
	
	// convert array to JSON & return
	return json_encode($data);

}

?>