var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res){
    // GET ALL CAMPGROUNDS FROM DB //
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

router.post("/", function(req, res){
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

router.get("/new", function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    // FIND CAMPGROUND WITH THE PROVIDED ID //
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;