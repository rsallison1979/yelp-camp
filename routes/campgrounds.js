var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

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

router.post("/", isLoggedIn, function(req, res){
    // THE CODE BELOW IS WHAT GETS THE DATA FROM THE FORM ON NEW.EJS //
    // VAR NAME AND IMAGE MATCH THE NAMES FROM THE INPUT FORM ON NEW.EJS //
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author:author};
    // campgrounds.push(newCampground);
    // CREATE A NEW CAMPGROUND AND SAVE TO DB //
    Campground.create(newCampground, function(err){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    // FIND CAMPGROUND WITH THE PROVIDED ID //
    Campground.findOne({_id:req.params.id}).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND //
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/edit", {campground: foundCampground});
            console.log(foundCampground);
        }
    });  
});


router.put("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE CAMPGROUND //
router.delete("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findOneAndRemove({_id:req.params.id}, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }               
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;