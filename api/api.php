<?php
/** Pre-reqs **/
$APIKEY = "caq7d55yqy2cca3szz7gdzkk";
$keywords = array("1080p", "720p",  "brrip", "blueray", "bluray", "bdrip", "french", "dvdrip", "cam", "ts", "iso", "rar", "dual audio", "+ eng", "ita");
$ranks = array(1, 1, 1, 1, 1, 1, -2, -1, -1, -1, -1, -1, -1, -1, -1);
//add ranks to keywords with php objects? make keyw
if(isset($_GET['q']))
	echo findMoviesInfo();
else 
	echo findMoviesInfo('http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/new_releases.json?apikey='.$APIKEY);
	

/** Return Stored New Releases **/
function newReleases() {

	//connect to db
	$db = new PDO('sqlite:newreleases.sqlite3');
	
	//create db - keep for git push
	$db->exec("CREATE TABLE IF NOT EXISTS newreleases (
                    id INTEGER PRIMARY KEY, 
                    title TEXT, 
                    message TEXT, 
                    time INTEGER)");
	
	//query db
  $query = $db->prepare("INSERT INTO messages (title, message, time) VALUES (:title, :message, :time)");
	$results = $query->execute();
	
	//return results
	return json_encode($results);

}

/** Find Movies Info **/
function findMoviesInfo($url) 
{
	//globals
	global $APIKEY;

	//create rotten tomatoes api request url
	if (!$url)
	$url = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey='.$APIKEY.'&q='.urlencode($_GET['q']).'&page_limit='.intval($_GET['page_limit']).'&page='.intval($_GET['page']);

	//request and decode json api data
	$data = json_decode(file_get_contents($url), true);
	
	//return null if no results
	$countMovies = count($data['movies']);
	if($countMovies === 0)
		return null;
	
	//add torrent url to returned data sets	
	for($i = 0; $i < $countMovies; $i++) 
	{		
		$data['movies'][$i]['torrent'] = findTorrentURL($data['movies'][$i]);
	}
	
	//convert array to JSON & return
	return json_encode($data['movies']);
	//return 'yourmom';
}

/** Find Torrent URL **/
function findTorrentURL($movieInfo) 
{	
	//globals
	global $keywords;
	global $ranks;
	
	//create fenopy api request url
	$url = "http://fenopy.eu/module/search/api.php?limit=30&format=json&category=3&keyword=".rawurlencode($movieInfo['title']);		
	
	//request and decode json api data
	$torrents = json_decode(file_get_contents($url), true);
	//var_dump($torrents);
	//echo '<br />';
	
	//loop variables
	$countTorrents = count($torrents);
	$countKeywords = count($keywords);
	$scores = array($countTorrents); 
	
	//rate torrents
	for($i=0; $i<$countTorrents; $i++)
	{	
		//pre-ranking
		//used for none keywords
		$scores[$i] = 0;
		if($torrents[$i]['seeder'] > 100) 
		{
			$scores[$i] = $scores[$i] + 1;
			if($torrents[$i]['seeder'] > 1000)
				$scores[$i] = $scores[$i] + 1;
		}
		if($torrents[$i]['size'] < 1000000000)
			$scores[$i] = $scores[$i] + 1;
		if($torrents[$i]['verified'] === 0)
			$scores[$i] = $scores[$i] - 1; 
		if(!!stripos($torrents[$i]['name'], strval($movieInfo['year']), 0))
			$scores[$i] = $scores[$i] + 2;
			
		//append to keywords
		//name: strval($movieInfo['year']), rank: 2
		//$keywords[] = (obj) name: rank:
		
		//if $keywords[$j]['name'] is found in $torrents[$i]['name'] 
		//add $keywords[i]['rank'] value to $scores[$i] total 
		for($j=0; $j<$countKeywords; $j++) 
		{
			if(!!stripos($torrents[$i]['name'], $keywords[$j], 0)) {
				$scores[$i] = $ranks[$j] + $scores[$i];
			}
		}	
	
	}
	unset($movieInfo, $countTorrents, $countKeywords, $i, $j);

	//get greatest value in $scores($value) then find index($key)
	$value = max($scores);
	$key = array_search($value, $scores);
	
	//return magnet link with $key as $torrents index
	unset($scores, $values);
	return $torrents[$key]['magnet'];
}	
?>
