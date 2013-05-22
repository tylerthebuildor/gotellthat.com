<?php //include('cache.php'); ?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width,initial-scale=1.0" />
	<title>Go Tell That</title>
	<link rel="icon" href="images/favicon.ico" type="image/png" />
	<link href='http://fonts.googleapis.com/css?family=Merriweather+Sans' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="styles/introjs.min.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="styles/main.css" type="text/css" media="screen" />
</head>
<body>

	<!-- Details -->
	<div id="details"></div>
	
	<!-- Header -->
	<header>
		<input type="text" id="search" />
		<div class="tour">tour</div>
	</header>
	
	<!-- Main -->
	<div id="wrapper">
		<div id="content"></div>
	</div>
	
	<!-- Javascript -->
	<script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>	
	<script src="scripts/intro.min.js" type="text/javascript"></script>
	<script src="scripts/main.js" type="text/javascript"></script>
	<script type="text/javascript">
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-35368577-1']);
	_gaq.push(['_trackPageview']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
	</script>	
	
</body>
</html>