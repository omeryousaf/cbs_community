/**
 * Created by shujaatali on 28/03/16.
 */
exports.updateWorks = function(req,res){
    var config = require('../nodejs_config/config.js');
    var db = require('nano-blue')(config.App.CouchServerIp+'/members');
    db.atomic("cbs", "updateFields", req.user._id,
        {field: "work", value: req.body.editedWork}, function (error, response) {
            if (error) {
                res.status(error.status || 500).send(error);
                console.log(error.stack);
            }
            else{
                res.send(response);
            }
        });
}