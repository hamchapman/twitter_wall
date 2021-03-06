angular.module('twitterWall', [
  'twitterWallControllers',
  'twitterWallServices',
  'twitterWallDirectives',
  'ngResource',
  'doowb.angular-pusher',
  'ui.router',
  'ngUpload',
  'ngAnimate',
  'ngTouch',
  'packery'
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
        .setToken(pusherKey)
        .setOptions({});
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/views/clean.html',
          controller: 'ViewerCtrl'
        })
        .state('admin', {
          url: '/admin',
          abstract: 'true',
          templateUrl: '/views/admin.html',
          controller: 'AdminCtrl'
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
        .state('admin.setup', {
          url: '',
          templateUrl: '/views/partials/setup.html',
          controller: 'SetupCtrl'
        });
      $urlRouterProvider.otherwise('/');
    }
  ])