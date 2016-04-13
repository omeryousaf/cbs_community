/**
 * Created by shujaatali on 28/03/16.
 */
exports.updateWorks = function(editedWork,res){
  var db = require('nano-blue')('http://localhost:5984/members');
    db.atomic("cbs", "updateWork", "68a91f7c9772c99d58e93c038b000131",
        {field: "work", value: editedWork}, function (error, response) {
            if (error) console.log(error);
            else{

                res.send(response);

            }
        });
}