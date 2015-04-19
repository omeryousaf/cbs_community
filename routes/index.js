var express = require('express');
var router = express.Router();
var config = require('../nodejs_config/config.js');
var nano = require('nano')(config.App.CouchServerIp);


/* GET home page. */
router.isUsernameUnique = function(req, res) {
    var membersDb = nano.db.use('members');
    // call the view to check uniqueness of username
    membersDb.view('cbs', 'isDuplicateUsername', {key: req.body.username, include_docs: true}, function(err, respBody) {
        if (err) {
            res.send({isUnique: false, reason: 'routes::index::isUsernameUnique: error-calling-view'});
        } else {
            if (respBody.rows.length === 0) { // a doc with this 'username' does not exist in db, hence it is unique
                res.send({isUnique: true});
            } else { // number of rows returned is > 0, so the username is not unique
                res.send({isUnique: false, reason: 'routes::index::isUsernameUnique: not-unique'});
            }
        }
    });
};

module.exports = router;
