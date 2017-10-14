/**
 * Created by omeryousaf on 06/02/16.
 */
var controller = angular.module('membersController',[]);
controller.controller('Members', ['ConfigService', 'UtilityFunctions', '$scope', '$http', 'Upload', '$routeParams',
    function (ConfigService, UtilityFunctions, $scope, $http, Upload, $routeParams) {

        $scope.layout = {
            name: "layout.html",
            url: "views/layout.html"
        };
        $scope.serverIp = ConfigService.serverIp;
        $http.get( ConfigService.serverIp + '/members' ).success( function ( result ) {
            $scope.members = result.members;
        }).error(function (err) {
            console.log('\nerror: ', err, '\n');
            alert(err.error.message);
        });

        $scope.visitMemberProfile = function ( member ) {
            UtilityFunctions.visitMemberProfile( member );
        }
    }
]);