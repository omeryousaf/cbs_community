/**
 * Created by omeryousaf on 16/03/15.
 */
var baghiansfromtheheart = angular.module('baghiansfromtheheart', [
    'ngRoute',
    'ui.router',
    'loginSignupController',
    'profileController',
    'membersController',
    'customDirectives',
    'ngFileUpload',
    'navigationComponent'
]);


// define configurations here
baghiansfromtheheart.factory('ConfigService', ['$location',
    function($location) {
        let userId = '';
        return {
            serverIp : $location.protocol() + "://" + $location.host()  + ':' + $location.port(),
            httpStatuses: {
                OK: 200,
                SESSION_EXPIRED: 419
            },
            setInSessionUserId: function(id) {
                userId = id;
            },
            getInSessionUserId: function() {
                return userId;
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

baghiansfromtheheart.config(['$httpProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider',
    function($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
        $httpProvider.interceptors.push('sessionHandler');
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'views/signup.html'
            })
            .state('profile', {
                url: '/profile/:id',
                templateUrl: 'views/profile.html'
            })
            .state('members', {
                url: '/members',
                templateUrl: 'views/members.html'
            })
            .state('resetPassword', {
                url: '/resetPassword/:id',
                templateUrl: 'views/resetpassword.html'
            });
        $locationProvider.html5Mode(true);
    }
]);
