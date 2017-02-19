/**
 * Created by omeryousaf on 04/12/16.
 */
// putting code used by multiple controllers here
angular.module('baghiansfromtheheart').factory('UtilityFunctions', [ '$location',
    function( $location ) {
        return {
            visitMemberProfile: function ( data ) {
                //alert(data._id);
                $location.path('/profile/' + ( data._id || data.id ) );
            }
        };
    }
]);