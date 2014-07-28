'use strict';
var live = true;

angular.module('app.controllers', [])

	.controller('MainCtrl', function($scope, $http, $location, $window) {

		// Constants
		$scope.ROOT_URL = live ? 'http://www.gotellthat.com/api/' : 'localhost:8000/api/cache/';
		$scope.API_URL = {
			MOVIES: $scope.ROOT_URL + 'movies.php',
			TORRENT: {
				YIFY: $scope.ROOT_URL + 'torrent-yify.php',
				FENOPY: $scope.ROOT_URL + 'torrent-fenopy.php'
			},
			DETAILS: $scope.ROOT_URL + 'details.php?movieId=',
			TRAILER: $scope.ROOT_URL + 'trailer.php?movieId='
		};
		$scope.PAGE_LIMIT = 10;
		$scope.heading = $scope.heading || '';

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

		// Log Globals
		$scope.logGlobals = function() {
			console.log('page: ' + $scope.page);
			console.log('search word: ' + $scope.searchWord);
			console.log($scope.moreResults);
		};

		// Search
		$scope.search = function() {
			this.resetGlobals();
			if(this.searchWord === '') {
				$location.path('/new/all');
			}
			else {
				$location.path('/search/' + this.searchWord);
			}
		};

		// List Movies
		$scope.listMovies = function() {
			if ($scope.moreResults.noMore === false && $scope.moreResults.inProgress === false) {
				$scope.moreResults.inProgress = true;

				var url = $scope.API_URL.MOVIES +
				'?page=' + $scope.page +
				'&page_limit=' + $scope.PAGE_LIMIT;

				if ($scope.searchWord) {
					url = url +
					'&q=' + $scope.searchWord;
				}

				$http.get(url)
					.success(function(data) {
						console.log(data);
						$scope.moreResults.inProgress = false;

						if(data) {
							$scope.page++;
							$.each(data, function(index) {
								$scope.movies.push(data[index]);
							});
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
			var url = '';

			if(movieInfo.alternate_ids.imdbCode) {
				console.log('Trying YIFY');
				url = $scope.API_URL.TORRENT.YIFY +
				'?imdbCode=' + movieInfo.alternate_ids.imdbCode;
			} else {
				console.log('Trying Fenopy');
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
						location.href = data;
					}
				})
				.error(function(error) {
					console.log(error);
				});

		};

		// View Trailer
		$scope.viewTrailer = function(movieId) {
			$http.get($scope.API_URL.TRAILER + movieId)
				.success(function(data) {
					$window.open(data);
				})
				.error(function(error) {
					console.log(error);
				});
		};

		// Next Page
		$scope.nextPage = function() {
			if($scope.moreResults.noMore === false && $scope.moreResults.inProgress === false) {
				console.log('bottom');
				this.listMovies();
			}
		};

		// Tour
		$scope.currentStep = -1;
		$scope.initTour = function() {
			$scope.currentStep = ($scope.currentStep === -1) ? 0 : $scope.currentStep;
			$scope.startTour();
		};

	})

	.controller('ListMoviesCtrl', function($scope, $routeParams) {
		if($routeParams.searchWord) {
			$scope.$parent.heading = 'Search: ' + $routeParams.searchWord;
		}
		if($routeParams.genre) {
			$scope.$parent.heading = 'New Releases: ' + $routeParams.genre;
		}

		$scope.$parent.searchWord = $routeParams.searchWord || '';
		$scope.$parent.resetGlobals();
		$scope.$parent.listMovies();
	})

	.controller('DetailsCtrl', function($scope, $routeParams, $http) {
		var url = $scope.$parent.API_URL.DETAILS + $routeParams.movieId;

		$http.get(url)
			.success(function(data) {
				console.log(url);
				console.log(data);
				$scope.movie = data;
			})
			.error(function(error) {
				console.log(error);
			});

	});
