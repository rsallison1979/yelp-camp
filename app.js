require("dotenv").config();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
require("./models/campground");
var User = require("./models/user");
// var seedDB = require("./seeds");
require("./models/comment");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
// seedDB();// Seed the database

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// SERVER AND DB CONNECTION //
// app.listen(3000, function(){
//     console.log("YelpCamp server has started"); 
// });

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port);

var db = mongoose.connection;
mongoose.connect("mongodb://" + process.env.DB_USER + ":" + process.env.DB_PASS + process.env.DB_HOST, { useNewUrlParser: true });
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function(){
    console.log("connection open");
});
