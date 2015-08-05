/**
 * Created by omeryousaf on 16/03/15.
 */
var baghiansfromtheheart = angular.module('baghiansfromtheheart', [
    'ngRoute',
    'memberControllers',
    'ngFileUpload'
]);

// define configurations here
baghiansfromtheheart.factory('ConfigService', [
    function() {
        return {
            serverIp : 'http://localhost:3000'
        };
    }
]);

baghiansfromtheheart.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'views/login.html',
                controller: 'Login'
            }).
            when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'Signup'
            }).
            when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'Profile'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);