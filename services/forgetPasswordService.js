/**
 * Created by shujaatali on 04/05/16.
 */
var config = require('../nodejs_config/config.js');
var jwt = require('jsonwebtoken');
var mailgun = require('mailgun-js')({apiKey: config.App.mailGunApiKey, domain: config.App.mailGunDomain});
exports.checkUserName = function(req,res){

    var db = require('nano-blue')(config.App.CouchServerIp+'/members');
        db.view('cbs', 'getMemberByUsername', {key: req.body.username, include_docs: true}, function(err, respBody) {
        if (err) {
        return err;
             } else {
         //console.log(respBody);
        if (respBody.rows.length === 0) { // a doc with this 'username' does not exist in db

            return 0;
        } else {
            var member = respBody.rows[0].doc;
            var token = jwt.sign({ id: respBody.rows[0].doc._id }, 'CBS_Community');
            console.log(token);
            var resetPassLink = config.App.serverIp+'/#/resetPassword/'+token;
           // var decode = jwt.verify(token,'shhhhh');
            //console.log(decode);
           // var tott=toString(token);

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
                console.log(body);
            });
        }

    }
})};