/**
 * Created by omeryousaf on 16/03/15.
 */
var baghiansfromtheheart = angular.module('baghiansfromtheheart', [
    'ngRoute',
    'memberControllers'
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
            when('/complete-profile', {
                templateUrl: 'views/member-profile-form.html',
                controller: 'MemberProfile'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
]);