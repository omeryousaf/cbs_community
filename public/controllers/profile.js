/**
 * Created by shujaatali on 01/02/16.
 */
var controller = angular.module('profileController',['ui.bootstrap']);
controller.controller('Profile', ['ConfigService', '$scope', '$http', 'Upload', '$routeParams', '$uibModal',
    function (ConfigService, $scope, $http, Upload, $routeParams, $uibModal) {

        var cropHandle, editModal;
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

        $http.get( ConfigService.serverIp + '/getMember/' + $routeParams.id ).success( function ( member ) {
            $scope.canEdit=member.doc.canEdit;
            if(member.doc.work){
                $scope.work=member.doc.work;
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
            if(member.doc.education){
                $scope.education = member.doc.education;
            }
            else{
                $scope.education = "No education defined!";
            }
            if(member.doc.isAdmin){
                $scope.isAdmin = member.doc.isAdmin;
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

        $scope.confirmCrop = function () {
            return cropHandle.croppie('result', {
                type: 'canvas',
                size: 'viewport',
                format: 'jpeg'|'png'|'webp'
            }).then( function ( result) {
                var url = ConfigService.serverIp + '/upload-profile-image';
                Upload.upload({
                    url: url,
                    fields: {
                        memberId: $routeParams.id,
                        filename: $scope.filename,
                        encodedImage: result
                    }
                }).success(function(response) {
                    $scope.image = $scope.imageBackupPath = response.filePath + '?' + new Date().valueOf();
                    $scope.preview = ""; // is this var redundant now ? if yes, remove it from everywhere in this file
                    console.log('image uploaded successfully! response from server: ', response.serverResponse);
                    destroyCropPanel();
                }).error(function (err) {
                    alert('error occurred while uploading image: ' + err);
                    console.log( '\n', err, '\n');
                });
            }).catch( function ( error) {
                console.log( '\n', error, '\n');
            });
        };

        var destroyCropPanel = function () {
            cropHandle.croppie('destroy');
            editModal.dismiss('canceled');
        };

        $scope.cancelCrop = function () {
            destroyCropPanel();
        };

        $scope.onFileSelected = function (files, events) {
            if ( files ){
                $scope.files = files; // for the view to replace the prev value of the ng-model var "files" with its newest value, we must assign the model the new value here
                $scope.preview = "Preview";
                $scope.image = $scope.imageBackupPath;
                // capture name of newly uploaded file
                $scope.filename = files[0].name;
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    // open newly uploaded image in crop-edit panel
                    if( cropHandle) {
                        cropHandle.croppie('destroy');
                    }
                    editModal = $uibModal.open({
                        templateUrl: 'displayPicEditModal.html',
                        scope: $scope
                    });
                    editModal.rendered.then(function () {
                        cropHandle = $('.image-upload').croppie({
                            url: e.target.result,
                            viewport: {
                                width: 200,
                                height: 200
                            }
                        });
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
            $http.put(url,{editedWork: $scope.moreWork, userId : $routeParams.id}).success(function(response){
                $scope.work = [];
                for(var i=0;i<response.value.length;i++){
                    $scope.work.push(response.value[i]);
                }
                $scope.controlBtnMoreWork=0;
            }).error(function(err){
                alert("Could not Complete you request at the moment, Please try again later");
            });
        };
    }
]);


