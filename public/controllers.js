/**
 * Created by omeryousaf on 16/03/15.
 */
var memberControllers = angular.module('memberControllers', []);

memberControllers.controller('Login', ['$scope', '$http',
    function ($scope, $http) {
        //$http.get('phones/phones.json').success(function(data) {
        //    $scope.phones = data;
        //});

        $scope.username = '';
        $scope.password = '';

        $scope.saveMember = function () {
            var url = 'http://localhost:3000/getMembers';
            $http.get(url).success(function(response) {
                console.log("success");
                console.log(response);
                $scope.username = 'Wowww!!!';
            });
        };
    }
]);