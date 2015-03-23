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
            $http.post(url, {username: 'omer', password: 'abd'}).success(function(response) {
                console.log("got response from node.. yay!!");
                console.log(response.member);
                $scope.username = 'Wowww!!!';
            }).error(function (err) {
                console.log(err);
            });
        };
    }
]);