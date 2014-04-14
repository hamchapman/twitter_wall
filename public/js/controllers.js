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
  '$window',
  function ($scope, $http, $q, Pusher, CleanTweets, $window) { 
    $scope.windowWidth = $window.innerWidth;
    $scope.windowHeight = $window.innerHeight;
    var dimensions = { w: $scope.windowWidth, h: $scope.windowHeight - 140 };

    var w = angular.element($window); 
    w.bind('resize', function () {
      $scope.$apply(function () { 
        // Need to re-add block info to tweets here to make sure they scale in size with the grid
        var packer = new Packer(w[0].innerWidth, w[0].innerHeight);
        packer.fit($scope.cleanTweets);
      }
    )});

    $scope.cleanTweets = [];
    CleanTweets.get().then(function(tweets) {
      $scope.cleanTweets = tweets;
      addBlockInfoToCleanTweets(dimensions, $scope.cleanTweets).then(function(tweets) {
        var packer = new Packer($scope.windowWidth, $scope.windowHeight);
        packer.fit($scope.cleanTweets);
      })
    });

    Pusher.subscribe('twitter_wall', 'new_clean_tweet', function (data) {
      var tweet = addBlockInfoToTweet(dimensions, data['tweet']);
      $scope.cleanTweets.unshift(tweet);
      var packer = new Packer($scope.windowWidth, $scope.windowHeight);
      packer.fit($scope.cleanTweets);
    });

    Pusher.subscribe('twitter_wall', 'remove_clean_tweet', function (data) {
      var tweetIndex = data['index'];
      if(tweetIndex != -1) {
        $scope.cleanTweets.splice(tweetIndex, 1);
        $scope.$apply(function () { 
          var packer = new Packer($scope.windowWidth, $scope.windowHeight);
          packer.fit($scope.cleanTweets);
        })
      }
    });

    var addBlockInfoToTweet = function(dimensions, tweet) {
      var unitWidth = dimensions.w / 5.0;
      var unitHeight = dimensions.h / 3.0;
      if (tweet.media_url) {
        var block = { w: 2*unitWidth, h: unitHeight, style: 'photo'};
        _.extend(tweet, block);
      } else if (tweet.sponsor) {
        var block = { w: unitWidth, h: unitHeight, style: 'sponsor'};
        _.extend(tweet, block);
      } else { 
        var randomNum = Math.random()*10;
        var block = {};
        if (randomNum <= 2) { block = { w: unitWidth, h: unitHeight, style: 'textSquare'}; } else
        if (randomNum <= 6) { block = { w: 2*unitWidth, h: unitHeight, style: 'textWide'}; } else
        { block = { w: unitWidth, h: 2*unitHeight, style: 'textTall'}; }
        _.extend(tweet, block);
      }
      return tweet;
    }

    var addBlockInfoToCleanTweets = function(dimensions, tweets) {
      var deferred = $q.defer();
      addSponsorLogosToCleanTweets(tweets).then(function() {
        tweets.forEach(function(tweet) {
          addBlockInfoToTweet(dimensions, tweet);
        })
        deferred.resolve(tweets);
      });
      return deferred.promise;
    }

    var addSponsorLogosToCleanTweets = function(tweets) {
      var deferred = $q.defer();
      $http.get('/sponsor-logos')
        .success(function(res) {
          var logos = res.logos;
          if (logos.length > 0) {
            for(var i = 0; i < ($scope.cleanTweets.length / 6); i++) {
              var randomNum = Math.floor(Math.random()*(logos.length));
              var sponsorTweet = { sponsor: true, path: logos[randomNum].path };
              $scope.cleanTweets.splice(((i * 6) + 6), 0, sponsorTweet);
            }
          }
          deferred.resolve();
        });
      return deferred.promise;
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

    $scope.getTweets = function() {
      var query = $scope.query;
      $scope.query = '';
      $http.get('/api/tweets/' + query);
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

twitterWallControllers.controller('LogoCtrl', [
  '$scope', 
  '$http',
  function ($scope, $http) {
    $scope.sponsorLogos = [];
    $scope.companyLogo = [];
    $scope.companyLogo.path = "/img/logo.png";

    $http.get('/sponsor-logos')
      .success(function(res) {
        $scope.sponsorLogos = res.logos;
      });

    $scope.sponsorComplete = function(content) {
      $scope.sponsorLogos.push({path: content.path});
    } 

    // $scope.companyComplete = function(content) {
    //   $scope.comapnyLogo = {path: content.path};
    // }

    $scope.removeSponsorLogo = function(logo, index) {
      var i = $scope.sponsorLogos.indexOf(logo);
      if (1 != -1) {
        $scope.sponsorLogos.splice(i, 1)
      }
      $http.post('/remove-sponsor-logo', { logo: logo });
    }
  }
]);

twitterWallControllers.controller('StyleCtrl', [
  '$scope', 
  '$http',
  function ($scope, $http) {
    
  }
]);

twitterWallControllers.controller('ResetCtrl', [
  '$scope', 
  '$http',
  function ($scope, $http) {
    $scope.fullReset = function() {
      $http.post('/api/full-reset', { reset: true });
    }
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

twitterWallControllers.controller('SetupCtrl', [
  '$scope', 
  '$http',
  'Pusher',
  'CleanTweets',
  function ($scope, $http, Pusher, CleanTweets) {

  }
]);