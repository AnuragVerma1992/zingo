'use strict';

/**
 * @ngdoc overview
 * @name anurajProjectsApp
 * @description
 * # anurajProjectsApp
 *
 * Main module of the application.
 */
angular
  .module('anurajProjectsApp', [
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'angularTypewrite',
    'angularProgressbar',
    'timer'

  ])
  .config(function ($routeProvider, $locationProvider) {

    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login',
         publicAccess: true
      })
      .when('/game', {

        templateUrl: 'views/game.html',
        controller: 'GameCtrl',
        controllerAs: 'game',



      })
      .when('/zingoappadmin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin'
      })
      .otherwise({
        redirectTo: '/login'
      });

  })
  // .run(function ($rootScope, $location, $route) {

  //   var routesOpenToPublic = [];
  //   angular.forEach($route.routes, function (route, path) {
  //     // push route onto routesOpenToPublic if it has a truthy publicAccess value
  //     route.publicAccess && (routesOpenToPublic.push(path));
  //   });

  //   $rootScope.$on('$routeChangeStart', function (event, nextLoc, currentLoc) {
  //     var closedToPublic = (-1 === routesOpenToPublic.indexOf($location.path()));
  //     if (closedToPublic && !user.isLoggedIn()) {
  //       $location.path('/login');
  //     }
  //   });
  // })