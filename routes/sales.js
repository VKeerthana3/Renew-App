var express = require("express");
var router = express.Router();

var Sale = require("../models/sale");

router.get("/", isLoggedIn, function(req,res){
	Sale.find({}, function(err, sales){
		if(err){
			console.log(err);
		} else{
			res.render("sales", {sales: sales});
		}
	});
});


router.get("/new", function(req,res){
	res.render("sales/new");
});


router.get("/:id", function(req,res){
	Sale.findById(req.params.id, function(err, sales){
		if(err){
		   console.log(err)
		} else{
		   res.render("sales/show", {sales: sales});
		   }
	});
});


router.post("/", isLoggedIn, function(req,res){
	Sale.create(req.body.sales, function(err, sale){
		if(err){
		   console.log(err);
		   } else{
			   res.redirect("/sales");
		   }
	});
});

router.get("/:id/edit", function(req,res){
	Sale.findById(req.params.id, function(err, sale){
		if(err){
		   console.log(err);
		   } else{
			   res.render("sales/edit", {sale:sale});
		   }
	});
});


router.put("/:id", function(req,res){
	Sale.findByIdAndUpdate(req.params.id, req.body.sales, function(err, updated){
		if(err){
		   console.log(err);
		   } else{
		   res.redirect("/sales/"+req.params.id);
		   }
	}) ;
});

router.delete("/:id", function(req,res){
	Sale.findByIdAndRemove(req.params.id, function(err, deleted){
		if(err){
		   console.log(err);
		   } else{
			   res.redirect("/sales");
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
