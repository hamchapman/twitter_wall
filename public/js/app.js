angular.module('twitterWall', [
  'twitterWallControllers',
  'twitterWallServices',
  'doowb.angular-pusher',
  'ngUpload',
  'ngAnimate',
  'ngTouch', 
  'ngRoute'
  ])
  .config(['PusherServiceProvider', 
    '$routeProvider', 
    '$httpProvider',
    function(PusherServiceProvider, $routeProvider, $locationProvider) {
      PusherServiceProvider
        .setToken('15d9668cc510aed91e23')
        .setOptions({});
      $routeProvider
        .when('/admin', {
          templateUrl: '/views/admin.html',
          controller: 'AdminCtrl'
        })
        .when('/clean', {
          templateUrl: '/views/clean.html',
          controller: 'ViewerCtrl'
        })
        .when('/', {
          templateUrl: '/views/admin.html',
          controller: 'AdminCtrl'
        })
        .when('/settings', {
          templateUrl: '/views/settings.html',
          controller: 'SettingsCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  ])