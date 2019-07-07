var express 	   = require("express"),
 	app 	       = express(),
 	bodyParser     = require("body-parser"),
 	mongoose 	   = require("mongoose"),
	Campground     = require("./models/campground"),
	seedDB         = require("./seeds"),
	passport       = require("passport"),
	LocalStrrategy = require("passport-local"),
	User           = require("./models/user"),
	Comment        = require("./models/comment"),
	flash          = require("connect-flash"),
	methodOverride = require("method-override"),
	PORT           = process.env.PORT || 5000;

var campgroundRoutes  = require("./routes/campgrounds"),
	commentRoutes     = require("./routes/comments"),
	indexRoutes       = require("./routes/index");

mongoose.connect(process.env.DATABASE,{
	useNewUrlParser : true,
	useCreateIndex : true
}).then(()=>{
	console.log("Connected to DB");
}).catch(err =>{
	console.log('ERROR', err.message);
});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash("error"));

//seedDB();

app.use(require("express-session")({
	secret : "eat sleep anime repeat",
	resave : false,
	saveUninitialized : false 
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(PORT, function(){
	console.log(`Yelp Camp serving on ${PORT}`);
});