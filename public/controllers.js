/**
 * Created by omeryousaf on 16/03/15.
 */
var memberControllers = angular.module('memberControllers', []);

// get the UI to ensure filling of mandatory fields before calling the backend
// check username availability in an ajax way, i-e on blur of the username field if it has a value
memberControllers.controller('Signup', ['ConfigService', '$scope', '$http', '$location',
    function (ConfigService, $scope, $http, $location) {
        $scope.name = '';
        $scope.email = '';
        $scope.phone = '';
        $scope.yearOfJoining = '';
        $scope.boardingHouse = '';
        $scope.username = '';
        $scope.password = '';

        $scope.init = function () {
            // generate the list of years to choose year of joining from
            var start = 1998;
            $scope.years = [];
            var currentYear = new Date().getFullYear();
            for (var i = currentYear; i > (start-1); i--) {
                $scope.years.push(i);
            }
            // initialize array for boarding house selection
            $scope.boardingHouseNames = ['A.J', 'Saigol', 'Sanobar', 'Mehran', 'Abaseen'];
        };
        $scope.init();

        $scope.redirectToLogin = function () {
            $location.path('/login');
        }

        $scope.register = function () {
            // check username availability through ajax and finally save new member record
            // call a view of couchdb that tells if the current username is available i-e not in use by anyone already
            var url = ConfigService.serverIp + '/isUsernameUnique';
            console.log('username for signup: ' + $scope.username);
            var newUser = {
                name: $scope.name,
                email: $scope.email,
                phone: $scope.phone,
                yearOfJoining: $scope.yearOfJoining,
                boardingHouse: $scope.boardingHouse,
                username: $scope.username,
                password: $scope.password
            };
            $http.post(url, {newUser: newUser}).success(function(response) {
                if (response.error) { // some error occurred while running the username uniqueness checking service
                    alert('error code: ' + response.error.code + ',         ' + 'description: ' + response.error.description);
                } else if (response.isUnique === true) { // username input by membership candidate is unique
                    if (response.reason) { // error occurred while persisting membership candidate's signup data
                        alert('username is unique but encountered an error while saving ur signup credentials.');
                    } else { // success. candidate's signup data persisted. candidate is now a member
                        alert('signup successful, congratulations! you will now be routed to the page where you can login with the credentials just created');
                        // redirect to login page
                        $scope.redirectToLogin();
                    }
                } else { // username input by candidate is NOT unique
                    alert('username must be unique, please try again.');
                }
            }).error(function (err) {
                alert('error occurred while checking availablity of username: ' + $scope.username);
            });
        };
    }
]);

memberControllers.controller('Login', ['ConfigService', '$scope', '$http', '$location',
    function (ConfigService, $scope, $http, $location) {
        $scope.username = '';
        $scope.password = '';

        $scope.navigateToMemberProfile = function ( data ) {
            $location.path('/profile/' + data.id );
        };
        $scope.login = function () {
            var url = ConfigService.serverIp + '/authenticateLogin';
            console.log("input credentials: " + $scope.username + ' ' + $scope.password);
            $http.post(url, {username: $scope.username, password: $scope.password}).success(function(response) {
                console.log('\nlogin successful!!\nuser: ', response.member, '\n');
                $scope.navigateToMemberProfile( { id: response.member.memberId } );
            }).error(function (err) {
                alert("login failed, reason: " + err.reason);
            });
        };
    }
]);

memberControllers.controller('Profile', ['ConfigService', '$scope', '$http', 'Upload', '$routeParams',
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
    }
]);