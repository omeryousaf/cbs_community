var express = require('express');
var router = express.Router();
var config = require('../nodejs_config/config.js');
var nano = require('nano')(config.App.CouchServerIp);


/* checks for uniqueness of username and saves member credentials if username is unique
 *       params: req, res
 *       username = req.body.newUser.username
 * */
router.isUsernameUnique = function(req, res) {
    var membersDb = nano.db.use('members');
    // call the view to check uniqueness of username
    membersDb.view('cbs', 'isDuplicateUsername', {key: req.body.newUser.username, include_docs: true}, function(err, respBody) {
        if (err) { // error in calling this view
            console.log('error', err);
            res.send({isUnique: false, reason: 'routes::index::isUsernameUnique: error-calling-view', error: err});
        } else {
            if (respBody.rows.length === 0) { // a doc with this 'username' does not exist in db, hence it is unique
                membersDb.insert(req.body.newUser, function(err, body) {
                    if (!err) {
                        res.send({isUnique: true});
                    } else {
                        res.send({isUnique: true, reason: 'routes::index::isUsernameUnique: failed to save signup credentials'});
                    }
                });
            } else { // number of rows returned is > 0, so the username is not unique
                res.send({isUnique: false, reason: 'routes::index::isUsernameUnique: not-unique'});
            }
        }
    });
};

module.exports = router;
