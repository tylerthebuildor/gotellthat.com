'use strict';

angular.module('app.filters', [])

.filter('detailedUrl', function() {
	return function() {
		return this.movie.posters.detailed.replace('_tmb.jpg', '_det.jpg');
		//return this;
	};
})

.filter('colorRating', function() {
  return function() {
    var total = Math.ceil( (this.movie.ratings.audience_score + this.movie.ratings.critics_score) / 2 );
    if(total < 50)
    	return 'rating-red';
    else if(total < 80)
    	return 'rating-yellow';
    else
    	return 'rating-green';
  };
});

