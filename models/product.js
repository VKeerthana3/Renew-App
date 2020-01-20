var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
	id: Number,
	name: String,
	price: Number,
	stock: Number,
	renew: Boolean,
	renewDate: Date
});

module.exports = mongoose.model("Product", productSchema);

