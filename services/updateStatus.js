/**
 * Created by shujaatali on 2/21/17.
 */
exports.updateStatus = function(req,res){
    var config = require('../nodejs_config/config.js');
    var db = require('nano-blue')(config.App.CouchServerIp+'/members');
    db.atomic("cbs", "updateFields", req.body.userId,
        {field: "isBlocked", value: req.body.blocked}, function (error, response) {
            if (error) {
                res.status(error.status || 500).send(error);
                console.log(error.stack);
            }
            else{
                res.send(response);
            }
        });
}