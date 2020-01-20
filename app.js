var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var passport = require("passport");
var pl = require("passport-local");
var plm = require("passport-local-mongoose");
var eSession = require("express-session");

var app = express();

var Product = require("./models/product");
var Customer = require("./models/customer");
var Sale = require("./models/sale");
var Order = require("./models/order");
var User = require("./models/user");


var productRoutes = require("./routes/products");
var customerRoutes = require("./routes/customers");
var salesRoutes = require("./routes/sales");
var ordersRoutes = require("./routes/orders");
var indexRoutes = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/website3", { useNewUrlParser: true, useUnifiedTopology: true});

//PASSPORT CONFIGURE
app.use(eSession({
	secret: "Renew",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new pl(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});


// Product.create({
// 	id: 3,
// 	name: "Office 365",
// 	price: "200",
// 	stock: "20",
// 	renew: true,
// 	renewDate: new Date("2020-09-01")
// }, function(err, product){
// 	if(err){
// 		console.log(err);
// 	} else{
// 		console.log(product);
// 	}
// });

// Customer.create({
// 	id: 1,
// 	name: "Customer One",
// 	phone: "055-4444-444",
// 	email: "one@gmail.com"}, function(err, customer){
// 	if(err){
// 		console.log(err);
// 	} else{
// 		console.log(customer);
// 	}
// });

// Sale.create({
// 	id: 1,
// 	name: "Arun",
// 	phone: "055-3333-333",
// 	email: "arun@gmail.com"}, function(err, sale){
// 	if(err){
// 		console.log(err);
// 	} else{
// 		console.log(sale);
// 	}
// });

// Order.create({id: 101, date: new Date("2020-01-08")}, function(err, newOrder){
// 	if(err){
// 	   console.log(err);
// 	   } Customer.findOne({id: 1}, function(err, foundCustomer){
// 		   if(err){
// 			  console.log(err);
// 			  } Product.findOne({id:1}, function(err, foundProduct){
// 				  if(err){
// 					 console.log(err);
// 					 } Sale.findOne({id: 1}, function(err, foundSale){
// 						 if(err){
// 							console.log(foundSale);
// 							} 
// 						 newOrder.product.push({_id: foundProduct, quantity: 2});
// 						 newOrder.customer = foundCustomer;
// 						 newOrder.sales = foundSale;
// 						 newOrder.save(function(err, updatedOrder){
// 							 if(err){
// 								console.log(err);
// 								} else{
// 									console.log(updatedOrder);
// 								}
// 						 });
						 
// 					 });
// 			  });
// 	   });
// });

// Order.findOne({id:101}).populate("products").exec(function(err, pro){
// 	if(err){
// 	   console.log(err);
// 	   } else{
// 		   console.log(pro);
// 	   }
// });

// Product.create({
// 	id: 10,
// 	name: "Product 2",
// 	price: 400,
// 	stock: 20,
// 	renew: true,
// 	renewDate: new Date("2020-09-01")
// }, function(err, prod){
// 	Order.findOne({id: 101}, function(err, foundOrd){
// 		if(err){
// 			console.log(err);
// 		} else{
// 			foundOrd.product.push({_id: prod, quantity: 5});
// 			foundOrd.save(function(err, data){
// 				if(err){
// 					console.log(err);
// 				} else{
// 					console.log(data);
// 				}
// 			});
// 		}
// 	});
// });


// Order.find({id: 101}).populate({
// 		   path: "product._id",
// 			   model: "Product"
// 	   }).exec(function(err, data){
// 		   console.log("%j", data);
// 	   });
	   
	    // console.log(foundOrder[0].id);


// Order.find({id:101}).populate(
// 	{
// 	path: 'customer',
//     model: "Customer"
//    	}).populate({ 
// 	path: "sales",
// 	model:"Sale"
// }).populate({
// 	path: 'product._id',
// 	model: "Product"
// }).exec(function(err, order){
// 	if(err){
// 		console.log(err);
// 	} else{
// 		console.log('%j', order);
// 		// console.log()
// 	}
// });

app.use("/products", productRoutes);
app.use("/customers", customerRoutes);
app.use("/sales",salesRoutes);
app.use(ordersRoutes);
app.use(indexRoutes);

app.get("/", function(req,res){
	res.render("landing");
});


app.get("/renew", function(req,res){
	Product.find({renew: true}, function(err, product){
		if(err){
			console.log(err);
		} else{
			var today = new Date();
// var date = today.getDate() + "-" + (today.getMonth()+1) + "-"+ today.getFullYear();
			var date = today.toISOString();
//console.log(date);
			product.forEach(function(pro){
				var diff = (pro.renewDate - new Date())/(1000*3600*24);
				// console.log(Math.floor(diff));
			});
			 res.render("renew", {product:product, date:date});
		}
	});
	});

app.get("/users/:id", function(req,res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
		   console.log(err);
		   } else{
			   Customer.findOne({name: foundUser.name}, function(err, customer){
				   if(customer != undefined){
					   Order.find({customer: customer._id}).populate({
						   path: "customer",
						   model: "Customer"
					   }).populate({
						   path: "sales",
						   model: "Sale"
					   }).populate({
						   path: "product._id",
						   model: Product
					   }).exec(function(err, order){
						   if(err){
							  console.log(err);
							  } else{
								  console.log("%j",order);
							  res.render("users/show",{user: customer}, {order: order});
							  }
					   });
					  } else{
					Sale.findOne({name: foundUser.name}, function(err, sale){
				   if(err){
					   console.log(err);
				   } else{
					   Order.find({sales: sale._id}).populate({
						   path: "sales",
						   model: "Sale"
					   }).populate({
						   path: "customer",
						   model: "Customer"
					   }).populate({
						   path: "product._id",
						   model: "Product"
					   }).exec(function(err, order){
						   if(err){
							  console.log(err);
							  } else{
								  console.log("%j",order);
								   res.render("users/show", {user: sale, order: order});
							  }
					   });
				   }
			   });
								}
			   });
		   }
	});
});


app.listen(3000, function(req,res){
	console.log("Server is running");
});
