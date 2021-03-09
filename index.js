const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Taco = require('./models/Taco');
const uri = require('./crabby_patty_recipe.json').mongo_uri;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(_ => console.log('Database connected'))
	.catch(error => console.error('Error making connection: ', error));

const db = mongoose.connection;

db.on('error', error => {
	console.error('Connection error: ', error);
});

// set templating engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET
app.get('/', (req, res) => {
	Taco.find()
		.then(results => { 
			res.render('index.ejs', { tacos: results });
		})
		.catch(error => console.error(error));
});

// POST
app.post('/tacos', (req, res) => {
	Taco.create(req.body)
		.then(doc => {
			res.json('Success');
		})
		.catch(error => console.error(error));
});

// PUT
app.put('/tacos', (req, res) => {
	Taco.findOneAndUpdate(
		{ name: { $not: { $eq: 'Edgar' } } },
		{ $set: req.body },
		{ upsert: true }
	)
		.then(result => { 
			res.json('Success');
		})
		.catch(error => console.error(error));
});

// DELETE
app.delete('/tacos', (req, res) => {
	Taco.deleteOne({ name: req.body.name })
		.then(result => { 
			if (result.deletedCount === 0) {
				return res.json('No poop to clean up');
			}
			res.json('Cleaned up Edgar\'s poop');
		})
		.catch(error => console.error(error));
});

app.listen(3001, () => { console.log('listening on 3001') });