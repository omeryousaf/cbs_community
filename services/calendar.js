const path = require('path');
const moment = require('moment');
const config = require(path.join(global.appRoot, '/nodejs_config/config.js'));
const nano = require('nano')(config.App.CouchServerIp);
const db = 'events';
const eventsDb = nano.db.use(db);

exports.save = async (req, res) => {
  try {
    req.body.event.createdAt = moment().unix();
    req.body.event.createdBy = req.user._id;
    await eventsDb.insert(req.body.event);
    res.send();
  } catch(err) {
    res.status(500).send();
  }
};

exports.fetchAll = async (req, res) => {
  try {
    const result = await eventsDb.view('cbs', 'getAllEvents', {
      include_docs: true
    });
    res.send({
      events: result.rows
    });
  } catch(err) {
    console.log(err);
    res.status(500).send();
  }
};