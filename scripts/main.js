
// On Ready
$(function() {

	var app = new App();
	app.init();

});

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
		TORRENT: {
			YIFY: 'http://'+ROOT_URL+'/api/torrent-yify.php',
			FENOPY: 'http://'+ROOT_URL+'/api/torrent-fenopy.php'
		},
		DETAILS: 'http://'+ROOT_URL+'/api/details.php?movieId=',
		TRAILER: 'http://'+ROOT_URL+'/api/trailer.php?movieId='
	};
	var PAGE_LIMIT = 9;
	var page = 1;
	var searchWord = '';
	var moreResults = {
		inProgress: false,
		noMore: false
	};
	var template = {
		movie:	'<div class="movie" x-movieId={id}>' +
					'<div class="title">' +
						'<a x-imdbCode="{alternate_ids.imdb}" x-title="{title}" x-year="{year}">{title}</a>' +
						'<i></i>' +
					'</div>' +
					'<div class="poster">' +
						'<img src="{posters.detailed}"></img>' +
					'</div>' +
				'</div>',

		details:'<div class="container">' +
					'<h2>X {title}</h2>'+

					'<h3>Synopsis</h3>' +
					'<p>{synopsis}</p>' +

					'<h3>Critics Consensus</h3>' +
					'<p>{critics_consensus}</p>' +

					'<div id="abridged_cast">' +
						'<h3>Actors</h3>' +
					'</div>'+

					'<h3>Ratings</h3>' +
					'<p>Audience: "{ratings.audience_rating}" {ratings.audience_score}/100</p>' +
					'<p>Critics: "{ratings.critics_rating}" {ratings.critics_score}/100</p>' +

					'<h3>Runtime</h3>' +
					'<p>{runtime} minutes</p>' +

					'<h3>Release Dates</h3>' +
					'<p>Theater: {release_dates.theater}</p>' +
					'<p>DVD: {release_dates.dvd}</p>' +

					'<h3>MPAA Rating</h3>' +
					'<p>{mpaa_rating}</p>' +

					'<h3>Link</h3>' +
					'<p><a href="{links.alternate}" target="_new">Rotten Tomatoes Page</a></p>' +
				'</div>',

		abridged_cast: '<p>{name}</p>'
	};

	// Elements
	var el = {

		$search: $('header input'),
		details: document.getElementById('details'),
		content: document.getElementById('content')

	};

	// Init Events
	var initEvents = function() {

		// Search
		el.$search.keypress(function(event) {

			if(event.which === 13) {

				page = 1;
				moreResults.inProgress = false;
				moreResults.noMore = false;
				searchWord = this.value;
				el.content.innerHTML = '';
				getMovies();

			}

		});

		// Follow Magnet Link
		$(content).on('click', '.title a',
			function() {

				var args = {
					imdbCode: $(this).attr('x-imdbCode'),
					title: $(this).attr('x-title'),
					year: $(this).attr('x-year')
				}

				getMagnetLink( args );
				return false;

			});

		// Display Details
		$(content).on('click', '.title i',
			function() {

				var args = $(this).closest('.movie').attr('x-movieId');
				getDetails( args );

			});

		// Hide Details
		$(details).on('click', 'h2',
			function() {

				el.details.style.display = 'none';
				document.body.style.overflow = 'auto';

			});

		// Play Trailer
		$(content).on('click', '.poster img',
			function() {

				var args = $(this).closest('.movie').attr('x-movieId');
				getTrailerUrl( args );

			});

		// Infinite Scroll
		$(window).scroll(function() {

			if (document.body.offsetHeight + document.body.scrollTop >= document.body.scrollHeight) {

				if (moreResults.noMore == false && moreResults.inProgress == false && searchWord) {
					moreResults.inProgress = true;
					getMovies();
				}

				//console.log('bottom reached: ' + new Date());
			}

		});

	};

	// Get Movies
	var getMovies = function() {
		var url = API_URL.MOVIES;

		if (searchWord) {
			url = url +
			'?q=' + searchWord +
			'&page=' + page +
			'&page_limit=' + PAGE_LIMIT;
		}

		$.getJSON(url, function(data) {
			moreResults.inProgress = false;

			if (data) {
				displayMovies(data)
			} else {
				moreResults.noMore = true;
				throwError(3, true);
			}
		})
		.fail(function() {
			moreResults.noMore = true;
			throwError(1, true);
		});

	};

	// Dispaly Movies
	var displayMovies = function(movies) {
		page++;

		$(movies).each(function(index, value) {

			el.content.innerHTML += template.movie.present(value);

		});

	};

	// Get Magnet Link
	var getMagnetLink = function(movieInfo) {

		if(movieInfo.imdbCode != '{alternate_ids.imdb}') {
			var url = API_URL.TORRENT.YIFY +
			'?imdbCode=' + movieInfo.imdbCode;
		} else {
			var url = API_URL.TORRENT.FENOPY +
			'?title=' + movieInfo.title +
			'&year=' + movieInfo.year;
		}

		$.get(url, function(data) {
			if(!data && movieInfo.imdbCode) {
				movieInfo.imdbCode = '{alternate_ids.imdb}';
				console.log('1');
				getMagnetLink(movieInfo);
			}
			else {
				console.log('2')
				followMagnetLink(data);
			}

		});

	};

	// Follow Magnet Link
	var followMagnetLink = function(magnetLink) {

		if(magnetLink)
			location.href = magnetLink;
		else
			throwError(4)

	};

	// Get Details
	var getDetails = function(movieId) {

		$.getJSON(API_URL.DETAILS + movieId, function(data) {
			displayDetails(data);
		})
		.fail(function() {
			throwError(2, true);
		});

	};

	// Display Details
	var displayDetails = function(details) {

		el.details.innerHTML = template.details.present(details);
		el.details.style.display = 'inline';
		document.body.style.overflow = 'hidden';

		var abridged_cast = document.getElementById('abridged_cast');

		$(details.abridged_cast).each(function(index, value){
			abridged_cast.innerHTML += template.abridged_cast.present(value);
		});

	};

	// Get Trailer Url
	var getTrailerUrl = function(movieId) {

		$.get(API_URL.TRAILER + movieId, function(trailerUrl) {
			playTrailer(trailerUrl);
		})
		.fail(function() {
			throwError(2);
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
				msg = "No more results";
				break;
			case(4):
				msg = "Sorry, couldn't find a torrent for this movie";
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

// Tour
$('.tour').on('click', function() {

    var data = [
        {
            el: 'header input',
            msg: "This is where you can search for movies. Hit enter to submit your query. " +
        		 "Submitting a blank query will show new releases."
        },
        {
        	el: '.movie a:first',
        	msg: "Click the title and we'll fetch the best torrent we can find for this movie."
        },
        {
        	el: '.movie i:first',
        	msg: "Select the info icon to display a nice spread of information for this movie."
        },
        {
        	el: '.poster img:first',
        	msg: "Clicking the movie poster will play this movies trailer."
        }
    ];

    $(data).each(function(index, value) {
    	$el = $(value.el);
        $el.attr('data-intro', value.msg);
        $el.attr('data-step', index + 1);
    });

    introJs().start();

});