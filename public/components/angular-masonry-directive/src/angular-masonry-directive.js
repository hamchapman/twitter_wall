"use strict";

angular.module('masonry', ['ng']).directive('masonry', function() {
  return {
    restrict: 'AC',
    link: function(scope, elem, attrs) {
      // scope.items = [];
      var container = elem[0];
      var options = { transitionDuration : "0s" , itemSelector : ".tile" , isOriginLeft : false , isOriginTop : false };
      scope.obj = new Masonry(container, options);
    }
  };
}).directive('tile', function() {
  return {
    restrict: 'C',
    link: function(scope, elem) {
      var master = elem.parent('*[masonry]:first').scope();
      var masonry = master.obj;

      elem.ready(function() {
        masonry.addItems([elem]);
        masonry.reloadItems();
        masonry.layout();
      });
    }
  };
});