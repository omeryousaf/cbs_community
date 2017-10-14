/**
 * Created by shujaatali on 01/02/16.
 */
var controller = angular.module('profileController',['ui.bootstrap']);
controller.controller('Profile', ['ConfigService', '$scope', '$http', 'Upload', '$routeParams', '$uibModal',
    function (ConfigService, $scope, $http, Upload, $routeParams, $uibModal) {

        $scope.layout = {
            name: "layout.html",
            url: "views/layout.html"
        };

        var editModal, photoToEdit;
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

            var imageTransformData = $( photoToEdit ).data('cropper').getData();
            var infoForImageMagic = prepareImageTransformDataForBackend( photoToEdit, imageTransformData.scaleX );
            imageTransformData.x = imageTransformData.x - infoForImageMagic.offset.x;
            imageTransformData.y = imageTransformData.y - infoForImageMagic.offset.y;
            imageTransformData.scaleToWidth = infoForImageMagic.scaleToWidth;
            imageTransformData.scaleToHeight = infoForImageMagic.scaleToHeight;

            var url = ConfigService.serverIp + '/upload-profile-image';
            return Upload.upload({
                url: url,
                fields: {
                    memberId: $routeParams.id,
                    filename: $scope.filename,
                    imageTransformData: imageTransformData,
                    file: $scope.files[0]
                }
            }).success(function(response) {
                $scope.image = $scope.imageBackupPath = response.filePath + '?' + new Date().valueOf();
                $scope.preview = ""; // is this var redundant now ? if yes, remove it from everywhere in this file
                destroyCropPanel();
            }).error(function (err) {
                alert('error occurred while uploading image: ' + err);
                console.log( '\n', err, '\n');
            });
        };

        var destroyCropPanel = function () {
            editModal.dismiss('canceled');
        };

        $scope.cancelCrop = function () {
            destroyCropPanel();
        };

        $scope.rotateImage = function ( direction ) {
            if ( direction == 'L' ) {
                rotateImage( photoToEdit, -90 );
            }
            if ( direction == 'R' ) {
                rotateImage( photoToEdit, 90 );
            }
        };

        var prepareImageTransformDataForBackend = function ( photo, scalingFactor ) {
            // save the width and height to scale the image to (needed by imagemagick at backend), and also save x,y of top left corner of scaled image which
            // will act as offsets to be subtracted from top_left corner of to-be-cropped area in order to take imagemagick to correct starting point for cropping
            var imageInfoForImageMagic = {
                offset: {}
            };
            var updateCanvas = $( photo ).data('cropper').getCanvasData();
            var implicitScalingFactor = updateCanvas.height / updateCanvas.naturalHeight;
            var reductionInWidthByScaling = ( 1 - scalingFactor ) * updateCanvas.width;
            imageInfoForImageMagic.offset.x = reductionInWidthByScaling / ( 2 * implicitScalingFactor );
            if ( updateCanvas.top < 0 ) {
                imageInfoForImageMagic.offset.y = Math.abs( updateCanvas.top ) / implicitScalingFactor;
            } else {
                imageInfoForImageMagic.offset.y = 0;
            }
            imageInfoForImageMagic.scaleToWidth = scalingFactor * updateCanvas.width / implicitScalingFactor;
            imageInfoForImageMagic.scaleToHeight = scalingFactor * updateCanvas.height / implicitScalingFactor;
            return imageInfoForImageMagic;
        };

        var scaleImage = function ( photo, scalingFactor, updatedCropBox ) {
            if ( scalingFactor < 1 ) { // when canvas height is greater than the photo container height, scale (on both x and y
                // axes to maintain aspect ratio and) to make canvas height fit container height
                $( photo ).data('cropper').scale( scalingFactor, scalingFactor );
            } else { // when canvas height is NOT greater than container height but image is already scaled, revert the scaling cuz the current rotation will bring
                // the image back to its original orientation (landscape/portrait)
                scalingFactor = 1 / $( photo ).data('cropper').getData().scaleX;
                $( photo ).data('cropper').scale( 1, 1 );
            }
            var updateCanvas = $( photo ).data('cropper').getCanvasData();
            updateCanvas.mid = {
                x: ( 2 * updateCanvas.left + updateCanvas.width ) / 2,
                y: ( 2 * updateCanvas.top + updateCanvas.height ) / 2
            };
            var translationCoeffForScalingX = scalingFactor * (-1 * updateCanvas.mid.x ) + updateCanvas.mid.x;
            var translationCoeffForScalingY = scalingFactor * (-1 * updateCanvas.mid.y ) + updateCanvas.mid.y;
            updatedCropBox.left = scalingFactor * updatedCropBox.left + translationCoeffForScalingX;
            updatedCropBox.top = scalingFactor * updatedCropBox.top + translationCoeffForScalingY;
            updatedCropBox.width *= scalingFactor;
            updatedCropBox.height *= scalingFactor;
            $( photo ).data('cropper').setCropBoxData( updatedCropBox );
        };

        var rotateImage = function ( photo, angle ){
            var cropBoxArea = $( photo ).data('cropper').getCropBoxData();
            var angleInRadians = angle * (Math.PI / 180);
            var cosOfAngle =  Math.cos( angleInRadians );
            var sinOfAngle = Math.sin( angleInRadians );
            var canvasData = $( photo ).data('cropper').getCanvasData();
            var canvasCenter = {
                x: canvasData.left + canvasData.width / 2,
                y: canvasData.top + canvasData.height / 2
            };
            var translationCoeffX = cosOfAngle * (-1 * canvasCenter.x) - sinOfAngle * (-1 * canvasCenter.y) + canvasCenter.x;
            var translationCoeffY = sinOfAngle * (-1 * canvasCenter.x) + cosOfAngle * (-1 * canvasCenter.y) + canvasCenter.y;
            var cropboxTopLeftX = cosOfAngle * cropBoxArea.left - sinOfAngle * cropBoxArea.top + translationCoeffX;
            var cropboxTopLeftY = sinOfAngle * cropBoxArea.left + cosOfAngle * cropBoxArea.top + translationCoeffY;
            if ( angle > 0 ) {
                cropboxTopLeftX -= cropBoxArea.height;
            }
            if ( angle < 0 ) {
                cropboxTopLeftY -= cropBoxArea.width;
            }
            var updatedCropBox = {
                left: cropboxTopLeftX,
                top: cropboxTopLeftY,
                width: cropBoxArea.height,
                height: cropBoxArea.width
            };
            $( photo ).data('cropper').rotate( angle );
            $( photo ).data('cropper').setCropBoxData( updatedCropBox );
            // handle scaling now if scaling is needed to fit image in container after rotation
            var containerHeightFactor = $(".js_image_upload").height() / $( photo ).data('cropper').getCanvasData().height;
            scaleImage( photo, containerHeightFactor, updatedCropBox );
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
                    editModal = $uibModal.open({
                        templateUrl: 'displayPicEditModal.html',
                        scope: $scope,
                        windowClass: 'photo-edit-modal'
                    });
                    editModal.rendered.then(function () {
                        photoToEdit = $( '#js_profile_pic' );
                        photoToEdit.attr('src', e.target.result);
                        if ( photoToEdit.length != 0 ) {
                            $( photoToEdit ).cropper({
                                aspectRatio: 1,
                                rotatable: true,
                                zoomable: false,
                                background: false,
                                guides: false,
                                autoCropArea: 1,
                                checkOrientation: false,
                                checkCrossOrigin: false,
                                movable: false,
                                toggleDragModeOnDblclick: false,
                                crop: function(e) {},
                                built: function() {}
                            });
                        }
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


