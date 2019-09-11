const path = require('path');
const moment = require('moment');
const config = require(path.join(global.appRoot, '/nodejs_config/config.js'));
const nano = require('nano')(config.App.CouchServerIp);
const db = process.env.NODE_ENV == 'test' ? `${process.env.NODE_ENV}-events` : 'events';
const eventsDb = nano.db.use(db);

exports.save = async (req, res) => {
  try {
    req.body.event.createdAt = moment().unix();
    req.body.event.createdBy = req.user._id;
    await eventsDb.insert(req.body.event);
    res.send();
  } catch(err) {
    console.log(err);
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

exports.fetchEvent = async (req, res) => {
  try {
    const requestedEvent = await eventsDb.get(req.params.id);
    res.send(requestedEvent);
  } catch(error) {
    console.log(error);
    res.status(500).send();
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const eventInDb = await eventsDb.get(req.body.event._id);
    if (!eventInDb) {
      throw new Error('Event not found in DB');
    }
    if(req.user._id !== eventInDb.createdBy) {
      throw new Error('This event can only be edited by its creator');
    }
    Object.assign(eventInDb, req.body.event);
    eventInDb.updatedAt = moment().unix();
    eventInDb.updatedBy = req.user._id;
    await eventsDb.insert(eventInDb);
    res.send({});
  } catch(error) {
    console.log(error);
    res.status(500).send();
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const eventInDb = await eventsDb.get(req.params.id);
    if (!eventInDb) {
      throw new Error('Event not found in DB');
    }
    if(req.user._id !== eventInDb.createdBy) {
      throw new Error('This event can only be deleted by its creator');
    }
    await eventsDb.destroy(eventInDb._id, eventInDb._rev);
    res.send({});
  } catch(error) {
    console.log(error);
    res.status(500).send();
  }
};