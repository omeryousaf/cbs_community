/**
 * Created by omeryousaf on 16/03/15.
 */
var memberControllers = angular.module('memberControllers', []);

memberControllers.controller('Login', ['$scope', '$http',
    function ($scope, $http) {
        $scope.username = '';
        $scope.password = '';

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