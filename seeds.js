var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
mongoose.set("useFindAndModify", false);

var data = [
    {
        name: "Cloud's Rest",
        image: "https://cdn.pixabay.com/photo/2017/07/17/16/04/nature-2512898__340.jpg",
        description: "Morbi id ex gravida, suscipit quam quis, mattis lacus. Maecenas sit amet tellus ac dolor rutrum malesuada nec eget nunc. Mauris sed libero fringilla massa cursus placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam et metus facilisis, lobortis quam vitae, porta felis. Mauris ut rhoncus mauris. Donec placerat magna sed placerat dignissim. Donec nec dolor ullamcorper nisi dignissim sodales. Pellentesque sed pulvinar leo, at sodales nulla. Etiam at est ut odio posuere vehicula. Morbi quis sapien ac elit luctus tempus efficitur in tortor. Praesent interdum leo felis, non tempus mi euismod in. Duis nec libero sollicitudin leo lacinia sagittis. Sed blandit turpis sit amet est sollicitudin consequat. Duis tincidunt, purus in consequat sagittis, purus nulla gravida justo, finibus dictum orci neque eget magna. Curabitur nec elit sed erat fermentum commodo."
    },
    {
        name: "Rocky Hill",
        image: "https://cdn.pixabay.com/photo/2017/10/07/01/01/bach-leek-2825197__340.jpg",
        description: "Morbi id ex gravida, suscipit quam quis, mattis lacus. Maecenas sit amet tellus ac dolor rutrum malesuada nec eget nunc. Mauris sed libero fringilla massa cursus placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam et metus facilisis, lobortis quam vitae, porta felis. Mauris ut rhoncus mauris. Donec placerat magna sed placerat dignissim. Donec nec dolor ullamcorper nisi dignissim sodales. Pellentesque sed pulvinar leo, at sodales nulla. Etiam at est ut odio posuere vehicula. Morbi quis sapien ac elit luctus tempus efficitur in tortor. Praesent interdum leo felis, non tempus mi euismod in. Duis nec libero sollicitudin leo lacinia sagittis. Sed blandit turpis sit amet est sollicitudin consequat. Duis tincidunt, purus in consequat sagittis, purus nulla gravida justo, finibus dictum orci neque eget magna. Curabitur nec elit sed erat fermentum commodo."
    },
    {
        name: "Glacier Bay",
        image: "https://cdn.pixabay.com/photo/2018/05/16/15/49/camper-3406137__340.jpg",
        description: "Morbi id ex gravida, suscipit quam quis, mattis lacus. Maecenas sit amet tellus ac dolor rutrum malesuada nec eget nunc. Mauris sed libero fringilla massa cursus placerat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam et metus facilisis, lobortis quam vitae, porta felis. Mauris ut rhoncus mauris. Donec placerat magna sed placerat dignissim. Donec nec dolor ullamcorper nisi dignissim sodales. Pellentesque sed pulvinar leo, at sodales nulla. Etiam at est ut odio posuere vehicula. Morbi quis sapien ac elit luctus tempus efficitur in tortor. Praesent interdum leo felis, non tempus mi euismod in. Duis nec libero sollicitudin leo lacinia sagittis. Sed blandit turpis sit amet est sollicitudin consequat. Duis tincidunt, purus in consequat sagittis, purus nulla gravida justo, finibus dictum orci neque eget magna. Curabitur nec elit sed erat fermentum commodo."
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

