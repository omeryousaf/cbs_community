/**
 * Created by omeryousaf on 02/08/15.
 */
var fs = require('fs');
var config = require('../nodejs_config/config.js');
var base64 = require('node-base64-image');

module.exports = function ( nano ) { // var nano is passed in from caller routes/index
    var profileUpdator = {};

    var membersDb = nano.db.use('members');

    profileUpdator.updatePicture = function(req, res) {
        var memberId = req.body.memberId;
        // write file in a local folder
        var imageName = req.body.filename;
        var imagePath = 'uploads/' + imageName;
        var base64Data = req.body.encodedImage.replace(/^data:image\/png;base64,/, "");
        /* TASKS:
        * 1 - can we make all async calls using promises here ?
        * */
        fs.writeFile( imagePath, base64Data, 'base64', function(err) {
            if( err) {
                console.log('\n', err, '\n');
                res.send({ 'error': err });
                return;
            }
            fs.readFile( imagePath, function (err, file) {
                if ( !err ) {
                    membersDb.get( memberId, { revs_info: true }, function(err, doc) {
                        if ( err ) {
                            console.log('\n', err, '\n');
                            res.send({ 'error': err });
                            return;
                        } else {
                            console.log('uploading image to couch server...');
                            doc.currentImage = imageName;
                            membersDb.multipart.insert( doc, [{name: imageName, data: file, content_type: 'image'}], doc._id, function(err, body) {
                                if ( !err ) {
                                    console.log('image uploaded!!!');
                                    var imageCouchPath = config.App.serverIp + '/profileimage?docid=' + doc._id + '&picname=' + imageName;
                                    res.send({ 'serverResponse': 'image uploaded!!!', 'filePath': imageCouchPath });
                                    fs.unlink( imagePath, function (error) {
                                        if ( error) {
                                            return console.log( '\n', error.stack, '\n');
                                        } else {
                                            return console.log( '\nsuccess deleted file' + imageName + ' after saving to couch!\n');
                                        }
                                    });
                                } else {
                                    console.log('\n', err, '\n');
                                    res.send({ 'error': err });
                                }
                            });
                        }
                    });
                } else {
                    console.log('\n', err, '\n');
                    res.send({ 'error': err });
                }
            });
        });
    };

    profileUpdator.getMember = function ( req, res ) {
        console.log('fetching user profile...');
        console.log('\nreq.user: ', req.user, '\n');
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