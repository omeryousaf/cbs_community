/**
 * Created by omeryousaf on 16/03/15.
 */
var memberControllers = angular.module('memberControllers', []);

memberControllers.controller('Signup', ['$scope', '$http',
    function ($scope, $http) {
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

        };
    }
]);

memberControllers.controller('Login', ['$scope', '$http',
    function ($scope, $http) {
        $scope.username = '';
        $scope.password = '';

        $scope.navigateToMemberProfileForm = function () {
            var url = $location.url();
            url('/complete-profile');
        };
        $scope.saveMember = function () {
            var url = 'http://localhost:3000/getMembers';
            console.log("credentials: " + $scope.username + ' ' + $scope.password);
            $http.post(url, {username: $scope.username, password: $scope.password}).success(function(response) {
                console.log("login successful, username: " + response.member.username);
            }).error(function (err) {
                console.log("login failed, reason: " + err.reason);
            });
        };
    }
]);

memberControllers.controller('MemberProfile', ['$scope', '$http',
    function ($scope, $http) {
        $scope.name = '';
        $scope.email = '';
        $scope.yearOfJoining = '';
        $scope.boardingHouse = '';
        $scope.username = '';
        $scope.password = '';

        $scope.validateAndSave = function () {

        };
    }
]);