'use strict';

// Load component modules
//import './components/user';

import angular from 'angular';

const m = angular.module('myProject', [
    'ui.router' // I'm serving this from a CDN
]);

m.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', ($stateProvider, $locationProvider, $urlRouterProvider) => {

    $locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            views: {
                'main@': {
                    templateUrl: 'components/home/home.html'
                }
            }
        });
}]);
