'use strict';

var twitterWallDirectives = angular.module('twitterWallDirectives', []);

twitterWallServices.directive('unmoderatedCard', function() {
  return {
    restrict: "E",
    templateUrl: '/views/partials/unmoderatedCard.html',
    // link: function () {
    // }
  }
});
twitterWallServices.directive('card', ['$timeout', '$compile', '$http', function($timeout, $compile, $http) {
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
    var tweetType = '';
    if (scope.tweet.media_url) {
      tweetType = 'photo';
    } else {
      
      tweetType = 'text';
    }

    var master = elem.parent('*[masonry]:first').scope();
    var masonry = master.obj;
    // var masonry = new Masonry(document.querySelector(".masonry-container"), { "transitionDuration" : "0s" , "itemSelector" : ".tile"  });
    elem.ready(function() {
      masonry.addItems([elem]);
      masonry.reloadItems();
      if(scope.$last) {
        $timeout(function() { masonry.layout(); }, 500);
        // masonry.layout();
      }
    });

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