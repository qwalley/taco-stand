const app = require('./index.js');
const mongoose = require('mongoose');
const uri = require('./crabby_patty_recipe.json').mongo_uri;

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

app.listen(3001, () => { console.log('listening on port 3001') });