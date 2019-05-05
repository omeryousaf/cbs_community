/**
 * Created by omeryousaf on 02/08/15.
 */
var fs = require('fs');
var gm = require('gm');
var Busboy = require('busboy');
var config = require('../nodejs_config/config.js');
var Promise = require( 'bluebird');
var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);
var unlink = Promise.promisify(fs.unlink);

module.exports = function ( nano ) { // var nano is passed in from caller routes/index
    var profileUpdator = {};

    var membersDb = nano.db.use('members');

    profileUpdator.createImageAccordingToEditSpecs = function(filePath, imageTransformData) {
        // download image and apply transformations passed from frontend, 'imageTransformData' must include following: rotation, x, y,
        // width, and height. upload the resulting image
        return new Promise( function (resolve, reject) {
            gm.subClass({
                imageMagick: true
            })( filePath )
                .rotate( 'white', imageTransformData.rotate )
                .scale( imageTransformData.scaleToWidth, imageTransformData.scaleToHeight )
                .crop( imageTransformData.width, imageTransformData.height, imageTransformData.x, imageTransformData.y )
                .write( filePath, function (error) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
        });
    };

    profileUpdator.updatePicture = function(req, res) {
        var imageName;
        var imagePath;
        var imageTransformData = {};
        // write file in a local folder
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            var imageNameTokens = filename.split('.');
            // add a random number to filename so that simultaneous image uploads can be handled easily / uniquely
            var imageExt = '.' + imageNameTokens.pop();
            imageName = imageNameTokens.join('.') + '-' + new Date().getTime() + imageExt;
            imagePath = global.appRoot + '/uploads/' + imageName;
            file.pipe(fs.createWriteStream(imagePath));
        });
        busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            imageTransformData[fieldname] = val;
        });
        busboy.on('finish', function() {
            /* TASKS:
            * 1 - can we make all async calls using promises here ?
            * */
            return profileUpdator.createImageAccordingToEditSpecs(imagePath, imageTransformData).then(function() {
                return readFile( imagePath);
            }).then( function ( file) {
                membersDb.get( req.user._id, { revs_info: true }, function(err, doc) {
                    if ( err ) {
                        throw new Error( 'services::profile_edit::updatePicture::error fetching document');
                    } else {
                        doc.currentImage = imageName;
                        membersDb.multipart.insert(doc, [{name: imageName, data: file, content_type: 'image'}], doc._id, function(err, body) {
                            if (!err) {
                                var imageCouchPath = '/profileimage?docid=' + doc._id + '&picname=' + imageName;
                                res.send({
                                    serverResponse: 'image uploaded!!!',
                                    filePath: imageCouchPath
                                });
                                return unlink(imagePath);
                            } else {
                                throw new Error( 'services::profile_edit::updatePicture::error uploading attachment');
                            }
                        });
                    }
                });
            }).catch(function(error) {
                console.log('\n', error.stack, '\n');
                res.send({
                    error: error.stack
                });
            });
        });
        req.pipe(busboy);
    };

    profileUpdator.getMember = function ( req, res ) {
        console.log('\nreq.user: ', req.user, '\n');
        var userId = req.params.id == 'me' ? req.user._id : req.params.id;
        membersDb.get( userId, {revs_info: true}, function (err, doc) {
            if (!err) {
                if( userId === req.user._id ) {
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
        return membersDb.attachment.getAsStream(docId, attachmentName);
    };

    return profileUpdator;
};