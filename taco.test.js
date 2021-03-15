const app = require('./index.js');
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');
const uri = require('./crabby_patty_recipe.json').test_uri;
const Taco = require('./models/Taco');

async function clearAllCollections () {
	const collections = Object.keys(mongoose.connection.collections);
	for (const name of collections) {
		const collection = mongoose.connection.collections[name];
		await collection.deleteMany();
	}
}

async function dropAllCollections () {
	const collections = Object.keys(mongoose.connection.collections);
	for (const name of collections) {
		const collection = mongoose.connection.collections[name];
		try {
			await collection.drop();
		} catch (error) {
			// tries to drop a collection that's already dropped, safe to ignore
			if (error.message === 'ns not found') return;
			// tries to drop a collection while an operation is running on that collection
			if (error.message.includes('a background operation is currently running')) return;

			console.error(error);
		}
	}
}

beforeAll(async () => {
	mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
		.then(_ => console.log('Database connected'))
		.catch(error => console.error('Error making connection: ', error));

	// close db connection on 'Ctrl + C'
	process.on('SIGINT', () => {
		mongoose.connection.close(() => {
			console.log('mongoose connection closed.');
			process.exit(0);
		});
	});

	mongoose.connection.on('error', error => {
		console.error('Connection error: ', error);
	});
});

afterEach(async () => {
	await clearAllCollections();
});

afterAll(async () => {
	await dropAllCollections();
	await mongoose.connection.close();
});

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
			name: 'Frank',
			toppings:['chicken', 'onion', 'rice']
		};
		await Taco.create(expected);
		const response = await request.get('/tacos');
		expect(response.status).toBe(200);
		expect(response.body[0]).toEqual(expect.objectContaining(expected));
		done();
	});

	test('POST', async done => {
		const data = {
			name: 'Frank',
			toppings:['chicken', 'onion', 'rice']
		};
		const response = await request.post('/tacos').send(data);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(expect.objectContaining(data));
		done();
	});

	test('PUT', async done => {
		const data = {
			name: 'Edgar',
			toppings: ['Edgar\'s Poop']
		};
		const response = await request.put('/tacos').send(data);
		expect(response.status).toBe(200);
		expect(response.body).toEqual(expect.objectContaining(data));
		done();
	});

	test('DELETE (rows available)', async done => {
		const data = {
			name: 'Edgar'
		};
		await Taco.create({  name: 'Edgar', toppings: ['Edgar\'s Poop'] });
		const response = await request.delete('/tacos').send(data);
		expect(response.status).toBe(200);
		expect(response.text).toBe('Cleaned up Edgar\'s poop');
		done();
	});

	test('DELETE (no rows to delete)', async done => {
		const data = {
			name: 'Edgar'
		};
		const response = await request.delete('/tacos').send(data);
		expect(response.status).toBe(200);
		expect(response.text).toBe('No poop to clean up');
		done();
	});
});
