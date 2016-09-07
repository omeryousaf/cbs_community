/**
 * Created by omeryousaf on 06/02/16.
 */
module.exports = function ( nano ) {
    var membersDb = nano.db.use('members');
    var members = {};

    members.getMembers = function (req, res) {
        membersDb.view('cbs', 'getAllMembers', {include_docs: true}, function(err, respBody) {
            if (err) {
                res.send({ error: err });
            } else {
                //console.log(respBody);
                res.send({ members: respBody.rows });
            }
        });
    };

    return members;
};