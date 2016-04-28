var express = require('express');
var router = express.Router();
var config = require('../nodejs_config/config.js');
var nano = require('nano')(config.App.CouchServerIp);
var authenticator = require('../services/authentication.js');
var profileEditor = require('../services/profile_edit.js')(nano);
var membersService = require('../services/members.js')(nano);
var updateService = require('../services/updatework.js');
router.authenticateLogin = function (req, res, next) {
    console.log("b4 authentication.. " + req.body.username + ' ' + req.body.password);
    authenticator.authenticate('local', function(err, user, info) {
        if (err) { // when something goes wrong with the database server or in connecting to it
            console.log('status: 500');
            res.status(500).send({ reason: 'database error' });
        } else if (info) { // when credentials were rejected by authentication module (authentication.js)
            console.log('status: 401, unauthorised');
            res.status(401).send({ reason: info.message });
        } else {
            req.login(user, function(err) { // executes passport.serializeUser() method
                if (err) {
                    console.log('status: 500 could not save session'); // what response to send in this case to the front end?
                    res.status(500).send({ reason: 'could not save session' });
                } else {
                    console.log('req.session.passport.user', req.session.passport.user, '\n');
                    res.send({member: user}); // verified member
                }
            });
        }
    })(req, res, next);
};
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

router.uploadProfileImage = function (req, res) {
    profileEditor.updatePicture( req, res );
};

router.getMember = function ( req, res ) {
    profileEditor.getMember( req, res );
};

router.getProfileImage = function ( req, res ) {
    console.log('\ngetProfileImage req.user', req.user, '\n');
    profileEditor.getProfileImage(req.query.docid, req.query.picname).pipe(res);
};

router.getMembers = function ( req, res ) {
    membersService.getMembers( req, res );
};

router.saveProgressRoute = function (req,res) {
    updateService.updateWorks(req,res);

};

module.exports = router;
