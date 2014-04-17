'use strict';

var twitterWallDirectives = angular.module('twitterWallDirectives', []);

twitterWallDirectives.directive('logoUploader', [function() {
  return {
    link: function (scope, elem, attrs) {
      elem.on('change', function(e) {
        e.target.form.submit();
        scope.file = (e.srcElement || e.target).files[0];
        if (e.target.name == 'sponsorLogo') { scope.getFile('sponsor'); } 
        else { scope.getFile('company'); }
      })
    }
  };
}]);

twitterWallDirectives.directive('ngConfirmClick', [function() {
  return {
    link: function (scope, elem, attrs) {
      var msg = attrs.ngConfirmClick || "Are you sure?";
      elem.bind('click',function (event) {
        if ( window.confirm(msg) ) {
          scope.$apply(attrs.confirmedClick);
        }
      });
    }
  };
}]);

twitterWallDirectives.directive('sidebarOption', [function() {
  return {
    link: function (scope, elem, attrs) {
      elem.bind('click',function (event) {
        elem.parent().children().removeClass('sidebar-active');
        elem.addClass('sidebar-active');
      });
    }
  };
}]);

twitterWallDirectives.directive('unmoderatedCard', ['$http', '$compile', function($http, $compile) {
  var getTemplate = function(tweetType) {
    var templateLoader,
    baseUrl = '/views/partials/',
    templateMap = {
      text: 'unmoderatedTextCard.html',
      photo: 'unmoderatedPhotoCard.html',
    };
    var templateUrl = baseUrl + templateMap[tweetType];
    templateLoader = $http.get(templateUrl);
    return templateLoader;
  }
  
  var linker = function(scope, elem, attrs) {
    scope.tweet.formattedDate = moment(scope.tweet.date).fromNow(true);

    var tweetType = '';
    if (scope.tweet.media_url) { tweetType = 'photo'; }
    else { tweetType = 'text'; }
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

twitterWallDirectives.directive('mirrorCard', ['$http', '$compile', function($http, $compile) {
  var getTemplate = function(tweetType) {
    var templateLoader,
    baseUrl = '/views/partials/',
    templateMap = {
      text: 'mirrorTextCard.html',
      photo: 'mirrorPhotoCard.html',
    };
    var templateUrl = baseUrl + templateMap[tweetType];
    templateLoader = $http.get(templateUrl);
    return templateLoader;
  }
  
  var linker = function(scope, elem, attrs) {
    scope.tweet.formattedDate = moment(scope.tweet.date).fromNow(true);

    var tweetType = '';
    if (scope.tweet.media_url) { tweetType = 'photo'; }
    else { tweetType = 'text'; }
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

twitterWallDirectives.directive('grid', ['$q', '$http', function($q, $http) {
  var linker = function(scope, elem, attrs) {
    
  }
  return {
    restrict: "A",
    templateUrl: "/views/partials/blocks.html",
    link: linker
  }
}]);

twitterWallDirectives.directive('grid2', ['$q', '$http', function($q, $http) {
  var linker = function(scope, elem, attrs) {
    
  }
  return {
    restrict: "A",
    templateUrl: "/views/partials/blocks2.html",
    link: linker
  }
}]);

twitterWallDirectives.directive('card', ['$compile', '$http', function($compile, $http) {
  var getTemplate = function(tweetType) {
    var templateLoader,
    baseUrl = '/views/partials/',
    templateMap = {
      textSquare: 'textCardSquare.html',
      photo: 'photoCard.html',
    };
    var templateUrl = baseUrl + templateMap[tweetType];
    templateLoader = $http.get(templateUrl);
    return templateLoader;
  }

  var linker = function(scope, elem, attrs) {
    scope.tweet.formattedDate = moment(scope.tweet.date).fromNow();

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

// MAYBE CUT DOWN DIRECTIVES BELOW TO A SINGLE ONE
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

var randomStyle = function() {
  var randomNum = Math.floor(Math.random()*12);
  if (randomNum < 2) { return "green-bg-white"; }
  if (randomNum < 4) { return "pink-bg-white"; } 
  if (randomNum < 6) { return "white-bg-black"; }
  if (randomNum < 8) { return "white-bg-green"; }
  if (randomNum < 10) { return "white-bg-pink"; }
  return "diagonal-stripes bebas-neue";
}