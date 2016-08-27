/**
 * Created by shujaatali on 04/05/16.
 */
var config = require('../nodejs_config/config.js');
var jwt = require('jsonwebtoken');
var mailgun = require('mailgun-js')({apiKey: config.App.mailGunApiKey, domain: config.App.mailGunDomain});
var db = require('nano-blue')(config.App.CouchServerIp+'/members');
exports.checkUserName = function(req,res){


        db.view('cbs', 'getMemberByUsername', {key: req.body.username, include_docs: true}, function(err, respBody) {
        if (err) {
        return err;
             } else {
            if (respBody.rows.length === 0) { // a doc with this 'username' does not exist in db
            return 0;
        } else {
            var member = respBody.rows[0].doc;
            var token = jwt.sign({ id: respBody.rows[0].doc._id }, config.App.secratKey,{
                expiresIn : 259200
            });
            console.log(token);
            var resetPassLink = config.App.serverIp+'/#/resetPassword/'+token;
            var data = {
                from: 'Mailgun Sandbox <postmaster@sandboxe91368ca64a2490d9d308fd1d4df5971.mailgun.org>',
                to: 'm.ali.hussan.hussain@gmail.com',
                subject: 'Forgot Password Reset Link',
                text: 'Hi, Please click below metioned link to reset you password '+resetPassLink
            };


            mailgun.messages().send(data, function (error, body) {
                if(error)
                console.log(error)
                else
                res.send(body.message);
            });
        }

    }
})};

exports.resetPassword = function(req,res){
    //console.log(req.body.userId);
    var decoded = jwt.verify(req.body.userId, config.App.secratKey, function(err,decode){
        if(err){
            console.log(err);

        }
        else{
            console.log(decode.id);
            db.atomic("cbs", "resetPassword", decode.id,
                {field: "password", value: req.body.pass}, function (error, response) {
                    if (error) {
                        res.status(error.status || 500).send(error);
                        console.log(error.stack);
                    }
                    else{
                        res.send(response);
                    }
                });

        }
    });


};