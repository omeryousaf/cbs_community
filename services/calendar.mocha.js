const expect = require('chai').expect;
const path = require('path');
const request = require('supertest');
const app = require('../app.js');
const config = require(path.join(global.appRoot, '/nodejs_config/config.js'));

let dbName = `${process.env.NODE_ENV}-events`;
let nano = require('nano')(config.App.CouchServerIp);
const user = {
	username: 'oomer',
	password: 'oomer123'
};

const testDbExistsAlready = async (testDbName) => {
	const dbList = await nano.db.list();
	return dbList.indexOf(testDbName) !== -1;
};

const loginUser = async (server) => {
	await server
		.post('/authenticateLogin')
		.send(user)
		.set('Accept', 'application/json')
		.expect(200);
};

describe('calendar controllers', async () => {
	beforeEach(async () => {
		console.log('creating test db..');
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
		await loginUser(server);
		const data = getNewEventData();
		await server
			.post('/api/events')
			.send(data)
			.set('Accept', 'application/json')
			.expect(200);
		result = await testEventsDb.list();
		expect(result.rows.length).to.equal(1);
	});

	it('should edit event attribute: `location`', async () => {
		const server = request.agent(app);
		await loginUser(server);
		const data = getNewEventData();
		await server
			.post('/api/events')
			.send(data);
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
});