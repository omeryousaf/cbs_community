/**
 * Created by omeryousaf on 16/03/15.
 */
var baghiansfromtheheart = angular.module('baghiansfromtheheart', [
    'ngRoute',
    'loginSignupController',
    'profileController',
    'membersController',
    'customDirectives',
    'ngFileUpload'
]);

// define configurations here
baghiansfromtheheart.factory('ConfigService', ['$location', '$http',
    function($location, $http) {
        return {
            serverIp : $location.protocol() + "://" + $location.host()  + ':' + $location.port(),
            topNavActiveTab: {
                myProfile: 'myProfile',
                directory: 'directory'
            },
            isLoggedIn: function() {
                return $http.get(this.serverIp + '/isLoggedIn').error(function(err) {
                    $location.path('/login');
                });
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
                templateUrl: 'views/profile.html',
                resolve: {
                    isLoggedIn: function(ConfigService) {
                       return ConfigService.isLoggedIn();
                    }
                }
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
