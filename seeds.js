var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://cdn.pixabay.com/photo/2017/07/17/16/04/nature-2512898__340.jpg",
        description: "A nice play with lots of clouds"
    },
    {
        name: "Rocky Hill",
        image: "https://cdn.pixabay.com/photo/2017/10/07/01/01/bach-leek-2825197__340.jpg",
        description: "A nice play with a rocky hill"
    },
    {
        name: "Glacier Bay",
        image: "https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137__340.jpg",
        description: "A nice play with a Glacier"
    }
];

function seedDB(){
    // REMOVE ALL CAMPGROUNDS //
    Comment.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
    });
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed campgrounds");
            // ADD A FEW CAMPGROUNDS //
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("created new comment"); 
                                }
                            });
                    }
                });
            });
        }   
    });
}

module.exports = seedDB;

