const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Taco = require('./models/Taco');

// define Async Wrapper that catches errors throw by 'await's and passes them to Express handler
function aw (callback) {
	return function (req, res, next) {
		callback(req, res, next).catch(next);
	}
}

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
app.get('/tacos', aw(async (req, res) => {
	const results = await Taco.find();
	res.json(results);
}));

// POST
app.post('/tacos', aw(async (req, res) => {
	const results = await Taco.create(req.body)
	res.json(results);		
}));

// PUT
app.put('/tacos', aw(async (req, res, next) => {
	const results = await Taco.findOneAndUpdate(
		{ name: { $not: { $eq: 'Edgar' } } },
		{ $set: req.body },
		{ upsert: true, new: true }
	);
	res.json(results);
}));

// DELETE
app.delete('/tacos', aw(async (req, res, next) => {
	const result = await Taco.deleteOne({ name: req.body.name })
	if (result.deletedCount === 0) {
		return res.send('No poop to clean up');
	}
	res.send('Cleaned up Edgar\'s poop');	
}));

// app.listen(3001, () => { console.log('listening on 3001') });
module.exports = app;