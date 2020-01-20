var express = require("express");
var router = express.Router();

var Product = require("../models/product");

router.get("/", function(req,res){
	Product.find({}, function(err, products){
		if(err){
		   console.log(err);
		   } else{
			   res.render("products", {products: products});
		   }
	})
});

router.get("/new", isLoggedIn, function(req,res){
	res.render("products/new");
});

router.get("/:id", function(req,res){
	Product.findById(req.params.id, function(err,product){
		if(err){
		   console.log(err);
		    } else{
		   res.render("products/show", {product:product});
		   }
	});
});

router.post("/", isLoggedIn, function(req,res){
	Product.create(req.body.products, function(err, product){
		if(err){
		   console.log(err);
		   } else{
			   res.redirect("/products");
		   }
	});
});

router.get("/:id/edit", isLoggedIn, function(req,res){
	Product.findById(req.params.id, function(err, pro){
		if(err){
		   console.log(err);
		   } else{
		   res.render("products/edit", {pro: pro});
		   }
	});
});

router.put("/:id", isLoggedIn, function(req,res){
	Product.findByIdAndUpdate(req.params.id, req.body.products, function(err, product){
		if(err){
		   console.log(err);
		   } else{
			   res.redirect("/products/"+req.params.id);
		   }
	});
	
});

router.delete("/:id", isLoggedIn, function(req,res){
	Product.findByIdAndRemove(req.params.id, function(err, deleted){
		if(err){
		   console.log(err);
		   } else{
		   res.redirect("/products");
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