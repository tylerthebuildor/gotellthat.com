'use strict';

angular.module('app.controllers', [])

	.controller('MainCtrl', function($scope, $http, $location, $window) {

		// Constants
		var test = '';
		$scope.ROOT_URL = test ? 'localhost:8000' : 'www.gotellthat.com'; //change this to your own url
		$scope.API_URL = {
			MOVIES: 'http://'+$scope.ROOT_URL+'/api/'+test+'movies.php',
			TORRENT: {
				YIFY: 'http://'+$scope.ROOT_URL+'/api/'+test+'torrent-yify.php',
				FENOPY: 'http://'+$scope.ROOT_URL+'/api/'+test+'torrent-fenopy.php'
			},
			DETAILS: 'http://'+$scope.ROOT_URL+'/api/'+test+'details.php?movieId=',
			TRAILER: 'http://'+$scope.ROOT_URL+'/api/'+test+'trailer.php?movieId='
		};
		$scope.PAGE_LIMIT = 10;

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
				$location.path('/search/' + this.searchWord).replace();
			}
		};

		// List Movies
		$scope.listMovies = function() {
			this.logGlobals();
			if ($scope.moreResults.noMore === false && $scope.moreResults.inProgress === false) {
				$scope.moreResults.inProgress = true;

				var url = $scope.API_URL.MOVIES +
				'?page=' + $scope.page +
				'&page_limit=' + $scope.PAGE_LIMIT;

				if ($scope.searchWord) {
					url = url +
					'&q=' + $scope.searchWord;
				}

				console.log(url);
				$http.get(url)
					.success(function(data) {
						console.log(data);
						$scope.moreResults.inProgress = false;

						if(data) {
							$.each(data, function(index) {
								$scope.movies.push(data[index]);
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
						location.href = data;
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
					$window.open(data);
				})
				.error(function(error) {
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
		$scope.$parent.resetGlobals();
		$scope.$parent.searchWord = $routeParams.searchWord || '';
		$scope.$parent.listMovies();
	});
