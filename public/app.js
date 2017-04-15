/**
 * Created by omeryousaf on 16/03/15.
 */
var baghiansfromtheheart = angular.module('baghiansfromtheheart', [
    'ngRoute',
    'loginSignupController',
    'profileController',
    'membersController',
    'ngFileUpload',
    'ngCookies'
]);

// define configurations here
baghiansfromtheheart.factory('ConfigService', [
    function() {
        return {
            serverIp : 'http://localhost:3000'
        };
    }
]).factory('UserSessionService', [
    '$cookies', function($cookies) {
        return {
            setUserSession: function( userId ) {
                $cookies.put('user_id', userId);
            },
            getUserSession: function() {
                return $cookies.get('user_id');
            },
            clearUserSession: function() {
                $cookies.remove('user_id');
            }
        }
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
            when('/members', {
                templateUrl: 'views/members.html'
            }).
            when('/resetPassword/:id',{
                templateUrl: 'views/resetpassword.html'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);
