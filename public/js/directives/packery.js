// "use strict";

// angular.module('packery', ['ng']).directive('packery', ['Packery', function(Packery) {
//   return {
//     constrain: 'A',
//     link: function(scope, elem, attrs) {
//       var packery = Packery.set(elem);
//     }
//   };
// }]).directive('packeryTile', ['Packery', function(Packery) {
//   return {
//     restrict: 'C',
//     link: function(scope, elem) {
//       var packery = Packery.get();
//       elem.ready(function() {
//         // console.log(scope.$index);
//         // packery.prepended([elem]);
//         // console.log(scope.$last);
//         // packery.addItems(elem);
//         // packery.items.splice(Math.floor(Math.random()*packery.items.length), 0, elem);
//         // console.log(packery.getItemElements());
//         // packery.items = shuffle(packery.items);
//         // console.log(packery.getItemElements());
//         // packery.reloadItems();
//         // console.log(packery.getItemElements()[0].className);
//         // swapSponsorsWithSquares(packery);
//         // console.log(packery.items);
//         packery.reloadItems();
//         // packery.reloadItems();
//         // packery.fit();
//         // console.log(scope.$last);
//         // console.log(packery.getItemElements());
//         // packery.reloadItems();
//         packery.layout();
//         // console.log(packery.getItemElements());
//         // console.log(packery.items);
//       });
//     }
//   }; 
// }]);



// var shuffle = function(a){
//   for (var j, x, i = a.length; i; j = Math.floor( Math.random() * i ), x = a[--i], a[i] = a[j], a[j] = x );
//   return a;
// };

// // var swapSponsorsWithSquares = function(packery) {
// //   var indicesOfSquares = [];
// //   var indicesOfSponsors = [];
// //   packery.getItemElements().forEach(function(element, index) {
// //     if (element.className.indexOf("square") != -1) { indicesOfSquares.push(index); }
// //     if (element.className.indexOf("sponsor") != -1) { indicesOfSponsors.push(index); }
// //   })
// //   for (var i=0; i < Math.min(indicesOfSquares.length - 1, indicesOfSponsors.length - 1); i++) {
// //     var temp = packery.items[indicesOfSquares[i]];
// //     packery.items[indicesOfSquares[i]] = packery.items[indicesOfSponsors[i]];
// //     packery.items[indicesOfSponsors[i]] = temp;
// //   }
// // };