var Campground = require("../models/campground"),
	Comment    = require("../models/comment");

var middlewareObj={
	checkCampgroundOwnership : function (req, res, next){
		if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, foundCampground){
				if(err){
					req.flash("error", "Campground not gound");
					res.redirect("back");
				}else{
					if(foundCampground.author.id.equals(req.user.id)){
						next();
					}else{
						req.flash("error", "You don't have permission for that!");
						res.redirect("back");
					}
				}
			});
		}else{
			req.flash("error", "You need to be logged in to do that!");
			res.redirect("/login");
		}
	},
	checkCommentOwnership : function(req, res, next){
		if(req.isAuthenticated()){
			Comment.findById(req.params.com_id, function(err, foundComment){
				if(err){
					req.flash("error", "No such comment");
					res.redirect("back");
				}else{
					if(foundComment.author.id.equals(req.user._id)){
						next();
					}else{
						req.flash("error","You don't have permission to do that!");
						res.redirect("back");
					}
				}
			});
		}else{
			req.flash("error", "You need to be logged in to do that!");
			res.redirect("/login");
		}	
	},
	isLoggedIn : function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("/login");
	}
};

module.exports = middlewareObj;