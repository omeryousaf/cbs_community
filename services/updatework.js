/**
 * Created by shujaatali on 28/03/16.
 */
exports.updateWorks = function(req,res){
    var config = require('../nodejs_config/config.js');
    var db = require('nano-blue')(config.App.CouchServerIp+'/members');
    db.atomic("cbs", "updateWork", req.user._id,
        {field: "work", value: req.body.editedWork}, function (error, response) {
            if (error) {
                res.status(err.status || 500);
            }
            else{
                res.send(response);

            }
        });
}