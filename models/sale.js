var mongoose = require("mongoose");

var saleSchema = new mongoose.Schema({
	id: Number,
	name: String,
	phone: String,
	email: String
});

module.exports = mongoose.model("Sale", saleSchema);