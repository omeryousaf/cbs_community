/**
 * Created by shujaatali on 05/06/16.
 */
var config = require('../nodejs_config/config.js');
var jwt = require('jsonwebtoken');
module.exports.tryResettingPass = function(req,res){
    var decode = jwt.verify(req,'CBS_Community');
    console.log(decode);

};

