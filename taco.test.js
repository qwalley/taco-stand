const app = require('./index.js');
const supertest = require('supertest');
const request = supertest(app);

describe('/', () => {
	test('GET', async done => {
		const response = await request.get('/');
		expect(response.status).toBe(200);
		done();
	});	
});

describe('/tacos', () => {
	test('GET', async done => {
		const expected = {
			__v: expect.any(Number),
			_id: expect.any(String),
			name: expect.any(String),
			toppings: expect.arrayContaining([expect.any(String)])
		}
		const response = await request.get('/tacos');
		expect(response.status).toBe(200);
		expect(response.body[0]).toEqual(expect.objectContaining(expected));
		done();
	});
});