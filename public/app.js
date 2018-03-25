/**
 * Created by omeryousaf on 16/03/15.
 */
var baghiansfromtheheart = angular.module('baghiansfromtheheart', [
    'ngRoute',
    'loginSignupController',
    'profileController',
    'membersController',
    'directives',
    'ngFileUpload'
]);

// define configurations here
baghiansfromtheheart.factory('ConfigService', ['$location',
    function($location) {
        return {
            serverIp : $location.protocol() + "://" + $location.host()  + ':' + $location.port(),
            topNavActiveTab: {
                myProfile: 'myProfile',
                directory: 'directory'
            }
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
