/**
 * Created by omeryousaf on 02/08/15.
 */
var fs = require('fs.extra');
var config = require('../nodejs_config/config.js');

module.exports = function ( nano ) { // var nano is passed in from caller routes/index
    var profileUpdator = {};

    var membersDb = nano.db.use('members');

    profileUpdator.updatePicture = function(req, res) {
        var memberId = req.body.memberId;
        console.log('\nreq.session', req.session, '\n');
        console.log('\nreq.session.passport.user', req.session.passport.user, '\n');
        console.log('\nreq.user', req.user, '\n');
        // write file in a local folder
        var imagePath = req.files.file.path;
        var imageName = req.files.file.originalFilename;
        var error;
        membersDb.get( memberId, { revs_info: true }, function(err, doc) {
            if (!err) {
                fs.readFile( imagePath, function (err, file) {
                    if (!err) {
                        console.log('uploading image to couch server...');
                        doc.currentImage = imageName;
                        membersDb.multipart.insert( doc, [{name: imageName, data: file, content_type: 'image'}], doc._id, function(err, body) {
                            if (!err) {
                                console.log('image uploaded!!!');
                                var imageCouchPath = config.App.serverIp + '/profileimage?docid=' + doc._id + '&picname=' + imageName;
                                setTimeout( function () {
                                    res.send({ 'serverResponse': 'image uploaded!!!', 'filePath': imageCouchPath });
                                }, 5000);
                            } else {
                                error = err;
                            }
                        });
                    } else {
                        error = err;
                    }
                });
            } else {
                error = err;
            }
        });
        if ( error ) {
            res.send({ 'error': error });
        }
    };

    profileUpdator.getMember = function ( req, res ) {
        console.log('goin to fetch your profile');
        membersDb.get( req.params.id, {revs_info: true}, function (err, doc) {
            if (!err) {
                res.send({'doc': doc});
            } else {
                res.send({'error': err});
            }
        });
    };

    profileUpdator.getProfileImage = function ( docId, attachmentName ) {
        return membersDb.attachment.get(docId, attachmentName);
    };

    return profileUpdator;
};