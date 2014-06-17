'use strict';

angular.module('app', [
  'app.controllers',
  'app.directives',
  'app.filters',
  'angular-loading-bar',
  'angular-tour',
  'infinite-scroll',
  'ngAnimate',
  'ngRoute'
])
	.config(function ($routeProvider, $locationProvider) {
		$locationProvider.hashPrefix('!');
    $routeProvider
      .when('/', {
        redirectTo: '/new/all'
      })
      .when('/new/:genre', {
        templateUrl: 'views/list_movies.html',
        controller: 'ListMoviesCtrl'
      })
      .when('/search/:searchWord', {
      	templateUrl: 'views/list_movies.html',
      	controller: 'ListMoviesCtrl'
      })
      .when('/404', {
      	templateUrl: '404.html'
      })
      .otherwise({
      	routeTo: '/404'
      });
	});

