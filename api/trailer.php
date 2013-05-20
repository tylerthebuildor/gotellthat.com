<?php
/** Pre-reqs **/
if(!isset($_GET['url'])) exit;
require_once("simple_html_dom.php");
$APIKEY = "caq7d55yqy2cca3szz7gdzkk";
echo findMovieTrailer();

/** Find Trailer URL **/
function findMovieTrailer() {
	//globals
	global $APIKEY;
	
	//create rotten tomatoes trailer-api request url
	$trailerAPIURL = $_GET['url'].'?apikey='.$APIKEY;
	
	//find & return swf url
	$trailerURL = scrapeRottenTomatoes($trailerAPIURL);
	unset($trailerAPIURL);
	return $trailerURL;
}

/** Scrape Trailer SWF URL **/
function scrapeRottenTomatoes($trailerAPIURL) 
{		
	//request trailer-api json data and decode
	$trailerData = json_decode(file_get_contents($trailerAPIURL), true);
	unset($trailerAPIURL);
	
	//parse url
	$mobileURL = str_replace('/m', '/mobile/m', $trailerData['links']['alternate']);
	$mobileURL = str_replace('trailers/', '', $mobileURL);
	
	//load trailer page html
	$html = new simple_html_dom();
	$html->load_file($mobileURL);
	unset($trailerData, $mobileURL);
	//($trailerData['clips'][0]['links']['alternate']
	
	//find trailer button
	$a = $html->find('.trailerbutton', 0);
	unset($html);
	
	//return button href
	return $a->href;
}
?>