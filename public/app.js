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
baghiansfromtheheart.factory('ConfigService', ['$location',
    function($location) {
        return {
            serverIp : $location.protocol() + "://" + $location.host()  + ':' + $location.port(),
            topNavActiveTab: {
                myProfile: 'myProfile',
                directory: 'directory'
            },
            httpStatuses: {
                OK: 200,
                SESSION_EXPIRED: 419
            }
        };
    }
]).factory('sessionHandler', ['$location', '$q', 'ConfigService', function($location, $q, ConfigService) {
    return {
        responseError: function(response) {
            if (response.status == ConfigService.httpStatuses.SESSION_EXPIRED) {
                // prompt user to reauthenticate
                alert('Your session has expired with the server. Please relogin to proceed!');
                $location.path('/login');
            }
            return $q.reject(response);
        }
    };
}]);

baghiansfromtheheart.config(['$routeProvider', '$httpProvider',
    function($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('sessionHandler');
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
