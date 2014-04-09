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

twitterWallDirectives.directive('grid', ['$q', '$http', function($q, $http) {
  var linker = function(scope, elem, attrs) {
    
  }
  return {
    restrict: "A",
    templateUrl: "/views/partials/blocks.html",
    link: linker
  }
}]);

twitterWallDirectives.directive('card', ['$compile', '$http', function($compile, $http) {
  var getTemplate = function(tweetType) {
    var templateLoader,
    baseUrl = '/views/partials/',
    templateMap = {
      textSquare: 'textCardSquare.html',
      textWide: 'textCardWide.html',
      textTall: 'textCardTall.html',
      photo: 'photoCard.html',
      sponsor: 'sponsorCard.html'
    };
    var templateUrl = baseUrl + templateMap[tweetType];
    templateLoader = $http.get(templateUrl);
    return templateLoader;
  }

  var linker = function(scope, elem, attrs) {
    var loader = getTemplate(scope.tweet.style);
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

// CUT DOWN DIRECTIVES BELOW TO A SINGLE ONE

twitterWallDirectives.directive('photoCard', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {
    elem.addClass(randomStyle());
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('textCardSquare', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {
    elem.addClass(randomStyle());
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('textCardWide', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {
    elem.addClass(randomStyle());
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('textCardTall', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {
    elem.addClass(randomStyle());
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('sponsorCard', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {

  }
  return {
    restrict: "C",
    link: linker
  }
}]);

var randomStyle = function() {
  var randomNum = Math.floor(Math.random()*10);
  if (randomNum < 2) { return "light-green-bg"; }
  if (randomNum < 4) { return "dark-green-bg"; }
  if (randomNum < 7) { return "white-bg"; }
  return "diagonal-stripes orange-text bebas-neue";
}