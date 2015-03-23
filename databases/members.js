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
    }
}

module.exports = ddoc;