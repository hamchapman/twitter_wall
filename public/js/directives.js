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

twitterWallDirectives.directive('card', [
  '$compile', 
  '$http', 
  'CleanLayout', 
  'CleanTweets',
  'LayoutCounter',
  'Packery',
  function($compile, $http, CleanLayout, CleanTweets, LayoutCounter, Packery) {
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

    // CODE TO REMOVE ANY SPONSOR CARDS
    //
    //
    // NEEDS TO HAPPEN BEFORE EVERYTHING ELSE


    // var numTall = CleanLayout.numTall();
    // var numWide = CleanLayout.numWide();
    // var totalArea = CleanLayout.getTotalArea();

    var numTall = LayoutCounter.numTall();
    var numWide = LayoutCounter.numWide();
    var totalArea = LayoutCounter.getTotalArea();
    
    var tweetType = '';
    if (scope.tweet.media_url) {
      tweetType = 'photo';
      LayoutCounter.incrNumWide();
      // console.log("1");
    } else if (scope.$index > 8) {
      var randomNum = Math.floor(Math.random()*2);
      switch(randomNum) {
        case 1:
          tweetType = 'textSquare';
          elem.parent().append('<div class="sponsor packery-tile">SPONSOR LOGO</div>');
          LayoutCounter.incrNumSquare();
          break;
        default:
          tweetType = 'textWide';
          LayoutCounter.incrNumWide();
      }
    } else {
      var randomNum = Math.floor(Math.random()*3);
      switch(randomNum) {
        case 1:
          tweetType = 'textTall';
          LayoutCounter.incrNumTall();
          break;
        case 2:
          tweetType = 'textWide';
          LayoutCounter.incrNumWide();
          break;
        default:
          tweetType = 'textSquare';
          elem.parent().append('<div class="sponsor packery-tile">SPONSOR LOGO</div>');
          LayoutCounter.incrNumSquare();
      }
    }
    // else if (numTall % 2 === 1 && (numTall + numWide) % 2 === 0 && scope.$index === 10) {
    //   console.log("Tall odd and large even so adding tall");
    //   tweetType = 'textTall';
    //   LayoutCounter.incrNumTall();
    // } else if ((numTall + numWide) % 2 === 1 && scope.$index === 11) {
    //   console.log("Num of tall + wide is odd so adding wide");
    //   tweetType = 'textWide';
    //   LayoutCounter.incrNumWide();
    // } else if (scope.$index === 11 && (numWide + numTall) % 2 === 1) {
    //   // probably change this to adding a square and removing check for modulus 2
    //   var randomNum = Math.floor(Math.random()*2);
    //   switch(randomNum) {
    //     case 1:
    //       // tweetType = 'textWide';
    //       // LayoutCounter.incrNumWide();
    //       tweetType = 'textTall';
    //       LayoutCounter.incrNumTall();
    //       break;
    //     default:
    //       // tweetType = 'textTall';
    //       // LayoutCounter.incrNumTall();
    //       tweetType = 'textWide';
    //       LayoutCounter.incrNumWide();
    //   }
    //   // console.log("2");
    // // } else if ((numTall + numWide) % 2 === 1 && totalArea >= 20) {
    // //   tweetType = 'textSquare';
    // //   elem.parent().append('<div class="sponsor packery-tile">SPONSOR LOGO</div>');
    // //   LayoutCounter.incrNumSquare();
    // //   // console.log("3");
    // // } else if (scope.$index >= 10 && numTall % 2 === 1) {
    // //   tweetType = 'textSquare';
    // //   elem.parent().append('<div class="sponsor packery-tile">SPONSOR LOGO</div>');
    // //   LayoutCounter.incrNumSquare();
    // //   // console.log(scope.$index);
    // } else if (numTall < 10 && numWide < 10) {
    //   var randomNum = Math.floor(Math.random()*2);
    //   switch(randomNum) {
    //     case 1:
    //       tweetType = 'textTall';
    //       LayoutCounter.incrNumTall();
    //       break;
    //     case 2:
    //       tweetType = 'textWide';
    //       LayoutCounter.incrNumWide();
    //       break;
    //     default:
    //       tweetType = 'textSquare';
    //       elem.parent().append('<div class="sponsor packery-tile">SPONSOR LOGO</div>');
    //       LayoutCounter.incrNumSquare();
    //   }
    //   // console.log("4");
    // } else {
    //   tweetType = 'textSquare';
    //   elem.parent().append('<div class="sponsor packery-tile">SPONSOR LOGO</div>');
    //   LayoutCounter.incrNumSquare();
    //   // console.log("5");
    // }

    // console.log("Added a: " + tweetType + " and now the total area is: " + totalArea);

    var loader = getTemplate(tweetType);
    var promise = loader.success(function(html) {
      elem.html(html);
    }).then(function (response) {
      $compile(elem.contents())(scope)
      CleanTweets.updateTemplateList(scope.$index, tweetType);
    });

    totalArea = LayoutCounter.getTotalArea();

    // if (scope.$last) {
    //   if (totalArea < 24) {
    //     for (var i = 1; i <= 24 - totalArea; i++) {
    //       // console.log("I would add a sponsor");
    //       elem.parent().append('<div class="sponsor packery-tile">SPONSOR LOGO</div>');
    //     }
    //     // var packery = Packery.get();
    //     // packery.reloadItems();
    //     // packery.layout();
    //   }
    // }s

  }
  return {
    restrict: "E",
    link: linker
  }
}]);

twitterWallDirectives.directive('grid', ['Blocks', '$q', function(Blocks, $q) {
  var linker = function(scope, elem, attrs) {
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
      console.log(templateLoader);
      return templateLoader;
    }

    var Packer = function(w, h) {
      this.w = w;
      this.h = h;
      this.init(w, h);
    };
    Packer.prototype = {

      init: function(w, h) {
        this.root = { x: 0, y: 0, w: w, h: h };
      },

      fit: function(blocks) {
        var n, node, block;
        for (n = 0; n < blocks.length; n++) {
          block = blocks[n];
          if (node = this.findNode(this.root, block.w, block.h))
            block.fit = this.splitNode(node, block.w, block.h);
        }
      },

      findNode: function(root, w, h) {
        if (root.used)
          return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
        else if ((w <= root.w) && (h <= root.h))
          return root;
        else
          return null;
      },

      splitNode: function(node, w, h) {
        node.used = true;
        node.down  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h };
        node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h          };
        return node;
      }
    }
    var packer = new Packer(1200, 800);
    var dimensions = { w: packer.w, h: packer.h };
    Blocks.get(dimensions).then(function(blocks) {
      packer.fit(blocks);

      var fit = 0
      var fitArea = 0
      for(var n = 0 ; n < blocks.length ; n++) {
        var block = blocks[n];
        if (block.fit) {
          fit ++;
          fitArea = fitArea + block.w * block.h;
          var card = document.createElement('div')
          var colors = [ 'green', 'red', 'black', 'blue']

          card.style.position='absolute'
          card.style.left=block.fit.x+'px'
          card.style.top=block.fit.y+'px'
          card.style.width=block.w+'px'
          card.style.height=block.h+'px'
          
          card.style.backgroundColor=colors[Math.floor(Math.random() * colors.length)]
          card.style.color = 'white'
          // card.innerHTML = getTemplate(block.style);
          card.innerHTML = block.style;
          elem.append(card)

          // Draw(block.fit.x, block.fit.y, block.w, block.h);
        }
      }  
      console.log(Math.round(100 * fitArea / (1200 * 800)));
    });
    
  }

  return {
    restrict: "A",
    link: linker
  }
}]);

twitterWallDirectives.directive('photoCard', ['$compile', 'CleanLayout', function($compile, CleanLayout) {
  var linker = function(scope, elem, attrs) {
    elem.addClass(randomColor());
    elem.ready(function() {
      CleanLayout.incrNumWide();
    });
    elem.on("$destroy", function() {
      CleanLayout.decrNumWide();
    });
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('textCardSquare', ['$compile', 'CleanLayout', function($compile, CleanLayout) {
  var linker = function(scope, elem, attrs) {
    elem.addClass(randomColor());
    elem.ready(function() {
      CleanLayout.incrNumSquare();
    });
    elem.on("$destroy", function() {
      CleanLayout.decrNumSquare();
    });
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('textCardWide', ['$compile', 'CleanLayout', function($compile, CleanLayout) {
  var linker = function(scope, elem, attrs) {
    elem.addClass(randomColor());
    elem.ready(function() {
      CleanLayout.incrNumWide();
    });
    elem.on("$destroy", function() {
      CleanLayout.decrNumWide();
    });
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('textCardTall', ['$compile', 'CleanLayout', function($compile, CleanLayout) {
  var linker = function(scope, elem, attrs) {
    elem.addClass(randomColor());
    elem.ready(function() {
      CleanLayout.incrNumTall();
    });
    elem.on("$destroy", function() {
      CleanLayout.decrNumTall();
    });
  }
  return {
    restrict: "C",
    link: linker
  }
}]);

twitterWallDirectives.directive('sponsorCard', ['$compile', 'CleanLayout', function($compile, CleanLayout) {
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