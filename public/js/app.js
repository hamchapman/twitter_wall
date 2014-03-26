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
          controller: 'AdminCtrl'
        })
        .state('admin', {
          url: '/admin',
          templateUrl: '/views/admin.html',
          controller: 'ViewerCtrl'
        })
        .state('settings', {
          url: '/settings',
          templateUrl: '/views/settings.html',
          controller: 'SettingsCtrl'
        });

      $urlRouterProvider.otherwise('/');
    }
  ])