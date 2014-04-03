'use strict';

var twitterWallServices = angular.module('twitterWallServices', []);

twitterWallServices.factory('Blocks', ['CleanTweets', '$http', '$q', '$rootScope', function(CleanTweets, $http, $q, $rootScope) {
  var blocks = [];

  var createBlocksFromApiTweets = function(dimensions) {
    var blocks = [];
    var unitWidth = dimensions.w / 6.0;
    var unitHeight = dimensions.h / 4.0;
    var deferred = $q.defer();
    $http.get('/api/clean-tweets')
      .success(function(res) {
        res.tweets.forEach(function(tweet) {
          if (tweet.media_url) {
            var block = { w: 2*unitWidth, h: unitHeight, style: 'photo', tweet: tweet };
            blocks.push(block);
          } else { 
            var randomNum = Math.random()*9;
            var block = {};
            if (randomNum <= 3) { block = { w: unitWidth, h: unitHeight, style: 'textSquare', tweet: tweet }; } else
            if (randomNum <= 6) { block = { w: 2*unitWidth, h: unitHeight, style: 'textWide', tweet: tweet }; } else
            { block = { w: unitWidth, h: 2*unitHeight, style: 'textTall', tweet: tweet }; }
            blocks.push(block);
          }
        deferred.resolve(blocks);
      })
    });
    return deferred.promise;
  }

  return {
    get: function (dimensions) {
      var deferred = $q.defer();
      if (blocks.length === 0) {
        createBlocksFromApiTweets(dimensions).then(function(blocks) {
          deferred.resolve(blocks);
        });
      } else {
        deferred.resolve(blocks);
      }
      return deferred.promise;
    },
    addBlock: function(block) {
      blocks.push(block);
      return blocks;
    }
  };
}]);

// twitterWallServices.factory('Packer', ['$http', function($http) {
//   var packer = '';

//   return {
//     set: function () {

//     },
//     get: function () {
      
//       return packer;
//     }
//   };
// }]);

twitterWallServices.factory('CleanTweets', ['$http', function($http) {
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
      // return cleanTweets;
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