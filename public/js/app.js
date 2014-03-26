angular.module('twitterWall', [
  'twitterWallControllers',
  'twitterWallServices',
  'doowb.angular-pusher',
  'ui.router',
  'ngUpload',
  'ngAnimate',
  'ngTouch', 
  ])
  .config(['PusherServiceProvider', 
    '$stateProvider',
    '$urlRouterProvider',
    function(PusherServiceProvider, $stateProvider, $urlRouterProvider) {
      PusherServiceProvider
        .setToken('15d9668cc510aed91e23')
        .setOptions({});
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/views/clean.html',
          controller: 'ViewerCtrl'
        })
        .state('admin', {
          url: '/admin',
          templateUrl: '/views/admin.html',
          controller: 'AdminCtrl'
        })
        .state('admin.config', {
          url: '/config',
          templateUrl: '/views/partials/config.html',
          controller: 'ConfigCtrl'
        })
        .state('admin.style', {
          url: '/style',
          templateUrl: '/views/partials/style.html',
          controller: 'StyleCtrl'
        })
        .state('admin.moderate', {
          url: '/moderate',
          templateUrl: '/views/partials/moderate.html',
          controller: 'ModerateCtrl'
        })
        .state('admin.queries', {
          url: '/queries',
          templateUrl: '/views/partials/queries.html',
          controller: 'QueryCtrl'
        });
      $urlRouterProvider.otherwise('/');
    }
  ])