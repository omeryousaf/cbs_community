/**
 * Created by omeryousaf on 06/02/16.
 */
var controller = angular.module('membersController',[]);
controller.controller('Members', ['ConfigService', 'UtilityFunctions', '$scope', '$http', 'Upload', '$routeParams',
    function (ConfigService, UtilityFunctions, $scope, $http, Upload, $routeParams) {

        $scope.serverIp = ConfigService.serverIp;
        $http.get( ConfigService.serverIp + '/members' ).then( function ( result ) {
            $scope.members = result.data.members;
        }).catch(function (err) {
            console.log('\nerror: ', err, '\n');
            alert(err && err.error && err.error.message || 'An error occurred!');
        });

        $scope.visitMemberProfile = function ( member ) {
            UtilityFunctions.visitMemberProfile( member );
        }
    }
]);