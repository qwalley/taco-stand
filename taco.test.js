const app = require('./index.js');
const supertest = require('supertest');
const request = supertest(app);

it('GET "/"', async done => {
	const response = await request.get('/');
	expect(response.status).toBe(200);
	done();
});