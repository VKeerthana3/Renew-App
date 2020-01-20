var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");

//AUTH ROUTES

router.get("/register", function(req,res){
	res.render("register");
});


router.post("/register", function(req,res){
	User.register(new User({name: req.body.name, username: req.body.username}), req.body.password, function(err, user){
		if(err){
		   console.log(err);
		   } else{
			   passport.authenticate("local")(req,res,function(){
				   res.redirect("/");
			   });
		   }
	});
});


//LOGIN
router.get("/login", function(req,res){
	res.render("login");
});


router.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
}),function(req,res){
	
});

router.get("/logout", function(req,res){
	req.logout();
	res.redirect("/orders");
});



module.exports = router;
