/**
 * Created by omeryousaf on 16/03/15.
 */
import "./controllers/login-signup.js";
import "./controllers/profile.js";
import "./controllers/members.js";
import "./directives/cbs-cropper.js";
import "./layout/navigation.component.js";
import "./calendar/calendar.component.js";
import angular from 'angular';

var baghiansfromtheheart = angular.module('baghiansfromtheheart', [
    'ngRoute',
    'ui.router',
    'loginSignupController',
    'profileController',
    'membersController',
    'customDirectives',
    'ngFileUpload',
    'navigationComponent',
    'calendarModule'
]);


// define configurations here
baghiansfromtheheart.factory('UtilityFunctions', [ '$location', 'ConfigService',
    function( $location, ConfigService ) {
        return {
            visitMemberProfile: function ( data ) {
                $location.path('/profile/' + (data._id === ConfigService.getInSessionUserId() ? 'me' : data._id));
            }
        };
    }
]).factory('ConfigService', ['$location',
    function($location) {
        let userId = '';
        return {
            serverIp : $location.protocol() + "://" + $location.host()  + ':' + $location.port(),
            httpStatuses: {
                OK: 200,
                SESSION_EXPIRED: 419,
                LOGOUT: 420
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
            switch (response.status) {
              case ConfigService.httpStatuses.SESSION_EXPIRED:
                // prompt user to reauthenticate
                alert('Your session has expired with the server. Please relogin to proceed!');
                $location.path('/login');
                break;
              case ConfigService.httpStatuses.LOGOUT:
                $location.path('/login');
                break;
              default:
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
            .state('logout', {
                url: '/logout'
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
            })
            .state('calendar', {
                url: '/calendar/:param',
                templateUrl: 'calendar/calendar.html'
            });
        $locationProvider.html5Mode(true); // to get rid of hashbanged (/#/) routing
    }
]);
