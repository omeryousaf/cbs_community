var controller = angular.module('adminPanel',[]);
controller.controller('admin', ['ConfigService', '$scope', '$http', 'Upload', '$routeParams',
    function(ConfigService, $scope, $http, Upload, $routeParams){
        $scope.serverIp = ConfigService.serverIp;
        $http.get( ConfigService.serverIp + '/members' ).success( function ( result ) {
            $scope.members = result.members;
            console.log(result.members);
        }).error(function (err) {
            console.log('\nerror: ', err, '\n');
            alert(err.error.message);
        });
}]);