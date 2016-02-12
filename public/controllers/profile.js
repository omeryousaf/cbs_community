/**
 * Created by shujaatali on 01/02/16.
 */
var controller = angular.module('profileController',[]);
controller.controller('Profile', ['ConfigService', '$scope', '$http', 'Upload', '$routeParams',
    function (ConfigService, $scope, $http, Upload, $routeParams) {
        tinymce.init({
            selector: "#new-post",
            plugins: [
                "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
                "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
            ],

            toolbar1: "fontselect fontsizeselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify",
            toolbar2: "bullist numlist | outdent indent | link image media | hr removeformat | subscript superscript | emoticons | fullscreen",

            menubar: false,
            toolbar_items_size: 'small',

            templates: [
                {title: 'Test template 1', content: 'Test 1'},
                {title: 'Test template 2', content: 'Test 2'}
            ]
        });

        $scope.preview = ""; // initialising value of a label in the view to empty string so it does not show at start
        $http.get( ConfigService.serverIp + '/getMember/' + $routeParams.id ).success( function ( member ) {
            if ( member.doc.currentImage ) {
                $scope.image = ConfigService.couchIp + '/members/' + $routeParams.id  + '/' + member.doc.currentImage;
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
    }
]);


