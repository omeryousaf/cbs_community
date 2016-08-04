/**
 * Created by omeryousaf on 16/03/15.
 */
var controller = angular.module('loginSignupController', []);

// get the UI to ensure filling of mandatory fields before calling the backend
// check username availability in an ajax way, i-e on blur of the username field if it has a value
controller.controller('Signup', ['ConfigService', '$scope', '$http', '$location',
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

controller.controller('Login', ['ConfigService', '$scope', '$http', '$location',
    function (ConfigService, $scope, $http, $location) {
        $scope.username = '';
        $scope.password = '';
        $scope.forgottenUsername = '';

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
        $scope.forGetPassword = function(){
            var url = ConfigService.serverIp + '/forgetPassword';
            $http.post(url, {username: $scope.forgottenUsername}).success(function(response) {
                console.log(response);
            }).error(function (err) {
                alert("Some Error occured: " + err.reason);
            });
        }

        $scope.chand= function(){
            if($scope.pass1!= null && $scope.pass2!= null && $scope.pass1===$scope.pass2){
                var currentUrl = window.location.href;
                alert(currentUrl);

            }
            else{
                alert("You're Passwords do not match or you have left the Passwords empty")
            }
        };
    }
]);

