var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware= require("../middleware");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

router.get("/", function(req, res){
    // GET ALL CAMPGROUNDS FROM DB //
    Campground.find({}, function(err, campgrounds){
        if(err){
            req.flash("error", "Something went wrong");
        }else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    // THE CODE BELOW IS WHAT GETS THE DATA FROM THE FORM ON NEW.EJS //
    // VAR NAME AND IMAGE MATCH THE NAMES FROM THE INPUT FORM ON NEW.EJS //
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author:author};
    // campgrounds.push(newCampground);
    // CREATE A NEW CAMPGROUND AND SAVE TO DB //
    Campground.create(newCampground, function(err){
        if(err){
            req.flash("error", "Something went wrong");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    // FIND CAMPGROUND WITH THE PROVIDED ID //
    Campground.findOne({_id:req.params.id}).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Something went wrong");   
            res.redirect("back");
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND //
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Something went wrong");
        } else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });  
});


router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE CAMPGROUND //
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findOneAndRemove({_id:req.params.id}, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;