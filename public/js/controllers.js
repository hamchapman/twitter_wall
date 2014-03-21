'use strict';

var twitterWallControllers = angular.module('twitterWallControllers', ['twitterWallServices']);

twitterWallControllers.controller('AdminCtrl', [
  '$scope', 
  '$http', 
  '$timeout',
  'Pusher', 
  'CleanTweets', 
  function ($scope, $http, $timeout, Pusher, CleanTweets) {
    $scope.queries = [];
    $scope.tweets = [];
    $scope.activeIndexLeft = -1;
    $scope.activeIndexRight = -1;
    // $scope.tweets = [{text: "tester"}, 
    //                  {text: "tester 2"}, 
    //                  {text: "tester 3"}, 
    //                  {text: "tester 4"}, 
    //                  {text: "tester 5"}, 
    //                  {text: "tester 6"}
    // ];

    Pusher.subscribe('twitter_wall', 'new_tweet', function (data) {
      $scope.tweets.push(data['tweet']);
    });
    
    $scope.getTweets = function() {
      var queries = $scope.queries;
      $http.get('/api/tweets/' + queries)
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
  }]);

twitterWallControllers.controller('ViewerCtrl', [
  '$scope', 
  'Pusher', 
  'CleanTweets', 
  function ($scope, Pusher, CleanTweets) {
    $scope.cleanTweets = [];
    Pusher.subscribe('twitter_wall', 'new_clean_tweet', function (data) {
      $scope.cleanTweets.push(data['tweet']);
    });
  };
]);