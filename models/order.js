var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
	id: Number,
	customer: {type: mongoose.Schema.Types.ObjectId,
			  ref: "Customer"},
	date: Date,
	sales: {type: mongoose.Schema.Types.ObjectId,
		   ref: "Sale"},
	product: [
		{
			 _id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product"
			},
			quantity: Number			
		}
	]
});


module.exports = mongoose.model("Order", orderSchema);

