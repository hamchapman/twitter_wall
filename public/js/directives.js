'use strict';

var twitterWallDirectives = angular.module('twitterWallDirectives', []);

twitterWallDirectives.directive('unmoderatedCard', function() {
  return {
    restrict: "E",
    templateUrl: '/views/partials/unmoderatedCard.html',
    // link: function () {
    // }
  }
});

twitterWallDirectives.directive('card', ['$timeout', '$compile', '$http', function($timeout, $compile, $http) {
  var getTemplate = function(tweetType) {
    var templateLoader,
    baseUrl = '/views/partials/',
    templateMap = {
      textSquare: 'textCardSquare.html',
      textWide: 'textCardWide.html',
      textTall: 'textCardTall.html',
      photo: 'photoCard.html',
    };
    var templateUrl = baseUrl + templateMap[tweetType];
    templateLoader = $http.get(templateUrl);
    return templateLoader;
  }

  var linker = function(scope, elem, attrs) {
    var randomNum = Math.floor(Math.random()*3);
    var tweetType = '';
    if (scope.tweet.media_url) {
      tweetType = 'photo';
    } else {
      switch(randomNum)
      {
      case 1:
        tweetType = 'textTall';
        // elem.addClass("light-green");
        break;
      case 2:
        tweetType = 'textWide';
        // elem.addClass("dark-green");
        break;
      default:
        tweetType = 'textSquare';
        // elem.addClass("pale-green");
      }
    }
    var loader = getTemplate(tweetType);
    var promise = loader.success(function(html) {
      elem.html(html);
    }).then(function (response) {
      $compile(elem.contents())(scope)
    });
  }
  return {
    restrict: "E",
    link: linker
  }
}]);

twitterWallDirectives.directive('photo-card', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {
    console.log("Photo card bitches");
    var randomNum = Math.floor(Math.random()*3);
    switch(randomNum)
    {
    case 1:
      elem.addClass("light-green");
      break;
    case 2:
      elem.addClass("dark-green");
      break;
    default:
      elem.addClass("pale-green");
    }
  }
  return {
    restrict: "AC",
    link: linker
  }
}]);

twitterWallDirectives.directive('text-card-square', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {
    var randomNum = Math.floor(Math.random()*3);
    switch(randomNum)
    {
    case 1:
      elem.addClass("light-green");
      break;
    case 2:
      elem.addClass("dark-green");
      break;
    default:
      elem.addClass("pale-green");
    }
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('text-card-wide', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {
    var randomNum = Math.floor(Math.random()*3);
    switch(randomNum)
    {
    case 1:
      elem.addClass("light-green");
      break;
    case 2:
      elem.addClass("dark-green");
      break;
    default:
      elem.addClass("pale-green");
    }
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('text-card-tall', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {
    var randomNum = Math.floor(Math.random()*3);
    console.log("Here's a tall one and the random num was: " + randomNum);
    switch(randomNum)
    {
    case 1:
      elem.addClass("light-green");
      break;
    case 2:
      elem.addClass("dark-green");
      break;
    default:
      elem.addClass("pale-green");
    }
  }
  return {
    restrict: "C",
    link: linker
  }
}]);