/**
 * Created by omeryousaf on 16/03/15.
 */
var baghiansfromtheheart = angular.module('baghiansfromtheheart', [
    'ngRoute',
    'loginSignupController',
    'profileController',
    'ngFileUpload'
]);

// define configurations here
baghiansfromtheheart.factory('ConfigService', [
    function() {
        return {
            serverIp : 'http://localhost:3000',
            couchIp : 'http://127.0.0.1:5984'
        };
    }
]);

baghiansfromtheheart.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'views/login.html' //The controller for handling this route is mentioned in the ng-controller directive in the html file
            }).
            when('/signup', {
                templateUrl: 'views/signup.html'
            }).
            when('/profile/:id', {
                templateUrl: 'views/profile.html'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);