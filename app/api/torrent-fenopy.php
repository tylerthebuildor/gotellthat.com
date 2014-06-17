<?php

/** Main **/
if ( isset( $_GET['title'], $_GET['year'] ) )
{
	// movie information
	$movieInfo;
	$movieInfo['title'] = urlencode($_GET['title']);
	$movieInfo['year'] = intval($_GET['year']);

	// find torrent url
	echo findTorrentUrl($movieInfo);
}

/** Find Torrent URL **/
function findTorrentUrl($movieInfo)
{
	// rating
	$keywords = array("1080p", "720p",  "brrip", "blueray", "bluray", "bdrip", "french", "dvdrip", "cam", "ts", "iso", "rar", "dual audio", "+ eng", "ita");
	$ranks = array(1, 1, 1, 1, 1, 1, -2, -1, -1, -1, -1, -1, -1, -1, -1);

	// create fenopy api request url
	$url = "http://unblockfenopy.eu/module/search/api.php?limit=30&format=json&category=3&keyword=".rawurlencode($movieInfo['title']);

	// request and decode json api data
	$torrents = json_decode(file_get_contents($url), true);

	// loop variables
	$countTorrents = count($torrents);
	$countKeywords = count($keywords);
	$scores = array($countTorrents);

	// rate torrents
	for($i=0; $i<$countTorrents; $i++)
	{
		// pre-ranking
		// used for none keywords
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

		// append to keywords
		// name: strval($movieInfo['year']), rank: 2
		// $keywords[] = (obj) name: rank:

		// if $keywords[$j]['name'] is found in $torrents[$i]['name']
		// add $keywords[i]['rank'] value to $scores[$i] total
		for($j=0; $j<$countKeywords; $j++)
		{
			if(!!stripos($torrents[$i]['name'], $keywords[$j], 0)) {
				$scores[$i] = $ranks[$j] + $scores[$i];
			}
		}

	}
	unset($movieInfo, $countTorrents, $countKeywords, $i, $j);

	// get greatest value in $scores($value) then find index($key)
	$value = max($scores);
	$key = array_search($value, $scores);

	// return magnet link with $key as $torrents index
	unset($scores, $values);
	return $torrents[$key]['magnet'];
}

?>