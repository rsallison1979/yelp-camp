require("dotenv").config();
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("libs"));



// Campground.create(
// {
//     name: "Granite Hill",
//     image: "https://cdn.pixabay.com/photo/2017/10/07/01/01/bach-leek-2825197__340.jpg",
//     description: "Really nice campground, nice views"
// }, function(err, campground){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("new campground created");
//         console.log(campground);
//     }
// });


// var campgrounds = [
//     {name: 'Salmon Creek', image: "https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677__340.jpg"},
//     {name: 'Granite Hill', image: "https://cdn.pixabay.com/photo/2017/10/07/01/01/bach-leek-2825197__340.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137__340.jpg"},
//     {name: 'Salmon Creek', image: "https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677__340.jpg"},
//     {name: 'Granite Hill', image: "https://cdn.pixabay.com/photo/2017/10/07/01/01/bach-leek-2825197__340.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137__340.jpg"},
//     {name: 'Salmon Creek', image: "https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677__340.jpg"},
//     {name: 'Granite Hill', image: "https://cdn.pixabay.com/photo/2017/10/07/01/01/bach-leek-2825197__340.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137__340.jpg"}
// ];


app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    // GET ALL CAMPGROUNDS FROM DB //
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else {
            res.render("index", {campgrounds: campgrounds});
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
    res.render("new");
});

app.get("/campgrounds/:id", function(req, res){
    // FIND CAMPGROUND WITH THE PROVIDED ID //
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(3000, function(){
    console.log("YelpCamp server has started");
});

var db = mongoose.connection;
mongoose.connect("mongodb://" + process.env.DB_USER + ":" + process.env.DB_PASS + process.env.DB_HOST, { useNewUrlParser: true });
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function(){
    console.log("connection open");
});
