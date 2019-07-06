var express = require("express");
var router  = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX ROUTE
router.get("/", function(req,res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log("Error");
		}else{
			res.render("campgrounds/index",{campgrounds: campgrounds});
		}
	});
});

//CREATE ROUTE
router.post("/",middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;	
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id : req.user._id,
		username : req.user.username
	};
	var newCampground = {name : name, image : image, price : price, description: desc, author : author};
	Campground.create(newCampground, function(err,newCamp){
		if(err){
			req.flash("error","Something went wrong!");
			res.redirect("/campgrounds");
		}else{
			req.flash("success","Succesfully created the campground!");
			res.redirect("/campgrounds");
		}
	});
});

//NEW ROUTE
router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

//SHOW ROUTE
router.get("/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			req.flash("error","No such campground!");
			res.redirect("/campgrounds");
		}else{
			res.render("campgrounds/show", {campground:foundCamp});
		}
	});
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", "Campground doesn't exist");
			return res.redirect("back");
		}else{
			res.render("campgrounds/edit", { campground : foundCampground});
		}
	});
});
	

//UPDATE ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			req.flash("error","Campground not found!");
			res.redirect("/campgrounds");
		}else{
			req.flash("success","Succesfully updated your campground!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("Something went wrong!");
			res.redirect("/campgrounds");
		}else{
			req.flash("success","Succcessfully deleted your campground!");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;