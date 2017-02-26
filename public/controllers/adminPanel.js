var controller = angular.module('adminPanel',[]);
controller.controller('admin', ['ConfigService', '$scope', '$http', 'Upload', '$routeParams',
    function(ConfigService, $scope, $http, Upload, $routeParams){
        $scope.serverIp = ConfigService.serverIp;
        $http.get( ConfigService.serverIp + '/members' ).success( function ( result ) {
            console.log(result.members)
            $scope.members = result.members;
        }).error(function (err) {
            console.log('\nerror: ', err, '\n');
            alert(err.error.message);
        });
        $scope.banUnban = function(member){
            var url = ConfigService.serverIp + '/updateStatus';
            var memberID = member.id;
            console.log('jane se pahale',status);
            $http.put(url,{blocked: member.doc.isBlocked, userId : memberID}).success(function(response){
                member.doc.isBlocked = response.value;
            }).error(function(err){
                member.doc.isBlocked = false;

                     // alert("Could not Complete you request at the moment, Please try again later");
                });




        }
    }]);