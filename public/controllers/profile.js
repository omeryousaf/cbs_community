/**
 * Created by shujaatali on 01/02/16.
 */
var controller = angular.module('profileController',[]);
controller.controller('Profile', ['ConfigService', '$scope', '$http', 'Upload', '$routeParams',
    function (ConfigService, $scope, $http, Upload, $routeParams) {

        $scope.tabArray = [
            {name:"Profile","value":1},
            {name:"Education","value":2},
            {name:"Work","value":3},
            {name:"About","value":4}
        ];
        $scope.more_work_counter=0; //counter to add objects containing ids inside moreWork array and add dynamic ids to the more buttons fields
        $scope.moreWork = new Array(); //added the very first id which is 0 at index 0
        $scope.controlBtnMoreWork =0; //used to show hide the plus (more work) button


        $scope.preview = ""; // initialising value of a label in the view to empty string so it does not show at start

        $http.get( ConfigService.serverIp + '/getMember/' + $routeParams.id ).success( function ( member ) {
            $scope.canEdit=member.doc.canEdit;
            if(member.doc.work){
                $scope.work=member.doc.work;
                var i;
                for(i=0; i< $scope.work.length; i++){
                    $scope.moreWork.push( {id:i,
                        copmanyName: $scope.work[i].companyName,
                        designation : $scope.work[i].designation,
                        industry: $scope.work[i].industry,
                        location: $scope.work[i].location
                                    });

                }


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



        $scope.appendWork = function(){
            $scope.more_work_counter++;
            $scope.moreWork.push({
                id:$scope.more_work_counter //adding a new id for new - button
            });
        }

        $scope.removeField = function(htmlEelemt){
            var indexInArray = htmlEelemt.item.id; //getting the id of the "-" button from html page and storing in a variable in other words getting the index for $scope.moreWork array


            $scope.moreWork.splice(indexInArray,1);
            //rearranging ids in moreWork array so that index will match up with the ids.

            for(var i=0;i<$scope.moreWork.length;i++){
                $scope.moreWork[i].id=i;
            }
            $scope.more_work_counter=$scope.moreWork.length-1;
        }

        $scope.showMoreWork = function(operation){
            $scope.controlBtnMoreWork=operation;
        }

        $scope.saveProgress = function(){
            var url = ConfigService.serverIp + '/saveProgress';
            $http.post(url,{editedWork: $scope.moreWork}).success(function(response){
                console.log(response);
            }).error(function(err){
                console.log(err);
            });
        }
    }
]);


