'use strict';

var twitterWallDirectives = angular.module('twitterWallDirectives', []);

// twitterWallDirectives.directive('packery', ['$rootScope', function($rootScope) {
//   return {
//     constrain: 'A',
//     link: function(scope, element, attrs) {
//       element.ready(function() {
//         var packery = new Packery(element[0], {
//           // rowHeight: '.module-sizer',
//           itemSelector: '.packery',
//           // columnWidth: '.module-sizer'
//         });
//         // angular.forEach(packery.getItemElements(), function(item) {
//         //   var draggable = new Draggabilly(item);
//         //   packery.bindDraggabillyEvents(draggable);
//         // });
//         packery.layout();
//       });
//     }
//   };
// }]);

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
        break;
      case 2:
        tweetType = 'textWide';
        break;
      default:
        tweetType = 'textSquare';
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
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

var randomColor = function() {
  var randomNum = Math.floor(Math.random()*4);
  switch(randomNum)
  {
  case 1:
    return "light-green";
  case 2:
    return "dark-green";
  case 3:
    return "pale-green";
  default:
    return "light-grey";
  }
}