/**
 * Created by shujaatali on 01/02/16.
 */
var controller = angular.module('profileController',[]);
controller.controller('Profile', ['ConfigService', '$scope', '$http', 'Upload', '$routeParams',
    function (ConfigService, $scope, $http, Upload, $routeParams) {

        var cropHandle;
        $scope.showProfileImage = true;
        $scope.preview = ""; // initialising value of a label in the view to empty string so it does not show at start
        $http.get( ConfigService.serverIp + '/getMember/' + $routeParams.id ).success( function ( member ) {
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
                    cropHandle.croppie('destroy');
                    $scope.showProfileImage = true;
                }).error(function (err) {
                    alert('error occurred while uploading image: ' + err);
                    console.log( '\n', err, '\n');
                });
            }).catch( function ( error) {
                console.log( '\n', error, '\n');
            });
        };

        $scope.cancelCrop = function () {
            cropHandle.croppie('destroy');
            $scope.showProfileImage = true;
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
                    // hide existing profile image and open newly uploaded one in crop-edit mode
                    $scope.showProfileImage = false;
                    if( cropHandle) {
                        cropHandle.croppie('destroy');
                    }
                    cropHandle = $('.image-upload').croppie({
                        url: e.target.result,
                        viewport: {
                            width: 200,
                            height: 200
                        }
                    });
                    $scope.$apply();// without this ng-show in profile.html were not taking effect properly when their values were changed
                };
                reader.readAsDataURL( files[0]);
            }
        }
    }
]);