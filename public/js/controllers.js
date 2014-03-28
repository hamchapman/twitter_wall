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
  'Pusher',
  'CleanTweets',
  function ($scope, $http, Pusher, CleanTweets) {
    console.log("Getting http tweets");
    $scope.cleanTweets = [];
    $http.get('/api/clean-tweets')
      .success(function(res) {
        console.log("Finished http tweets");
        $scope.cleanTweets = res.tweets;
        // console.log($scope.cleanTweets);
      })
//       $scope.cleanTweets = [{media_url: "http://pbs.twimg.com/media/BjvzBseCYAAa6b1.jpg",
// profile_image_url: "http://pbs.twimg.com/profile_images/448513116280590336/h4DMsaZW_normal.jpeg",
// text: "RT @PoOoY: 140322 2PM Press Conference HEC 2014 KOREA FESTIVAL IN VIETNAM  http://t.co/CLgNjVYPVI http://t.co/9SskI0Alvt",
// tweeter: "daowinkies"}, {media_url: "http://pbs.twimg.com/media/BjvrMcWCcAAB3Zb.jpg",
// profile_image_url: "http://pbs.twimg.com/profile_images/435006143060918273/Zg5Tv7vP_normal.jpeg",
// text: "\"@SparkyuINA: 140322 Super Junior M Press Conference - Kyuhyun {1} (cr : Rice) http://t.co/uda3VA6gTz\"",
// tweeter: "Ananda21Kiki"}, {media_url: "http://pbs.twimg.com/media/Bjvzk5vIEAAq63M.jpg",
// profile_image_url: "http://pbs.twimg.com/profile_images/447778417266528256/R_5bLHp1_normal.jpeg",
// text: "RT @Jamjamisme: 140322 Sungmin Donghae SWING Press Conference [cr.Venlyn消失] http://t.co/RhGonYo7wS",
// tweeter: "hanchulonly32"}]

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