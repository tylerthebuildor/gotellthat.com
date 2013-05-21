
// Private Namespace
function App() {

	// Init
	this.init = function() {
		initEvents();
		getMovies();
	};

	// Globals
	var ROOT_URL = 'gotellthat.com'; //change this to your own url
	var API_URL = {
		MOVIES: 'http://'+ROOT_URL+'/api/movies.php',
		TORRENT: 'http://'+ROOT_URL+'/api/torrent.php',
		DETAILS: 'http://'+ROOT_URL+'/api/details.php?movieId=',
		TRAILER: 'http://'+ROOT_URL+'/api/trailer.php?movieId='
	};
	var PAGE_LIMIT = 3;
	var page = 1;
	var template = {
		main:	'<div class="movie" x-movieId={id}>' +
					'<div class="title">' +
						'<div href="{torrent}" x-title="{title}" x-year="{year}">{title}</div>' +
						'<i></i>' +
					'</div>' +
					'<div class="poster">' +
						'<img src="{posters.detailed}"></img>' +
					'</div>' +	
				'</div>',
					
		info: 	'<h2><span style="color:#999">X</span>{title}</h2>'+
				'<div id="synopsis">'+
					'<h3>Synopsis</h3>' +
					'<p>{synopsis}</p>' +
				'</div>' +
				'<div id="consensus">' +
					'<h3>Critics Consensus</h3>' +
					'<p>{critics_consensus}</p>' +
				'</div>' +
				'<div id="abridged_cast">' +
					'<h3>Actors</h3>' +
				'</div>'+
				'<div id="ratings">' +
					'<h3>Ratings</h3>' +
					'<p>Audience: "{ratings.audience_rating}" {ratings.audience_score}/100</p>' +
					'<p>Critics: "{ratings.critics_rating}" {ratings.critics_score}/100</p>' +
				'</div>' +
				'<div id="runtime">' +
					'<h3>Runtime</h3>' +
					'<p>{runtime} minutes</p>' +
				'</div>'+
				'<div id="release_dates">' +
					'<h3>Release Dates</h3>' +
					'<p>Theater: {release_dates.theater}</p>' +
					'<p>DVD: {release_dates.dvd}</p>' +
				'</div>' +
				'<div id="mpaa_rating">' +
					'<h3>MPAA Rating</h3>' +
					'<p>{mpaa_rating}</p>' +
				'</div>'+
				'<div id="links">' +
					'<h3>Link</h3>' +
					'<a href="{links.alternate}" target="_new">Rotten Tomatoes Page</a>' +
				'</div>',
			
		abridged_cast: '<p>{name}</p>'
	};

	// Elements
	var el = {

		$search: $('#search'),
		details: document.getElementById('details'),
		content: document.getElementById('content')

	};

	// Init Events
	var initEvents = function() {

		// Search
		el.$search.keypress(function(event) {

			if(event.which === 13) {

				page = 1;
				el.content.innerHTML = '';
				getMovies(this.value);

			}

		});

		// Follow Magnet Link 
		$(content).on('click', '.title a', 
			function() {

				var args = {
					title: $(this).attr('x-title'),
					year : $(this).attr('x-year')
				}
				getMagnetLink( args );

			});

		// Display Details
		$(content).on('click', '.title i', 
			function() { 

				var args = $(this).parent('.movie').attr('x-movieId');
				getDetails( args ); 

			});

		// Play Trailer
		$(content).on('click', '.poster img', 
			function() { 

				var args = $(this).parent('.movie').attr('x-movieId');
				getTrailerUrl( args ); 

			});		

		// Infinite Scroll
		$(window).scroll(function() {

			if (document.body.offsetHeight + document.body.scrollTop >= document.body.scrollHeight) {
				//getMovies();
				console.log('bottom reached: ' + new Date());
			}

		});

	};

	// Get Movies
	var getMovies = function(searchWord) {
		var url = API_URL.MOVIES;

		if (searchWord) {
			url = url +
			'?q=' + searchWord +
			'&page=' + page +
			'&page_limit=' + PAGE_LIMIT;
		}

		console.log(url);
		
		$.getJSON(url, function(data) {
			(data) ? displayMovies(data) : throwError(3);
		})
		.fail(function() {
			throwError(1);
		});

	};

	// Dispaly Movies
	var displayMovies = function(movies) {	
		console.log(movies);
		page++;
		
		$(movies).each(function(index, value) {

			el.content.innerHTML += template.main.present(value);

		});

	};

	// Get Magnet Link
	var getMagnetLink = function(movieInfo) {

		var url = API_URL.TORRENT +
		'?title=' + movieInfo.title +
		'&year=' + movieInfo.year;

		$.get(url, function(data) {
			followMagnetLink(data);
		});

	};

	// Follow Magnet Link
	var followMagnetLink = function(magnetLink) {

		location.href = magnetLink;

	};

	// Get Details
	var getDetails = function(movieId) {

		$.get(API_URL.DETAILS + movieId, function(data) {
			displayDetails(data);
		})
		.fail(function() {
			throwError(2);
		});
		
	};

	// Display Details
	var displayDetails = function(details) {

		el.details.innerHTML = details;

	};

	// Get Trailer Url
	var getTrailerUrl = function(movieId) {

		$.get(API_URL.TRAILER + movieId, function(trailerUrl) {
			playTrailer(trailerUrl);
		})
		.fail(function() {
			throwError(1);
		});

	};

	// Play Trailer
	var playTrailer = function(trailerUrl) {

		window.open(trailerUrl, '_blank');

	};

	// Throw Error
	var throwError = function(num, silent) {

		var msg = null;

		switch(num) {
			case(1):
				msg = "Cannot Reach Server";
				break;
			case(2):
				msg = "Sorry, couldn't find a trailer for this movie";
				break;
			case(3):
				msg = "No matches found";
				break;
		}

		if (silent) 
			console.log(msg);
		else
			alert(msg);

	};

}

// Present
String.prototype.present = function(o) { 
	return this.replace(/{([^{}]*)}/g, 
		function (a, b) {
			var r = o,
			parts = b.split(".");
			for (var i=0; r && i<parts.length; i++)
				r = r[parts[i]];
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		}
	);
};

// On Ready
$(function() {

	var app = new App();
	app.init();

});