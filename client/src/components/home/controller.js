'use strict';


//Component modules



import angular from 'angular';

const m = angular.module('testProject.controller', []);

m.controller('HomeCtrl', ['$scope', function($scope) {
        $scope.controller1 = 'This is controller content!';
    }
]);