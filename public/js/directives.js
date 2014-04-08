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
    elem.addClass(randomColor());
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('textCardSquare', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {
    elem.addClass(randomColor());
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('textCardWide', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {
    elem.addClass(randomColor());
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('textCardTall', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {
    elem.addClass(randomColor());
    // console.log(elem);
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('sponsorCard', ['$compile', function($compile) {
  var linker = function(scope, elem, attrs) {
    elem.on("$destroy", function() {
      CleanLayout.decrNumSponsor();
    });
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

var randomColor = function() {
  var randomNum = Math.floor(Math.random()*10);
  switch(randomNum)
  {
  case 1:
    return "light-green";
  case 2:
    return "dark-green";
  case 3:
    return "pale-green";
  default:
    return "white";
  }
}