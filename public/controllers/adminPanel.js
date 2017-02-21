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
        $scope.banUnban = function(elm){
            var url = ConfigService.serverIp + '/updateStatus';
            var memberID = elm.member.id;
            if(elm.member.doc.isBlocked == 1)
            {
                $http.put(url,{blocked: 0, userId : memberID}).success(function(response){
                    console.log(response);
                }).error(function(err){
                    alert("Could not Complete you request at the moment, Please try again later");
                });
            }

            else
            {
                $http.put(url,{blocked: 1, userId : memberID}).success(function(response){
                    console.log(response);
                }).error(function(err){
                    alert("Could not Complete you request at the moment, Please try again later");
                });
            }

        }
    }]);