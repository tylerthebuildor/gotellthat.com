<?php

/** Init **/
if( isset($_GET['movieId']) ) 
{
	require_once("simple_html_dom.php");
	echo findMovieTrailer();
}

/** Find Trailer URL **/
function findMovieTrailer() 
{
	// api key
	$APIKEY = trim(file_get_contents('.apikey'));
	
	// create rotten tomatoes trailer-ref request url
	$trailerRef = "http://api.rottentomatoes.com/api/public/v1.0/movies/".
	intval($_GET['movieId']).
	'/clips.json?apikey='.$APIKEY;
	
	// find & return swf url
	$trailerUrl = scrapeRottenTomatoes($trailerRef);
	unset($trailerRef);
	return $trailerUrl;
}

/** Scrape Trailer SWF URL **/
function scrapeRottenTomatoes($trailerRef) 
{		
	// request trailer-ref json data and decode
	$trailerData = json_decode(file_get_contents($trailerRef), true);
	unset($trailerRef);
	if (!$trailerData) 
		return null;	
	
	// parse url
	$mobileURL = str_replace('/m', '/mobile/m', $trailerData['links']['alternate']);
	$mobileURL = str_replace('trailers/', '', $mobileURL);
	
	// load trailer page html
	$html = new simple_html_dom();
	$html->load_file($mobileURL);
	unset($trailerData, $mobileURL);
	
	// find trailer button
	$a = $html->find('.trailerbutton', 0);
	unset($html);
	
	// return button href
	return $a->href;
}
?>