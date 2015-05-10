'use strict';

// Load component modules
//import './components/user';

import angular from 'angular';

const m = angular.module('myProject', [
    'ui.router', // I'm serving this from a CDN
    'mgcrea.ngStrap'
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
        })
        .state('about', {
            url: '/about',
            views: {
                'main@': {
                    templateUrl: 'components/about/about.html'
                }
            }
        })
        .state('contact', {
            url: '/contact',
            views: {
                'main@': {
                    templateUrl: 'components/contact/contact.html'
                }
            }
        });
}]);
