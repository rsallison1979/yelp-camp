require("dotenv").config();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var User = require("./models/user");
var seedDB = require("./seeds");
var Comment = require("./models/comment");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION //
app.use(require("express-session")({
    secret: "application yelp camp authentication",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// ROUTES //
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    // GET ALL CAMPGROUNDS FROM DB //
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    // THE CODE BELOW IS WHAT GETS THE DATA FROM THE FORM ON NEW.EJS //
    // VAR NAME AND IMAGE MATCH THE NAMES FROM THE INPUT FORM ON NEW.EJS //
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    // campgrounds.push(newCampground);
    // CREATE A NEW CAMPGROUND AND SAVE TO DB //
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
    // FIND CAMPGROUND WITH THE PROVIDED ID //
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// COMMENTS ROUTES //
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// AUTH ROUTES //
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }));
    
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// SERVER AND DB CONNECTION //
app.listen(3000, function(){
    console.log("YelpCamp server has started");
});

var db = mongoose.connection;
mongoose.connect("mongodb://" + process.env.DB_USER + ":" + process.env.DB_PASS + process.env.DB_HOST, { useNewUrlParser: true });
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function(){
    console.log("connection open");
});
