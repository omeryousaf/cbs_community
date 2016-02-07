/**
 * Created by omeryousaf on 24/03/15.
 */
var couchapp = require('couchapp')
    , path = require('path')
    ;

ddoc =  { _id:'_design/cbs' }

ddoc.views = {
    isDuplicateUsername: {
        map: function (doc) {
            if (doc.username) {
                emit(doc.username, true);
            }
        }
    },
    getAllMembers: {
        map: function (doc) {
            if (doc.username) {
                emit(doc.username, { name: doc.name, email: doc.email, boardingHouse: doc.boardingHouse});
            }
        }
    }
}

module.exports = ddoc;