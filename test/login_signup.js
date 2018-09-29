const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('Login functionality', function() {
	it('should return success with correct login credentials', function() {
		return request(app)
		  .post('/authenticateLogin')
		  .send({
		  	username: 'oomer',
		  	password: 'oomer123'
		  })
		  .set('Accept', 'application/json')
		  .expect(200);
	});
});