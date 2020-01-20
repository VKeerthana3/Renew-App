var mongoose = require("mongoose");

var customerSchema = new mongoose.Schema({
	id: Number,
	name: String,
	phone: String,
	email: String
});

module.exports = mongoose.model("Customer", customerSchema);