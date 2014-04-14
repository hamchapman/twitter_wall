"use strict";

angular.module('packery', ['ng']).directive('packery', ['Packery', function(Packery) {
  return {
    constrain: 'A',
    link: function(scope, elem, attrs) {
      var packery = Packery.set(elem);
    }
  };
}]).directive('packeryTile', ['Packery', function(Packery) {
  return {
    restrict: 'C',
    link: function(scope, elem) {
      var packery = Packery.get();
      elem.ready(function() {
        packery.reloadItems();
        packery.layout();
      });
    }
  }; 
}]);