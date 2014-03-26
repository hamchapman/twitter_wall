'use strict';

var twitterWallControllers = angular.module('twitterWallControllers', ['twitterWallServices']);

twitterWallControllers.controller('AdminCtrl', [
  '$scope', 
  '$http', 
  'Pusher', 
  'CleanTweets', 
  function ($scope, $http, Pusher, CleanTweets) {
    $scope.queries = [];
    $scope.tweets = [];
    $scope.activeIndexLeft = -1;
    $scope.activeIndexRight = -1;

    Pusher.subscribe('twitter_wall', 'new_tweet', function (data) {
      $scope.tweets.push(data['tweet']);
    });

    $http.get('/api/client-setups')
      .success(function(res) {
        $http.get('/api/stream-restart')
          .success(function(res) {
            console.log(res);
            console.log("Pre-existing streams restarted");
          });
      });
    
    $scope.getTweets = function() {
      var query = $scope.query;
      $scope.query = '';
      $http.get('/api/tweets/' + query)
    };

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

twitterWallControllers.controller('ViewerCtrl', [
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
  }
]);

twitterWallControllers.controller('SettingsCtrl', [
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

    $scope.updatePusherConfig = function() {
      var app_id = $scope.pusher_app_id;
      var key = $scope.pusher_key;
      var secret = $scope.pusher_secret;
      var config = { app_id: app_id, key: key, secret: secret };
      $http.post('/api/pusher', { config: config });
    }; 

    $scope.removeQuery = function(query, index) {
      console.log("The query is: " + query);
      $http.post('/api/remove-query', { index: index, query: query });
      var i = $scope.queries.indexOf(query);
      if(i != -1) {
        $scope.queries.splice(i, 1);
      }
    }

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

    $scope.removeQuery = function(query, index) {
      console.log("The query is: " + query);
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

    Pusher.subscribe('twitter_wall', 'new_tweet', function (data) {
      $scope.tweets.push(data['tweet']);
    });
    
    $scope.getTweets = function() {
      var query = $scope.query;
      $scope.query = '';
      $http.get('/api/tweets/' + query)
    };

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
    $scope.updatePusherConfig = function() {
      var app_id = $scope.pusher_app_id;
      var key = $scope.pusher_key;
      var secret = $scope.pusher_secret;
      var config = { app_id: app_id, key: key, secret: secret };
      $http.post('/api/pusher', { config: config });
    };
  }
]);

twitterWallControllers.controller('StyleCtrl', [
  '$scope', 
  '$http',
  function ($scope, $http) {
    
  }
]);