const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = require('./crabby_patty_recipe.json').mongo_uri;

MongoClient.connect(uri, { useUnifiedTopology: true })
.then(client => {
	// DB Creation
	console.log('Connected to Database');
	const db = client.db('taco-info');
	const tacosCollection = db.collection('tacos');

	// set templating engine
	app.set('view engine', 'ejs');

	// Middleware
	app.use(express.static('public'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	// GET
	app.get('/', (req, res) => {
		tacosCollection.find().toArray()
			.then(results => { 

				res.render('index.ejs', { tacos: results });
			})
			.catch(error => console.error(error));
	});

	// POST
	app.post('/tacos', (req, res) => {
		console.log('EYYY TACCOOOOOOOOOOOOOOOOSSSS!');
		tacosCollection.insertOne(req.body)
			.then(result => {
				res.json('Success');
			})
			.catch(error => console.error(error));
	});

	// PUT
	app.put('/tacos', (req, res) => {
		tacosCollection.findOneAndUpdate(
			{ name: { $not: { $eq: 'Edgar' } } },
			{ $set: { name: req.body.name, toppings: req.body.toppings } },
			{ upsert: true }
		)
			.then(result => { 
				res.json('Success');
			})
			.catch(error => console.error(error));
	});

	// DELTE
	app.delete('/tacos', (req, res) => {
		tacosCollection.deleteOne(
			{ name: req.body.name },
		)
			.then(result => { 
				if (result.deletedCount === 0) {
					return res.json('No poop to clean up');
				}
				res.json('Cleaned up Edgar\'s poop');
			})
			.catch(error => console.error(error));
	});

	app.listen(3001, () => { console.log('listening on 3001') });
	
})
.catch(error => console.error(error));

