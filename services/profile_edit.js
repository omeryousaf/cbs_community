/**
 * Created by omeryousaf on 02/08/15.
 */
module.exports = function ( nano ) { // var nano is passed in from caller routes/index
    var profileUpdator = {};
    profileUpdator.updatePicture = function(req, res) {
        console.log('req.body', req.body);
        console.log('req.files.file.originalFilename: ', req.files.file.originalFilename);
        console.log('\n\nreq.session', req.session, '\n\n');
        console.log('\n\n\nreq.session.passport.user', req.session.passport.user, '\n\n\n');
        console.log('\n\n\n\nreq.user', req.user, '\n\n\n\n');
        res.send({ 'serverResponse': 'image uploaded!!!' });
    }
    return profileUpdator;
};