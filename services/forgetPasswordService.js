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
            res.send(err);
        } else {
            if (respBody.rows.length === 0) { // a doc with this 'username' does not exist in db
            res.send("Provided user name does not exist in the system");
        } else {
            var member = respBody.rows[0].doc;
            var token = jwt.sign({ id: member._id }, config.App.secretKey,{
                expiresIn : 259200
            });
            var resetPassLink = config.App.serverIp+'/#/resetPassword/'+token;
            var data = {
                from: 'Mailgun Sandbox <postmaster@sandboxe91368ca64a2490d9d308fd1d4df5971.mailgun.org>',
                to: 'm.ali.hussan.hussain@gmail.com',
                subject: 'Forgot Password Reset Link',
                text: 'Hi, Please click below metioned link to reset you password '+resetPassLink
            };


            mailgun.messages().send(data, function (error, body) {
                if(error)
                {
                    res.send(error);
                }

                else
                {
                    var email = member.email;
                    var finalEmail = "***"+email.substring(3);
                    var message = "An email has been sent to "+finalEmail+" please follow the instructions sent there.";
                    res.send(message);
                }

            });
        }

    }
})};

exports.resetPassword = function(req,res){
    var decoded = jwt.verify(req.body.userId, config.App.secretKey, function(err,decode){
        if(err){
            res.send(err);

        }
        else{

            db.atomic("cbs", "resetPassword", decode.id,
                {field: "password", value: req.body.pass}, function (error, response) {
                    if (error) {
                        res.status(error.status || 500).send(error);

                    }
                    else{
                        res.send(response);
                    }
                });

        }
    });


};