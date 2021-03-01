const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('cxnstr', (err, client) => {
	// stuff
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});
app.post('/tacos', (req, res) => {
	console.log('EYYY TACCOOOOOOOOOOOOOOOOSSSS!');
	console.log(req.body);
});

app.listen(3000, () => { console.log('listening on 3000') });
