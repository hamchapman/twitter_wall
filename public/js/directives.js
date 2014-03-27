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

twitterWallServices.directive('card', function() {
  return {
    restrict: "E",
    templateUrl: '/views/partials/card.html',
    // link: function () {
    // }
  }
});