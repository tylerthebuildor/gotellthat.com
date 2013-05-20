/** Globals **/
var ROOT_URL = 'gotellthat.com'; //change this to your own url
var PAGE_LIMIT = 3; //Number of search results per page
var page = 1;
var storedResults = [];
var template = {
	main:	'<div class="movie fourcol">' +
					'<div class="title">' +
						'<a href="{torrent}">{title}</a>' +
						'<img src="/img/info.png" class="i" id="{index}"></img>' +
					'</div>' +
					'<div class="poster">' +
						'<img src="{posters.detailed}" id="{links.clips}"></img>' +
					'</div>' +	
				'</div>',
				
	info: '<h2><span style="color:#999">X</span>	{title}</h2>'+
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

/** Init **/
$(document).ready(function() {
	getMovies(window.location.hash.substring(1));
});

/** Search **/
$('#search').keypress(function(event) {
	if(event.which === 13) {
		page = 1;
		storedResults = [];
		window.location.hash = this.value;
		document.getElementById('content').innerHTML = '';
		getMovies(this.value);
	}
});

/** More **/
$('#more').on(ev.full(), function() {
	var searchWord = window.location.hash.substring(1);
	if(searchWord) {
		page++;
		getMovies(searchWord);
	} else {
		alert('No matches found');
	}
});

/** Info **/
function moreInfo(e) {
		var len = storedResults[e.id].abridged_cast.length;
		document.getElementById('info').innerHTML = template.info.present(storedResults[e.id]);
		$('body').css('overflow', 'hidden');
		
		for(var i=0; i<len; i++) {
			document.getElementById('abridged_cast').innerHTML += template.abridged_cast.present(storedResults[e.id].abridged_cast[i]);
		}
		
		$('#info h2').on(ev.full(), function() { 
			$('#info').hide(); 
			$('body').css('overflow', 'auto');
		}); 
		$('#info').show();
}

/** Get Movies **/
function getMovies(searchWord) {
	var url = 'http://'+ROOT_URL+'/api/api.php';
	var more = document.getElementById('more');
	url = searchWord ? url+'?q='+searchWord+'&page='+page+'&page_limit='+PAGE_LIMIT : url;
	more.innerHTML = '<img src="img/loading.gif"></img>';
	console.log(url); 
	
	$.ajax({
		url: url,
		dataType: "json",
		success: function(data) { 
			more.innerHTML = 'More';
			(data) ? displayMovies(data) : alert('No matches found');
		},
		error: function() { alert('Cannot reach server'); }
	});
}

/** Dispaly Movies **/
function displayMovies(data) {	
	var content = document.getElementById('content');
	var lastContainer;
	var start = storedResults.length;
	var end = storedResults.length + data.length;
	console.log(data);
	
	for(var i=start; i<end; i++) {
			if(i%3 === 0) {
				content.innerHTML += '<div class="container"><div class="row"></div></div>';
				lastContainer = $('.container:last-child .row');
			}	
			storedResults[i] = data[i - start];
			storedResults[i].index = i;
			lastContainer[0].innerHTML += template.main.present(storedResults[i]);
	}
	
	$('.movie:last-child').addClass('last');	
	
	$('.poster img').on(ev.full(), function(event) { 
		event.stopPropagation();
		getTrailerURL(this); 
	});
	
	$('.i').on(ev.full(), function() { 
		moreInfo(this); 
	});
}

/** Get Trailer **/
function getTrailerURL(e) {
	if (e.id === '{trailer}')
		alert("Sorry, couldn't find a trailer for this movie");
	else {
		$.ajax({
			url: 'http://'+ROOT_URL+'/api/trailer.php?url='+e.id,
			success: function(trailerURL) { 
				playTrailer(trailerURL); 
			},
			error: function() { alert('Server cannot be reached at this time'); }
		});
	}
}

/** Play Trailer **/
function playTrailer(trailerURL) {	
	console.log(trailerURL);
	window.open(trailerURL, '_blank');
	/*
	var flashvars = {};
	var params = { wmode: "opaque" };
	var attributes = {};	
	console.log(trailerURL);
	
	swfobject.embedSWF(trailerURL, "player", "100%", "100%", "9.0.0", "expressInstall.swf", flashvars, params, attributes);
	$('#trailer').show();
	*/
}

/** Clear & Hide Trailer Window **/
$('#trailer #exit').on(ev.full(), function() {
	$('#player').html('');
	$('#trailer').hide();
});

/** Present **/
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
