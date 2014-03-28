"use strict";

angular.module('masonry', ['ng']).directive('masonry', function($parse) {
  return {
    restrict: 'AC',
    link: function(scope, elem, attrs) {
      console.log("In masonry link");
      // scope.items = [];
      var container = elem[0];
      var options = angular.extend({
        // itemSelector: '.item'
      }, JSON.parse(attrs.masonry));
      console.log("Just before new masonry setup");
      scope.obj = new Masonry(container, options);
    }
  };
})