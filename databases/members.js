/**
 * Created by omeryousaf on 24/03/15.
 */
var couchapp = require('couchapp')
    , path = require('path')
    ;

ddoc =  { _id:'_design/cbs' }

ddoc.views = {
    getMemberByUsername: {
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
    },
    getAdmins: {
        map: function (doc) {
            if (doc.isAdmin) {
                emit(doc.username, { name: doc.name, email: doc.email, boardingHouse: doc.boardingHouse});
            }
        }
    }
}

ddoc.updates = {
    updateWork: function (doc, req) {
        var body = JSON.parse(req.body);
        var field = body.field;
        var value = body.value;
        var message = req.body;
        doc[field] = value;
        return [doc, message];
    },
    resetPassword: function(doc,req){
        var body = JSON.parse(req.body);
        var field = body.field;
        var value = body.value;
        var message = req.body;
        doc[field] = value;

        return [doc, message];
    }
}


module.exports = ddoc;