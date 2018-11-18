/**
 * Created by omeryousaf on 04/12/16.
 */
// putting code used by multiple controllers here
angular.module('baghiansfromtheheart').factory('UtilityFunctions', [ '$location', 'ConfigService',
    function( $location, ConfigService ) {
        return {
            visitMemberProfile: function ( data ) {
                $location.path('/profile/' + (data._id === ConfigService.getInSessionUserId() ? 'me' : data._id));
            }
        };
    }
]);