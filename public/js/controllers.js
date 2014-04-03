'use strict';

var twitterWallControllers = angular.module('twitterWallControllers', ['twitterWallServices']);

twitterWallControllers.controller('AdminCtrl', [
  '$scope', 
  '$http', 
  function ($scope, $http) {

  }
]);
twitterWallControllers.controller('ViewerCtrl', [
  '$scope', 
  '$http',
  '$q',
  'Pusher',
  'CleanTweets',
  function ($scope, $http, $q, Pusher, CleanTweets) { 
    var packer = new Packer(1200, 800);
    var dimensions = { w: packer.w, h: packer.h };

    $scope.cleanTweets = [];
    $scope.fittedTweets = [];
    // CleanTweets.get().then(function(tweets) {

    // });
    $http.get('/api/clean-tweets')
      .success(function(res) {
        $scope.cleanTweets = res.tweets;
        addBlockInfoToCleanTweets(dimensions, $scope.cleanTweets).then(function(tweets) {
          packer.fit(tweets);
          tweets.forEach(function(tweet) {
            if (tweet.fit) { $scope.fittedTweets.push(tweet); }
          })
        })
      })

    Pusher.subscribe('twitter_wall', 'new_clean_tweet', function (data) {
      $scope.cleanTweets.push(data['tweet']);
    });

    Pusher.subscribe('twitter_wall', 'remove_clean_tweet', function (data) {
      var tweetIndex = data['index'];
      if(tweetIndex != -1) {
        $scope.cleanTweets.splice(tweetIndex, 1);
      }
    });

    var addBlockInfoToCleanTweets = function(dimensions, tweets) {
      var unitWidth = dimensions.w / 6.0;
      var unitHeight = dimensions.h / 4.0;
      var deferred = $q.defer();
        tweets.forEach(function(tweet) {
          if (tweet.media_url) {
            var block = { w: 2*unitWidth, h: unitHeight, style: 'photo'};
            _.extend(tweet,block);
          } else { 
            var randomNum = Math.random()*9;
            var block = {};
            if (randomNum <= 3) { block = { w: unitWidth, h: unitHeight, style: 'textSquare'}; } else
            if (randomNum <= 6) { block = { w: 2*unitWidth, h: unitHeight, style: 'textWide'}; } else
            { block = { w: unitWidth, h: 2*unitHeight, style: 'textTall'}; }
            _.extend(tweet,block);
          }
        deferred.resolve(tweets);
        })
      return deferred.promise;
    };

  }
]);

twitterWallControllers.controller('QueryCtrl', [
  '$scope', 
  '$http',
  'Pusher',
  function ($scope, $http, Pusher) {
    $scope.queries = [];
    $http.get('/api/queries')
      .success(function(res) {
        res.queries.forEach(function(query) {
          $scope.queries.push(query.text);
        }) 
      })

    Pusher.subscribe('twitter_wall', 'new_query', function (data) {
      $scope.queries.push(data['query']);
    });

    $scope.getTweets = function() {
      var query = $scope.query;
      $scope.query = '';
      $http.get('/api/tweets/' + query)
    };

    $scope.removeQuery = function(query, index) {
      $http.post('/api/remove-query', { index: index, query: query });
      var i = $scope.queries.indexOf(query);
      if(i != -1) {
        $scope.queries.splice(i, 1);
      }
    }
  }
]);

twitterWallControllers.controller('ModerateCtrl', [
  '$scope', 
  '$http',
  'Pusher',
  'CleanTweets',
  function ($scope, $http, Pusher, CleanTweets) {
    $scope.queries = [];
    $scope.tweets = [];
    $scope.activeIndexLeft = -1;
    $scope.activeIndexRight = -1;
    $http.get('/api/tweets-to-moderate')
      .success(function(res) {
        $scope.tweets = res.tweets;
      })

    Pusher.subscribe('twitter_wall', 'new_tweet', function (data) {
      $scope.tweets.push(data['tweet']);
    });

    $scope.verifyTweet = function (tweet, $index) {
      $scope.activeIndexLeft = $index;
      var i = $scope.tweets.indexOf(tweet);
      if(i != -1) {
        $scope.tweets.splice(i, 1);
      }
      CleanTweets.add(tweet);
    };

    $scope.discardTweet = function(tweet, $index) {
      $scope.activeIndexRight = $index;
      var i = $scope.tweets.indexOf(tweet);
      if(i != -1) {
        $scope.tweets.splice(i, 1);
      }
      $http.post('/api/remove-tweet', { tweet: tweet });
    };
  }
]);

twitterWallControllers.controller('ConfigCtrl', [
  '$scope', 
  '$http',
  function ($scope, $http) {
    $scope.isAutomatic = false;

    $scope.updatePusherConfig = function() {
      var app_id = $scope.pusher_app_id;
      var key = $scope.pusher_key;
      var secret = $scope.pusher_secret;
      var config = { app_id: app_id, key: key, secret: secret };
      $http.post('/api/pusher', { config: config });
    };

    $scope.swapMode = function() {
      $scope.isAutomatic = !$scope.isAutomatic;
      $http.get('/api/swap-mode')
        .success(function() {
          console.log("Mode has been swapped");
        });
    }
  }
]);

twitterWallControllers.controller('StyleCtrl', [
  '$scope', 
  '$http',
  function ($scope, $http) {
    
  }
]);

twitterWallControllers.controller('MirrorCtrl', [
  '$scope', 
  '$http',
  'Pusher',
  'CleanTweets',
  function ($scope, $http, Pusher, CleanTweets) {
    $scope.cleanTweets = [];
    $http.get('/api/clean-tweets')
      .success(function(res) {
        $scope.cleanTweets = res.tweets;
      })

    Pusher.subscribe('twitter_wall', 'new_clean_tweet', function (data) {
      $scope.cleanTweets.push(data['tweet']);
    });

    Pusher.subscribe('twitter_wall', 'remove_clean_tweet', function (data) {
      console.log("Receiving the pusher message");
      var tweetIndex = data['index'];
      if(tweetIndex != -1) {
        $scope.cleanTweets.splice(tweetIndex, 1);
      }
    });

    $scope.removeCleanTweet = function(tweet, index) {
      $http.post('/api/remove-clean-tweet', { tweet: tweet, index: index });
    };
  }
]);