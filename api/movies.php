<?php

echo findMovies();

/** Find Movies **/
function findMovies() 
{
	// api key
	$APIKEY = trim(file_get_contents('.apikey'));

	// create rotten tomatoes api request url
	if ( isset($_GET['q']) ) 
	{
		$url = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey='.$APIKEY.
		'&q='.urlencode($_GET['q']).
		'&page_limit='.intval($_GET['page_limit']).
		'&page='.intval($_GET['page']);
	}
	else 
	{
		$url = 'http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/new_releases.json?apikey='.$APIKEY;
	}

	// request and decode json api data
	$data = json_decode(file_get_contents($url), true);
	
	// return null if no results
	$countMovies = count($data['movies']);
	if($countMovies === 0)
		return null;
	
	// convert array to JSON & return
	return json_encode($data['movies']);

}

?>
