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

	test('POST', async done => {
		const data = {
			name: 'Frank',
			toppings:['chicken', 'onion', 'rice']
		}
		const response = await request.post('/tacos').send(data);
		expect(response.status).toBe(200);
		expect(response.text).toBe('Success');
		done();
	});

	test('PUT', async done => {
		const data = {
			name: 'Edgar',
			toppings: ['Edgar\'s Poop']
		}
		const response = await request.put('/tacos').send(data);
		expect(response.status).toBe(200);
		expect(response.text).toBe('Success');
		done();
	});

	test('DELETE (rows available)', async done => {
		const data = {
			name: 'Edgar'
		}
		const response = await request.delete('/tacos').send(data);
		expect(response.status).toBe(200);
		done();
	});

	test.todo('DELETE (no rows to delete)');
});
