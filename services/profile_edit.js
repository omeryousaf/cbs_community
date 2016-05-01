/**
 * Created by omeryousaf on 02/08/15.
 */
var fs = require('fs');
var config = require('../nodejs_config/config.js');
var Promise = require( 'bluebird');
var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);
var unlink = Promise.promisify(fs.unlink);

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
        return writeFile( imagePath, base64Data, 'base64').then( function () {
            return readFile( imagePath);
        }).then( function ( file) {
            membersDb.get( memberId, { revs_info: true }, function(err, doc) {
                if ( err ) {
                    throw new Error( 'services::profile_edit::updatePicture::error fetching document');
                } else {
                    doc.currentImage = imageName;
                    membersDb.multipart.insert( doc, [{name: imageName, data: file, content_type: 'image'}], doc._id, function(err, body) {
                        if ( !err ) {
                            var imageCouchPath = config.App.serverIp + '/profileimage?docid=' + doc._id + '&picname=' + imageName;
                            res.send({
                                serverResponse: 'image uploaded!!!',
                                filePath: imageCouchPath
                            });
                            return unlink( imagePath);
                        } else {
                            throw new Error( 'services::profile_edit::updatePicture::error uploading attachment');
                        }
                    });
                }
            });
        }).catch( function ( error) {
            console.log('\n', error.stack, '\n');
            res.send({
                error: error.stack
            });
        });
    };

    profileUpdator.getMember = function ( req, res ) {
        console.log('\nreq.user: ', req.user, '\n');
        membersDb.get( req.params.id, {revs_info: true}, function (err, doc) {
            if (!err) {

                if(req.params.id === req.user._id){
                    doc['canEdit']=1;
                }
                else{
                    doc['canEdit']=0;
                }
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