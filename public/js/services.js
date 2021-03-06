'use strict';

var twitterWallServices = angular.module('twitterWallServices', []);

twitterWallServices.factory('Hashtag', ['$http', '$q', function($http, $q) {
  return {
    get: function () {
      var deferred = $q.defer();
      $http.get('/api/hashtag')
        .success(function(res) {
          var hashtag = res.hashtag;
          deferred.resolve(hashtag);
        })
      return deferred.promise;
    },
    set: function(hashtag) {
      return $http.post('/api/update-hashtag', { hashtag: { text: hashtag } });
    }
  };
}]);

twitterWallServices.factory('CleanTweets', ['$http', '$q', function($http, $q) {
  var cleanTweets = [];

  return {
    get: function () {
      var deferred = $q.defer();
      $http.get('/api/clean-tweets')
        .success(function(res) {
          cleanTweets = res.tweets;
          deferred.resolve(cleanTweets);
        })
      return deferred.promise;
    },
    add: function(tweet) {
      return $http.post('/api/add-clean-tweet', { tweet: tweet })
    },
    remove: function(tweet) {
      return $http.post('/api/remove-clean-tweet', { tweet: tweet })
    }
  };
}]);

twitterWallServices.factory('Tweets', ['$http', function($http) {
  return {
    get: function () {
      return $http.get('/api/tweets')
    },
    remove: function(tweet) {
      return $http.post('/api/remove-tweet', { tweet: tweet })
    }
  };
}]);

twitterWallServices.factory('Mode', ['$http', function($http) {
  var isAutomatic = false;

  return {
    get: function() {
      return isAutomatic;
    },
    swap: function() {
      isAutomatic = !isAutomatic;
      $http.post('/api/swap-mode');
      return isAutomatic;
    },
    getFromServer: function () {
      return $http.get('/api/mode');
    }
  };
}]);


twitterWallServices.factory('authInterceptor', [
  '$rootScope',
  '$q',
  '$location',
  '$window',
  function ($rootScope, $q, $location, $window) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },
      responseError: function (rejection) {
        if (rejection.status === 401) {
          $location.path('/auth');
        }
        return $q.reject(rejection);
      }
    };
}]);

twitterWallServices.factory('Packery', [function() {
  var packery = "";

  return {
    get: function () {
      return packery;
    },
    set: function(elem) {
      packery = new Packery(elem[0], {
        itemSelector: '.packery-tile'
      });
      return packery;
    }
  };
}]);