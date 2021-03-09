const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const Taco = require('./models/Taco');
const uri = require('./crabby_patty_recipe.json').mongo_uri;

// define Async Wrapper that catches errors throw by 'await's and passes them to Express handler
function aw (callback) {
	return function (req, res, next) {
		callback(req, res, next).catch(next);
	}
}

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
app.get('/', aw(async (req, res) => {
	const results = await Taco.find();
	res.render('index.ejs', { tacos: results });
}));

// POST
app.post('/tacos', aw(async (req, res) => {
	const result = await Taco.create(req.body)
	res.json('Success');		
}));

// PUT
app.put('/tacos', aw(async (req, res, next) => {
	const result = await Taco.findOneAndUpdate(
		{ name: { $not: { $eq: 'Edgar' } } },
		{ $set: req.body },
		{ upsert: true }
	);
	res.json('Success');
}));

// DELETE
app.delete('/tacos', aw(async (req, res, next) => {
	const result = await Taco.deleteOne({ name: req.body.name })
	if (result.deletedCount === 0) {
		return res.json('No poop to clean up');
	}
	res.json('Cleaned up Edgar\'s poop');	
}));

app.listen(3001, () => { console.log('listening on 3001') });