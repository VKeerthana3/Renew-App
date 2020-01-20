var express = require("express");
var router = express.Router();

var Customer = require("../models/customer");


router.get("/", isLoggedIn, function(req,res){
	Customer.find({}, function(err, customers){
		if(err){
		   console.log(err);
		   } else{
			   res.render("customers", {customers: customers});
		   }
	});
});


router.get("/new", function(req,res){
	res.render("customers/new");
});

router.get("/:id", function(req,res){
	Customer.findById(req.params.id, function(err, customer){
		if(err){
		   console.log(err);
		   } else{
		   res.render("customers/show", {customer:customer});
		   }
	});
});

router.post("/", isLoggedIn, function(req,res){
	Customer.create(req.body.customers, function(err, customer){
		if(err){
		   console.log(err);
		   } else{
			   res.redirect("/customers");
		   }
	});
});

router.get("/:id/edit", function(req,res){
	Customer.findById(req.params.id, function(err, customer){
		if(err){
		   console.log(err);
		   } else{
			   res.render("customers/edit", {customer: customer});
		   }
	});
});

router.put("/:id", function(req,res){
	Customer.findByIdAndUpdate(req.params.id, req.body.customers, function(err, customer){
		if(err){
			console.log(err);
		} else{
			res.redirect("/customers/"+req.params.id);
		}
	});
});;


router.delete("/:id", function(req,res){
	Customer.findByIdAndRemove(req.params.id, function(err, deleted){
		if(err){
		   console.log(err);
		   } else{
			   res.redirect("/customers");
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

