/**
 * Created by shujaatali on 01/02/16.
 */
var controller = angular.module('profileController',[]);
controller.controller('Profile', ['ConfigService', '$scope', '$http', 'Upload', '$routeParams','$sce',
    function (ConfigService, $scope, $http, Upload, $routeParams, $sce) {

        $scope.tabArray = [
            {name:"Profile","value":1},
            {name:"Education","value":2},
            {name:"Work","value":3},
            {name:"About","value":4}
        ];

        $scope.preview = ""; // initialising value of a label in the view to empty string so it does not show at start

        $http.get( ConfigService.serverIp + '/getMember/' + $routeParams.id ).success( function ( member ) {
            $scope.canEdit=member.doc.canEdit;
            if(member.doc.work){
                $scope.work=member.doc.work;
            }
            else{
                $scope.work = "No work defined!";
            }
            if(member.doc.education){
                $scope.education = member.doc.education;
            }
            else{
                $scope.education = "No education defined!";
            }
            if ( member.doc.currentImage ) {
                $scope.image = ConfigService.serverIp + '/profileimage?docid=' + $routeParams.id + '&picname=' + member.doc.currentImage;
                $scope.imageBackupPath = $scope.image;
            } else {
                $scope.image = "../images/default-profile-3.png";
            }
        }).error(function (err) {
            $scope.image = "../images/default-profile-3.png";
        });


        $scope.onFileSelected = function (files, events) {
            if ( files ){
                $scope.files = files; // for the view to replace the prev value of the ng-model var "files" with its newest value, we must assign the model the new value here
                $scope.preview = "Preview";
                $scope.image = $scope.imageBackupPath;
                console.log("some file uploading...");
                var url = ConfigService.serverIp + '/upload-profile-image';
                Upload.upload({
                    url: url,
                    fields: { 'memberId': $routeParams.id },
                    file: files[0]
                }).success(function(response) {
                    $scope.image = $scope.imageBackupPath = response.filePath;
                    files[0] = "";
                    $scope.preview = "";
                    console.log('image uploaded successfully! response from server: ', response.serverResponse);
                }).error(function (err) {
                    alert('error occurred while checking uploading image: ' + err);
                });
            }
        }

        this.tab=1;

        this.setTab = function(tabSelected){
            this.tab=tabSelected;
        };

        $scope.more_work=""
        $scope.appendWork = function(){

            $scope.more_work=$sce.trustAsHtml($scope.more_work+"<input type='text' class='form-control'>"+"</br>");
        }
    }
]);


