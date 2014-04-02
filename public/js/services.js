'use strict';

var twitterWallServices = angular.module('twitterWallServices', []);

twitterWallServices.factory('Packery', function() {
  var packery = "";

  return {
    get: function () {
      return packery;
    },
    set: function(elem) {
      packery = new Packery(elem[0], {
        itemSelector: '.packery-tile',
        isHorizontal: true,
        gutter: 0,
        columnWidth: 100,
        rowHeight: 100
      });
      return packery;
    }
  };
});

// twitterWallServices.factory('Packery', function($http) {
//   var packery = "";

//   return {
//     get: function () {
//       return packery;
//     },
//     set: function(elem) {
//       packery = new Packery(elem[0], {
//         itemSelector: '.packery-tile',
//         isHorizontal: true,
//         gutter: 0,
//         columnWidth: 100,
//         rowHeight: 100
//       });
//       return packery;
//     }
//   };
// });

twitterWallServices.factory('Blocks', function($http) {
  // var blocks = [];
  var blocks = [
      { w: 200, h: 200, style: 'small' },
      { w: 200, h: 400, style: 'tall' },
      { w: 400, h: 200, style: 'wide' },
      { w: 400, h: 200, style: 'wide' },
      { w: 200, h: 400, style: 'tall' },
      { w: 400, h: 200, style: 'wide' },
      { w: 200, h: 200, style: 'small' },
      { w: 400, h: 200, style: 'wide' },
      { w: 400, h: 200, style: 'wide' },
      { w: 200, h: 400, style: 'tall' },
      { w: 200, h: 200, style: 'small' },
      { w: 200, h: 400, style: 'tall' },
      { w: 400, h: 200, style: 'wide' },
      { w: 400, h: 200, style: 'wide' },
      { w: 400, h: 200, style: 'wide' },
      { w: 200, h: 200, style: 'small' }
  ];

  return {
    get: function () {
      return blocks;
    },
    addBlock: function(block) {
      blocks.push(block);
      return blocks;
    }
  };
});

twitterWallServices.factory('CleanTweets', function($http) {
  var cleanTweets = [];

  return {
    get: function () {
      $http.get('/api/clean-tweets')
        .success(function(res) {
          cleanTweets = res.tweets;
        })
      return cleanTweets;
    },
    add: function(tweet) {
      return $http.post('/api/add-clean-tweet', { tweet: tweet })
    },
    remove: function(tweet) {
      return $http.post('/api/remove-clean-tweet', { tweet: tweet })
    },
    templateList: function() {
      return cleanTweets;
    },
    updateTemplateList: function(index, template) {
      cleanTweets[index].templateType = template;
      return;
    }
  };
});


twitterWallServices.factory('Tweets', function($http) {
  // var Tweets = [];

  return {
    get: function () {
      return $http.get('/api/tweets')
    },
    remove: function(tweet) {
      return $http.post('/api/remove-tweet', { tweet: tweet })
    }
  };
});

twitterWallServices.factory('Mode', function($http) {
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
});


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

twitterWallServices.factory('CleanLayout', function () {
  // No need to distinguish between wide and photo because of same dimensions
  var numTall = 0;
  var numWide = 0;
  var numSquare = 0;
  var numSponsor = 0;
  return {
    numTall: function () {
      return numTall;
    },
    incrNumTall: function () {
      return numTall += 1;
    },
    decrNumTall: function() {
      return numTall -= 1;
    },
    numWide: function () {
      return numWide;
    },
    incrNumWide: function () {
      return numWide += 1;
    },
    decrNumWide: function() {
      return numWide -= 1;
    },
    numSquare: function() {
      return numSquare;
    },
    incrNumSquare: function () {
      return numSquare += 1;
    },
    decrNumSquare: function() {
      return numSquare -= 1;
    },
    numSponsor: function() {
      return numSponsor;
    },
    incrNumSponsor: function () {
      return numSponsor += 1;
    },
    decrNumSponsor: function() {
      return numSponsor -= 1;
    },
    getTotalArea: function() {
      return numSquare + numSponsor + (2 * (numWide + numTall));
    }
  };
});

twitterWallServices.factory('LayoutCounter', function () {
  // No need to distinguish between wide and photo because of same dimensions
  var numTall = 0;
  var numWide = 0;
  var numSquare = 0;
  var numSponsor = 0;
  return {
    numTall: function () {
      return numTall;
    },
    incrNumTall: function () {
      return numTall += 1;
    },
    decrNumTall: function() {
      return numTall -= 1;
    },
    numWide: function () {
      return numWide;
    },
    incrNumWide: function () {
      return numWide += 1;
    },
    decrNumWide: function() {
      return numWide -= 1;
    },
    numSquare: function() {
      return numSquare;
    },
    incrNumSquare: function () {
      return numSquare += 1;
    },
    decrNumSquare: function() {
      return numSquare -= 1;
    },
    numSponsor: function() {
      return numSponsor;
    },
    incrNumSponsor: function () {
      return numSponsor += 1;
    },
    decrNumSponsor: function() {
      return numSponsor -= 1;
    },
    getTotalArea: function() {
      return numSquare + numSponsor + (2 * (numWide + numTall));
    }
  };
});