var express = require("express");
var router = express.Router();

var Customer = require("../models/customer");
var Sale = require("../models/sale");
var Product = require("../models/product");
var Order = require("../models/order");


router.get("/orders", isLoggedIn, function(req,res){
	Order.find({}, function(err, orders){
		if(err){
			console.log(err);
		} else{
			Order.find().populate({
				path: 'customer',
    model: "Customer"
   	}).populate({
	path: "sales", 
	model:"Sale"
}).populate({
	path: 'product._id',
	model: "Product"
}).exec(function(err, order){
				if(err){
					console.log(err);
				} else{
					res.render("orders", {order: order});
				}
			});
		}
	});
});

router.get("/orders/news", isLoggedIn, function(req,res){
	res.render("orders/new3");
});

router.get("/orders/:id", function(req,res){
	Order.findById(req.params.id).populate({
	path: "product._id",
	 model: "Product"
 }).populate({
		path: "sales",
		model: "Sale"
	}).populate({
		path: "customer",
		model: "Customer"
	}).exec(function(err, data){ 
	console.log("%j",data); 
			   res.render("show3", {data: data});
 });
		  
	});



router.post("/orders", isLoggedIn, function(req,res){
	console.log("Post route");
	Order.create(req.body.orders, function(err, order){
		if(err){
			console.log("ERROR");
		   console.log(err);
		   } else{
			   res.redirect("orders");
			   }
		   });
	});

router.get("/orders/:id/edit", function(req,res){
	Order.findById(req.params.id).populate({
		path: "sales",
		model: "Sale"
	}).populate({
		path: "customer",
		model: "Customer"
	}).exec(function(err, foundOrder){
		if(err){
		   console.log(err);
		   } else{
				res.render("orders/edit", {order: foundOrder});	   
		   }
	});
});

router.put("/orders/:id", function(req,res){
	Order.findByIdAndUpdate(req.params.id, req.body.orders, function(err, updated){
		if(err){
		   console.log(err);
		   } else{
			   res.redirect("/orders/"+req.params.id);
		   }
	});
	
	// res.send("Order update route");
});


//NESTED ROUTES

router.get("/orders/:id/products/new", function(req,res){
	Order.findById(req.params.id, function(err, order){
		if(err){
			console.log(err);
		} else{
			res.render("orders/newProduct",{order:order});		
		}
	});
});
router.get("/orders/:id/sales/add", function(req,res){
	Order.findById(req.params.id, function(err, order){
		if(err){
		   console.log(err);
		   } else{
			   res.render("orders/sales", {order:order});
		   }
	});
});

router.get("/orders/:id/customer/add", function(req,res){
	Order.findById(req.params.id, function(err, order){
		if(err){
		   console.log(err);
		   } else{
		   res.render("orders/customer", {order:order});
		   }
	});
});

router.post("/orders/:id/customer", function(req,res){
	Order.findById(req.params.id, function(err, order){
		if(err){
		   console.log(err);
		   } else{
		   Customer.findOne({id: req.body.customer.id}, function(err, customer){
			if(err){
				console.log(err);
			} else{
				order.customer = customer;
				order.save();
				res.redirect("/orders/"+req.params.id);
			}
		});
		   }
	});
});


router.post("/orders/:id/sales", function(req,res){
	Order.findById(req.params.id, function(err, order){
		if(err){
		   console.log(err);
		   } else{
			   Sale.findOne({id:req.body.sales.id}, function(err, sale){
				   if(err){
					  console.log(err);
					  } else{
					  order.sales = sale;
					  order.save();
						  res.redirect("/orders/"+req.params.id);
					  }
			   });
		   }
	});
});

router.post("/orders/:id/products", function(req,res){
	Order.findById(req.params.id, function(err, order){
		if(err){
			console.log(err);
			console.log("Failed to find the order");
		} else{
			console.log(req.body.products.id);
			Product.findOne({id: req.body.products.id}, function(err, product){
				if(err){
				res.redirect("/orders");
					console.log("Did not find this product in the database");
				  console.log(err);
					
				   } else{
					   console.log(product);
				   	order.product.push({_id: product._id, quantity: req.body.products.quantity});
				order.save();
				res.redirect("/orders/"+order._id);
			// 	   }
			// });
		}
	});
		}
});
	});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports = router;