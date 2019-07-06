var express    = require("express"),
    router     = express.Router({mergeParams : true}),
    Campground = require("../models/campground"),
	middleware = require("../middleware"),
	Comment    = require("../models/comment");

//NEW COMMENT ROUTE
router.get("/new", middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground : campground});	
		}
	});
});

//UPDATE COMMENT ROUTE
router.post("/", middleware.isLoggedIn, function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);
			req.flash("error", "No such campground!");
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error","Something went wrong!");
					console.log(err);
				}else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save(function(err){
						if(err){
							console.log(err);
						}else{
							var url = "/campgrounds/" + campground._id;
							req.flash("success","Successfully added the comment!");
							res.redirect(url);
						}
					});
				}
			});
		}
	});
});

//EDIT ROUTE
router.get("/:com_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.com_id, function(err, foundComment){
			res.render("comments/edit",{campground_id : req.params.id, comment : foundComment });
	});
});

//UPDATE ROUTE
router.put("/:com_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.com_id, req.body.comment, function(err, updatedComment){
		if(err){
			req.flash("error","Something went wrong");
			res.redirect("back");
		}	else{
			req.flash("success","Successfully edited your comment!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/:com_id",middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.com_id, function(err){
		if(err){
			req.flash("error","Something went wrong!");
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;