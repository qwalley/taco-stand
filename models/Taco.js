const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tacoSchema = new Schema({
	name: String,
	toppings: Array
});

module.exports = mongoose.model('Taco', tacoSchema);