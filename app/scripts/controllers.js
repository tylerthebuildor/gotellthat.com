'use strict';

angular.module('app.controllers', [])

	.controller('MainCtrl', function($scope, $http, $location) {

		// Constants
		$scope.ROOT_URL = 'localhost:8000'; //change this to your own url
		$scope.API_URL = {
			MOVIES: 'http://'+$scope.ROOT_URL+'/api/movies.php',
			TORRENT: {
				YIFY: 'http://'+$scope.ROOT_URL+'/api/torrent-yify.php',
				FENOPY: 'http://'+$scope.ROOT_URL+'/api/torrent-fenopy.php'
			},
			DETAILS: 'http://'+$scope.ROOT_URL+'/api/details.php?movieId=',
			TRAILER: 'http://'+$scope.ROOT_URL+'/api/trailer.php?movieId='
		};

		// Globals
		$scope.resetGlobals = function() {
			$scope.page = 1;
			$scope.searchWord = $scope.searchWord || '';
			$scope.moreResults = {
				inProgress: false,
				noMore: false
			};
			$scope.movies = [];
		};
		$scope.resetGlobals();

		// Search
		$scope.search = function() {
			if(this.searchWord === '') {
				$location.path('/new/all');
			}
			else {
				$location.path('/search/' + this.searchWord).replace();
			}
		};

		// List Movies
		$scope.listMovies = function() {
			if ($scope.moreResults.noMore === false && $scope.moreResults.inProgress === false) {
				$scope.moreResults.inProgress = true;

				$http.get($scope.API_URL.MOVIES)
					.success(function(data) {
						$scope.moreResults.inProgress = false;

						if(data) {
							console.log(data.movies);
							$.each(data.movies, function(index) {
								$scope.movies.push(data.movies[index]);
							});
							$scope.page++;
						} else {
							$scope.moreResults.noMore = true;
						}
					})
					.error(function(error) {
						console.log(error);
						$scope.moreResults.noMore = true;
					});
			}
		};

		// Download Torrent
		$scope.downloadTorrent = function(movieInfo) {
			console.log('downloadTorrent');
			console.log(movieInfo);

			var url = '';

			if(movieInfo.alternate_ids.imdbCode) {
				url = $scope.API_URL.TORRENT.YIFY +
				'?imdbCode=' + movieInfo.alternate_ids.imdbCode;
			} else {
				url = $scope.API_URL.TORRENT.FENOPY +
				'?title=' + movieInfo.title +
				'&year=' + movieInfo.year;
			}

			$http.get(url)
				.success(function(data) {
					if(!data && movieInfo.alternate_ids.imdbCode) {
						movieInfo.alternate_ids.imdbCode = false;
						this.downloadTorrent(movieInfo);
					}
					else {
						location.href = magnetLink;
					}
				})
				.error(function(error) {
					console.log(error);
				});

		};

		// View Trailer
		$scope.viewTrailer = function(movieId) {
			console.log('viewTrailer');
			console.log(movieId);

			$http.get($scope.API_URL.TRAILER + movieId)
				.success(function(data) {
					console.log(data);
					//playTrailer(data);
				})
				.fail(function(error) {
					console.log(error);
				});
		};

		// Show Details
		$scope.showDetails = function(movieId) {
			console.log('showDetails');
			console.log(movieId);

			$http.get($scope.API_URL.DETAILS + movieId)
				.success (function(data) {
					console.log(data);
					//displayDetails(data);
				})
				.error(function(error) {
					console.log(error);
				});
		};

		// Next Page
		$scope.nextPage = function() {
			this.listMovies();
		};

	})

	.controller('ListMoviesCtrl', function($scope, $routeParams) {
		$scope.$parent.searchWord = $routeParams.searchWord || '';
		$scope.$parent.resetGlobals();
		$scope.$parent.listMovies();
	});
