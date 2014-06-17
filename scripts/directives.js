'use strict';

angular.module('app.directives', []);

/*.factory('mySharedService', function($rootScope) {
  var sharedService = {};

  sharedService.message = '';

  sharedService.prepForBroadcast = function(msg) {
    this.message = msg;
    this.broadcastItem();
  };

  sharedService.broadcastItem = function() {
    $rootScope.$broadcast('handleBroadcast');
  };

  sharedService.list_movies = function() {
	 	if (moreResults.noMore === false && moreResults.inProgress === false) {
			moreResults.inProgress = true;

			$http.get(API_URL.MOVIES)
				.success(function(data) {
					moreResults.inProgress = false;

					if (data) {
						$rootScope.movies += data;
						return 1;
					} else {
						moreResults.noMore = true;
						return 2;
					}
				})
				.error(function(error) {
					moreResults.noMore = true;
					return 3;
				});
		}
		else {
			return 4;
		}

  };

});*/