/**
 * Created by omeryousaf on 06/02/16.
 */
var controller = angular.module('membersController',[]);
controller.controller('Members', ['ConfigService', '$scope', '$http', 'Upload', '$routeParams',
    function (ConfigService, $scope, $http, Upload, $routeParams) {
        $scope.serverIp = ConfigService.serverIp;
        $http.get( ConfigService.serverIp + '/members' ).success( function ( result ) {
            $scope.members = result.members;
        }).error(function (err) {
            console.log('\nerror: ', err, '\n');
        });
    }
]);