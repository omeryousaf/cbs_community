/**
 * Created by shujaatali on 01/02/16.
 */
import angular from 'angular';

var controller = angular.module('profileController',['ui.bootstrap']);
controller.controller('Profile', ['ConfigService', '$scope', '$http', 'Upload', '$uibModal', '$stateParams',
    function (ConfigService, $scope, $http, Upload, $uibModal, $stateParams) {

        $scope.tabArray = [
            {name:"Profile","value":1},
            {name:"Education","value":2},
            {name:"Work","value":3},
            {name:"About","value":4}
        ];
        $scope.more_work_counter; //counter to add objects containing ids inside moreWork array and add dynamic ids to the more buttons fields
        $scope.moreWork = []; //added the very first id which is 0 at index 0
        $scope.controlBtnMoreWork =0; //used to show hide the plus (more work) button
        $scope.preview = ""; // initialising value of a label in the view to empty string so it does not show at start

        $http.get( ConfigService.serverIp + '/getMember/' + $stateParams.id ).then( function ( response ) {
            let member = response.data.doc;
            $scope.canEdit=member.canEdit;
            if (!!member.canEdit) {
                ConfigService.setInSessionUserId(member._id);
            }
            if(member.work){
                $scope.work=member.work;
                var i;
                for(i=0; i< $scope.work.length; i++){
                    $scope.moreWork.push( {id:i,
                        companyName: $scope.work[i].companyName,
                        designation : $scope.work[i].designation,
                        industry: $scope.work[i].industry,
                        location: $scope.work[i].location
                                    });

                }
                $scope.more_work_counter = $scope.work.length-1;

            }
            else{
                $scope.work = [
                    {
                        companyName:"No Company defined",
                        designation:"No Designation Defined",
                        industry:"No Industry Defined",
                        location:"No Location defined"
                    }
                ];
                $scope.more_work_counter = 0;
            }
            if(member.education){
                $scope.education = member.education;
            }
            else{
                $scope.education = "No education defined!";
            }
            if ( member.currentImage ) {
                $scope.image = ConfigService.serverIp + '/profileimage?docid=' + member._id + '&picname=' + member.currentImage;
                $scope.imageBackupPath = $scope.image;
            } else {
                $scope.image = "../images/default-profile-3.png";
            }
        }).catch(function (err) {
            $scope.image = "../images/default-profile-3.png";
        });

        $scope.cancelCrop = function () {
            $scope.editModal.dismiss('canceled');
        };

        // listen to image transformation data ready event from the custom 'cropper' directive
        $scope.$on('imgTransformDataReady', function(event, data){
            var transformationData = arguments[1]; // arguments array contains data passed by event source (directive)
            var url = ConfigService.serverIp + '/upload-profile-image';
            return Upload.upload({
                url: url,
                fields: {
                    x: transformationData.x,
                    y: transformationData.y,
                    width: transformationData.width,
                    height: transformationData.height,
                    scaleX: transformationData.scaleX,
                    scaleY: transformationData.scaleY,
                    rotate: transformationData.rotate,
                    scaleToHeight: transformationData.scaleToHeight,
                    scaleToWidth: transformationData.scaleToWidth,
                    file: $scope.files[0]
                }
            }).then(function(response) {
                $scope.isConfirmCropDisabled = false;
                $scope.image = $scope.imageBackupPath = ConfigService.serverIp + response.data.filePath + '?' + new Date().valueOf();
                $scope.preview = ""; // is this var redundant now ? if yes, remove it from everywhere in this file
                $scope.editModal.close('done');
            }).catch(function (err) {
                $scope.isConfirmCropDisabled = false;
                alert('error occurred while uploading image: ' + err);
                console.log( '\n', err, '\n');
            });
        });

        $scope.onFileSelected = function (files, events) {
            if ( files ){
                $scope.files = files; // for the view to replace the prev value of the ng-model var "files" with its newest value, we must assign the model the new value here
                $scope.preview = "Preview";
                $scope.image = $scope.imageBackupPath;
                // capture name of newly uploaded file
                $scope.filename = files[0].name;
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    $scope.uploadPath = e.target.result;
                    $scope.editModal = $uibModal.open({
                        templateUrl: 'displayPicEditModal.html',
                        scope: $scope,
                        windowClass: 'photo-edit-modal'
                    });
                    $scope.editModal.result.then(function(result){
                        // modal closed via resolve (e.g. using .close api)
                    }, function () {
                        // modal closed via rejection (e.g. using .dismiss api)
                    });
                    $scope.editModal.rendered.then(function () {
                        $scope.isPhotoLoaded = true; // our custom 'cropper' directive is already watching this var and gets activated
                    });
                };
                reader.readAsDataURL( files[0]);
            }
        };

        this.tab=1;

        this.setTab = function(tabSelected){
            this.tab=tabSelected;
        };
        $scope.appendWork = function(){
            $scope.more_work_counter++;
            $scope.moreWork.push({
                id:$scope.more_work_counter, //adding a new id for new - button
                companyName: '',
                designation : '',
                industry: '',
                location: ''
            });
        };

        $scope.removeField = function(htmlEelemt){
            var indexInArray = htmlEelemt.item.id; //getting the id of the "-" button from html page and storing in a variable in other words getting the index for $scope.moreWork array
            $scope.moreWork.splice(indexInArray,1);
            //rearranging ids in moreWork array so that index will match up with the ids.
            for(var i=0;i<$scope.moreWork.length;i++){
                $scope.moreWork[i].id=i;
            }
            $scope.more_work_counter=$scope.moreWork.length-1;
        };

        $scope.showMoreWork = function(operation){
            $scope.controlBtnMoreWork= operation;
            if(operation===0){
                $scope.moreWork = [];
                for(var i=0; i< $scope.work.length; i++){
                    $scope.moreWork.push($scope.work[i]);
                }
            }
        };

        $scope.saveProgress = function(){
            var url = ConfigService.serverIp + '/saveProgress';
            $http.put(url, {
                editedWork: $scope.moreWork
            }).then(function(response){
                $scope.work = [];
                for(var i=0;i<response.data.value.length;i++){
                    $scope.work.push(response.data.value[i]);
                }
                $scope.controlBtnMoreWork=0;
            }).catch(function(err){
                alert("Could not Complete you request at the moment, Please try again later");
            });
        };
    }
]);