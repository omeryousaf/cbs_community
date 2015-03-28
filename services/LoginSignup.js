/**
 * Created by omeryousaf on 23/03/15.
 */

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


passport.use(
    new LocalStrategy({
            passReqToCallback: true
        },
        // method that authenticates a user on login and signup
        function (req, username, password, done) {
            console.log("inside authentication..");
            // control coming from login
            var nano = require('nano');
            var localDbServerAddr = 'http://127.0.0.1:5984';
            var dbServer = nano(localDbServerAddr);
            var membersDb = dbServer.db.use('members');
            membersDb.view('cbs', 'isDuplicateUsername', {key: username, include_docs: true}, function(err, respBody) {
                if (err) {
                    return done(err);
                } else {
                    //console.log(respBody);
                    if (respBody.rows.length === 0) { // a doc with this 'username' does not exist in db
                        return done(null, false, { message: "username is incorrect. please try again" });
                    } else if (respBody.rows.length === 1) { // exactly one match has been found, verify password now
                        var member = respBody.rows[0].doc;
                        if (member.password === password) { // user is verified
                            console.log("passwords matched!!!- " + member.password + ' : ' + password);
                            return done(null, {username: member.username} );
                        } else { // password is incorrect
                            console.log("passwords differ!!! - " + member.password + ' : ' + password);
                            return done(null, false, { message: "password is incorrect" });
                        }
                    } else { // more than one docs exist with same value that is = value of var 'username' here
                        return done(null, false, { message: "more than 1 accounts exist with this username. please report to the admin" });
                    }
                }
            });
        }
    )
);

passport.serializeUser(
    function (user, done) {
        console.log('haallloooooo....');
        done(null, user);
    }
);
passport.deserializeUser(
    function (username, done) {
        console.log('haallloooooo123....');
        done(null, {
            username: username
        });
    }
);
module.exports = passport;