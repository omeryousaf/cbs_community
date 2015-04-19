/**
 * Created by omeryousaf on 16/03/15.
 */
var memberControllers = angular.module('memberControllers', []);

// get the UI to ensure filling of mandatory fields before calling the backend
// check username availability in an ajax way, i-e on blur of the username field if it has a value
memberControllers.controller('Signup', ['ConfigService', '$scope', '$http',
    function (ConfigService, $scope, $http) {
        $scope.name = '';
        $scope.email = '';
        $scope.phone = '';
        $scope.yearOfJoining = '';
        $scope.boardingHouse = '';
        $scope.username = '';
        $scope.password = '';

        $scope.init = function () {
            // generate the list of years to choose year of joining from
            var start = 1998;
            $scope.years = [];
            var currentYear = new Date().getFullYear();
            for (var i = currentYear; i > (start-1); i--) {
                $scope.years.push(i);
            }
            // initialize array for boarding house selection
            $scope.boardingHouseNames = ['A.J', 'Saigol', 'Sanobar', 'Mehran', 'Abaseen'];
        };
        $scope.init();

        $scope.register = function () {
            // check username availability through ajax and finally save new member record
            // call a view of couchdb that tells if the current username is available i-e not in use by anyone already
            var url = ConfigService.serverIp + '/isUsernameUnique';
            console.log('username for signup: ' + $scope.username);
            $http.post(url, {username: $scope.username}).success(function(response) {
                if (response.isUnique === true) {
                    alert('username is unique. congratulations!');
                } else {
                    alert('username must be unique, pleae try again.');
                }
            }).error(function (err) {
                alert('error occurred while checking availablity of username: ' + $scope.username);
            });
        };
    }
]);

memberControllers.controller('Login', ['ConfigService', '$scope', '$http',
    function (ConfigService, $scope, $http) {
        $scope.username = '';
        $scope.password = '';

        $scope.navigateToMemberProfileForm = function () {
            var url = $location.url();
            url('/complete-profile');
        };
        $scope.saveMember = function () {
            var url = ConfigService.serverIp + '/getMembers';
            console.log("credentials: " + $scope.username + ' ' + $scope.password);
            $http.post(url, {username: $scope.username, password: $scope.password}).success(function(response) {
                console.log("login successful, username: " + response.member.username);
            }).error(function (err) {
                console.log("login failed, reason: " + err.reason);
            });
        };
    }
]);