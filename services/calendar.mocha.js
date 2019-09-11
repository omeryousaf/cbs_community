const expect = require('chai').expect;
const path = require('path');
const request = require('supertest');
const app = require('../app.js');
const config = require(path.join(global.appRoot, '/nodejs_config/config.js'));

let dbName = `${process.env.NODE_ENV}-events`;
let nano = require('nano')(config.App.CouchServerIp);
const userOomer = {
	username: 'oomer',
	password: 'oomer123'
};

const testDbExistsAlready = async (testDbName) => {
	const dbList = await nano.db.list();
	return dbList.indexOf(testDbName) !== -1;
};

const loginUser = async (server, user) => {
	await server
		.post('/authenticateLogin')
		.send(user)
		.set('Accept', 'application/json')
		.expect(200);
};

const createEvent = async (server, event) => {
	await server
		.post('/api/events')
		.send(event);
};

describe('calendar controllers', () => {
	beforeEach(async () => {
		console.log(`creating test db.. ${dbName}`);
		const testEventsDbExists = await testDbExistsAlready(dbName);
		if (testEventsDbExists) {
			await nano.db.destroy(dbName);
		}
		await nano.db.create(dbName);
		console.log(`db ${dbName} created.`);
	});

	afterEach(async () => {
		console.log('deleting test db..');
		await nano.db.destroy(dbName);
		console.log(`db ${dbName} deleted.`);
	});

	const getNewEventData = () => {
		return {
			event: {
				title: 'Carnival',
				start: 123,
				end: 456,
				location: 'CBS Campus'
			}
		};
	};

	it('should create event', async () => {
		// assert that the test-events db is empty at start. then hit the add event api
		// passing in an event and finally verify that the api did persist an event to db
		const server = request.agent(app);
		const testEventsDb = nano.use(dbName);
		let result = await testEventsDb.list();
		expect(result.rows.length).to.equal(0);
		await loginUser(server, userOomer);
		const data = getNewEventData();
		await createEvent(server, data);
		result = await testEventsDb.list();
		expect(result.rows.length).to.equal(1);
	});

	it('should edit event attribute: `location`', async () => {
		const server = request.agent(app);
		await loginUser(server, userOomer);
		const data = getNewEventData();
		await createEvent(server, data);
		const testEventsDb = nano.use(dbName);
		let result = await testEventsDb.list();
		let eventFromDb = await testEventsDb.get(result.rows[0].id);
		expect(eventFromDb.location).to.equal(data.event.location);
		await server
			.put(`/api/events/${eventFromDb.id}`)
			.send({
				event: {
					_id: eventFromDb._id,
					_rev: eventFromDb._rev,
					location: 'Yankees Stadium'
				}
			})
			.expect(200);
		eventFromDb = await testEventsDb.get(result.rows[0].id);
		expect(eventFromDb.location).to.equal('Yankees Stadium');
	});

	it('should NOT allow anyone to edit the event EXCEPT the event creator him/her self', async () => {
		const server = request.agent(app);
		const userAli = {
			username: 'tabraiz',
			password: 'tabraiz'
		};
		await loginUser(server, userOomer);
		const data = getNewEventData();
		await createEvent(server, data);
		const testEventsDb = nano.use(dbName);
		let result = await testEventsDb.list({include_docs: true});
		let eventFromDb = await testEventsDb.get(result.rows[0].id);
		expect(eventFromDb.location).to.equal(data.event.location);
		// change user
		await loginUser(server, userAli);
		// try to update event and assert that the new user's attempt to do so does not go through
		await server
			.put(`/api/events/${eventFromDb.id}`)
			.send({
				event: {
					_id: eventFromDb._id,
					_rev: eventFromDb._rev,
					location: 'Gaddafi Stadium'
				}
			})
			.expect(500);
		eventFromDb = await testEventsDb.get(result.rows[0].id);
		expect(eventFromDb.location).to.not.equal('Gaddafi Stadium');
	});

	it('should delete an event from db', async () => {
		const server = request.agent(app);
		const testEventsDb = nano.use(dbName);
		await loginUser(server, userOomer);
		const data = getNewEventData();
		await createEvent(server, data);
		let result = await testEventsDb.list();
		expect(result.rows.length).to.equal(1);
		let eventFromDb = await testEventsDb.get(result.rows[0].id);
		await server
			.delete(`/api/events/${eventFromDb._id}`)
			.send()
			.expect(200);
		result = await testEventsDb.list();
		expect(result.rows.length).to.equal(0);
	});
});