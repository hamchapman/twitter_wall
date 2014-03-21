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
    $scope.tweets = [{text: "tester"}, {text: "tester 2"}, {text: "tester 3"}, {text: "tester 4"}, {text: "tester 5"}, {text: "tester 6"}];

    Pusher.subscribe('twitter_wall', 'new_tweet', function (data) {
      console.log("Pusher got some data in Angualar");
      console.log(data);
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
      $http.post('/api/remove-tweet', { tweet: tweet })
    }
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
}]);


// twitterWallControllers.controller('UserCtrl', [
//   '$scope',
//   '$http',
//   '$window',
//   function ($scope, $http, $window) {
//     $scope.user = {username: '', password: ''};
//     $scope.isAuthenticated = false;
//     $scope.welcome = '';
//     $scope.message = '';

//     $scope.submit = function () {
//       $http
//         .post('/authenticate', $scope.user)
//         .success(function (data, status, headers, config) {
//           $window.sessionStorage.token = data.token;
//           $scope.isAuthenticated = true;
//           var encodedProfile = data.token.split('.')[1];
//           var profile = JSON.parse(url_base64_decode(encodedProfile));
//           $scope.welcome = 'Welcome ' + profile.first_name + ' ' + profile.last_name;
//         })
//         .error(function (data, status, headers, config) {
//           // Erase the token if the user fails to log in
//           delete $window.sessionStorage.token;
//           $scope.isAuthenticated = false;

//           // Handle login errors here
//           $scope.error = 'Error: Invalid user or password';
//           $scope.welcome = '';
//         });
//     };

//     $scope.logout = function () {
//       $scope.welcome = '';
//       $scope.message = '';
//       $scope.isAuthenticated = false;
//       delete $window.sessionStorage.token;
//     };

//     $scope.callRestricted = function () {
//       $http({url: '/api/restricted', method: 'GET'})
//       .success(function (data, status, headers, config) {
//         $scope.message = $scope.message + ' ' + data.name;
//       })
//       .error(function (data, status, headers, config) {
//         alert(data);
//       });
//     };
// }]);

// function url_base64_decode(str) {
//   var output = str.replace('-', '+').replace('_', '/');
//   switch (output.length % 4) {
//     case 0:
//       break;
//     case 2:
//       output += '==';
//       break;
//     case 3:
//       output += '=';
//       break;
//     default:
//       throw 'Illegal base64url string!';
//   }
//   return window.atob(output);
// }
