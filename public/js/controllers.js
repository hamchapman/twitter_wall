'use strict';

var twitterWallControllers = angular.module('twitterWallControllers', ['twitterWallServices']);

twitterWallControllers.controller('AdminCtrl', [
  '$scope', 
  '$http', 
  function ($scope, $http) {

  }
]);

twitterWallControllers.controller('HashtagCtrl', [
  '$scope', 
  '$http',
  'Hashtag',
  function ($scope, $http, Hashtag) {
    Hashtag.get().then(function(hashtag) {
      if (hashtag) { $scope.hashtag = hashtag.text }
      else { $scope.hashtag = '#changeMe'; }
    });

    $scope.saveHashtag = function() {
      Hashtag.set($scope.hashtag);
    }
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
    $scope.sponsorLogos = [];
    $http.get('/sponsor-logos')
      .success(function(res) {
        $scope.sponsorLogos = res.logos;
      });

    $scope.windowWidth = $window.innerWidth;
    $scope.windowHeight = $window.innerHeight;
    $scope.dimensions = { w: $scope.windowWidth, h: $scope.windowHeight - 80 };

    // Repacks the grid with more / fewer cards depending on window resize
    // Could choose to resize the cards if number of cards is wanted to remain constant
    // Would need to add in another call to addBlockInfoToCleanTweets to do that
    var w = angular.element($window); 
    w.bind('resize', function () {
      $scope.$apply(function () { 
        $scope.dimensions = { w: w[0].innerWidth, h: w[0].innerHeight };

        // Set "breakpoints" for changing number of rows/columns of cards here 
        if (w[0].innerWidth < 900) {
          addBlockInfoToCleanTweets($scope.dimensions, $scope.cleanTweets, 3.0, 3.0)
        } else {
          addBlockInfoToCleanTweets($scope.dimensions, $scope.cleanTweets, 4.0, 3.0)
        }
        
        var packer = new Packer(w[0].innerWidth, w[0].innerHeight);
        packer.fit($scope.cleanTweets);
      }
    )});

    $scope.cleanTweets = [];
    CleanTweets.get().then(function(tweets) {
      $scope.cleanTweets = tweets.reverse();
      if ($scope.dimensions.w < 900) {
        var numX = 3.0;
        var numY = 3.0;
      }
      addBlockInfoToCleanTweets($scope.dimensions, $scope.cleanTweets, numX, numY).then(function(tweets) {
        var packer = new Packer($scope.windowWidth, $scope.windowHeight);
        packer.fit($scope.cleanTweets);
      });
      
    });

    var previousGrid = 1;   // $scope.cleanTweets is on top when previousGrid == 1
    Pusher.subscribe('twitter_wall', 'new_clean_tweet', function (data) {
      var tweet = addBlockInfoToTweet($scope.dimensions, data['tweet']);
      if (previousGrid == 1) {
        $scope.cleanTweets2 = _.cloneDeep($scope.cleanTweets);
        $scope.cleanTweets2.unshift(tweet);
        var packer = new Packer($scope.windowWidth, $scope.windowHeight);
        packer.fit($scope.cleanTweets2, function() {
          grid2.classList.remove("inactive");
          grid2.classList.add("active");
          var grid1 = $document[0].getElementById("grid");
          grid1.classList.remove("active");
          grid1.classList.add("inactive");
        });  
        previousGrid = -1;  // Set the previousGrid value to -1 to imply that the grids has flipped over
      } else {
        $scope.cleanTweets = _.cloneDeep($scope.cleanTweets2);
        $scope.cleanTweets.unshift(tweet);
        var packer = new Packer($scope.windowWidth, $scope.windowHeight);
        packer.fit($scope.cleanTweets, function() {
          var grid1 = $document[0].getElementById("grid");
          grid1.classList.remove("inactive");
          grid1.classList.add("active");
          grid2.classList.remove("active");
          grid2.classList.add("inactive");
        });  
        previousGrid = 1;
      }
    });
    
    Pusher.subscribe('twitter_wall', 'remove_clean_tweet', function (data) {
      var tweetIndex = data['index'];
      if(tweetIndex != -1) {
        if (previousGrid == 1) { $scope.cleanTweets.splice(tweetIndex, 1); }
        else { $scope.cleanTweets2.splice(tweetIndex, 1); }
        $scope.$apply(function () { 
          var packer = new Packer($scope.windowWidth, $scope.windowHeight);
          packer.fit($scope.cleanTweets);
        })
      }
    });

    var addBlockInfoToTweet = function(dimensions, tweet, numX, numY) {
      // Packer block info gets added to the tweets based on grid layout and window size
      // Tweets are also given the appropriate style to later be given the appropriate template
      var unitWidth = $scope.dimensions.w / numX;
      var unitHeight = $scope.dimensions.h / numY;
      if (tweet.media_url) {
        var block = { w: 2*unitWidth, h: unitHeight, style: 'photo'};
        _.extend(tweet, block);
      } else { 
        var randomNum = Math.random()*10;
        var block = {};
        if (randomNum <= 10) { block = { w: unitWidth, h: unitHeight, style: 'textSquare'}; } 
        _.extend(tweet, block);
      }
      return tweet;
    }

    var addBlockInfoToCleanTweets = function(dimensions, tweets, numX, numY) {
      if (!numX) { numX = 3.0; }  // Set the default number of rows
      if (!numY) { numY = 3.0; }  // Set the default number of columns
      var deferred = $q.defer();
      tweets.forEach(function(tweet) {
        addBlockInfoToTweet($scope.dimensions, tweet, numX, numY);
      })
      deferred.resolve(tweets);
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

    // Get request to API to get a list of the current queries
    $http.get('/api/queries')
      .success(function(res) {
        res.queries.forEach(function(query) {
          $scope.queries.push(query.text);
        }) 
      })

    // Subscribe to Pusher event that new query has been added to DB
    Pusher.subscribe('twitter_wall', 'new_query', function (data) {
      $scope.queries.push(data['query']);
    });

    // Get request to API to setup a new stream based on a query
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
        $scope.tweets = res.tweets.reverse();
      })

    // Subscribe to Pusher event that new tweet has been added to DB
    Pusher.subscribe('twitter_wall', 'new_tweet', function (data) {
      $scope.tweets.push(data['tweet']);
    });

    // Verify that a tweet can be shown on the twitter wall
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
    $http.get('/api/mode')
        .success(function(res) {
          console.log(res);
          $scope.isAutomatic = res.automatic;
        });

    $http.get('/setup/pusher-info')
        .success(function(res) {
          console.log(res);
          $scope.pusherAppId = res.app_id;
          $scope.pusherKey = res.key;
          $scope.pusherSecret = res.secret;
        });

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
  'fileReader',
  function ($scope, $http, fileReader) {
    $scope.sponsorLogos = [];
    $scope.companyLogo = {};
    $scope.companyLogo.path = '/img/logo.png';

    $http.get('/sponsor-logos')
      .success(function(res) {
        $scope.sponsorLogos = res.logos;
      });

    $scope.sponsorComplete = function(content) {
      $scope.sponsorLogos.pop();
      $scope.sponsorLogos.push({path: content.path});
    } 

    $scope.companyComplete = function(content) {
      $scope.companyLogo.path = content.path;
    }

    $scope.removeSponsorLogo = function(logo, index) {
      var i = $scope.sponsorLogos.indexOf(logo);
      if (1 != -1) {
        $scope.sponsorLogos.splice(i, 1)
      }
      $http.post('/remove-sponsor-logo', { logo: logo });
    }

    $scope.getFile = function(type) {
      fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
          if (type == 'sponsor') { $scope.sponsorLogos.push({path: result}); }
          else { $scope.companyLogo.path = result; }
        });
    };
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
  'Packery',
  function ($scope, $http, Pusher, CleanTweets, Packery) {
    $scope.cleanTweets = [];
    $http.get('/api/clean-tweets')
      .success(function(res) {
        $scope.cleanTweets = res.tweets.reverse();
      })

    Pusher.subscribe('twitter_wall', 'new_clean_tweet', function (data) {
      $scope.cleanTweets.push(data['tweet']);
    });

    Pusher.subscribe('twitter_wall', 'remove_clean_tweet', function (data) {
      var tweetIndex = data['index'];
      if(tweetIndex != -1) {
        $scope.cleanTweets.splice(tweetIndex, 1);
      }

      // *** Potentially need to do something like this to make it relayout when a tweet is removed *** 

      // var packery = Packery.get();
      // packery.reloadItems();
      // packery.layout();
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