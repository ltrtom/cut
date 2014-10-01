var mongoose = require('mongoose'),
    Keep = require('../models/keep.js'),
    User = require('../models/user.js');

mongoose.connect('mongodb://localhost/keep');


Keep.findByIdAndUpdate("5428056a032fbf601126a681", {archived:true}, function(err, keep){
    if(err){
        console.log(err);
    }
    mongoose.disconnect();
});

//var query = Keep.find({ archived: { $in: [false] }});
//
//query.exec(function(err, keeps){
//
//    if(err){
//        console.log(err);
//    }
//    console.log(keeps);
//    mongoose.disconnect();
//});
//


//Keep.find(function(err, keeps){
//
//    if (err){ throw err;}
//    keeps.forEach(function(keep){
//        console.log(keep.title);
//    });
//
//    mongoose.disconnect();
//});








