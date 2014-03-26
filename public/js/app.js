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
    '$locationProvider',
    '$stateProvider',
    '$urlRouterProvider',
    function(PusherServiceProvider, 
             $locationProvider, 
             $stateProvider, 
             $urlRouterProvider) 
    {
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
        .state('admin.mirror', {
          url: '/mirror',
          templateUrl: '/views/partials/mirror.html',
          controller: 'MirrorCtrl'
        })
        .state('admin.queries', {
          url: '/queries',
          templateUrl: '/views/partials/queries.html',
          controller: 'QueryCtrl'
        });
      $urlRouterProvider.otherwise('/');
    }
  ])