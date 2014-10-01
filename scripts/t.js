var mongoose = require('mongoose'),
    Keep = require('../models/keep'),
    User = require('../models/user');

mongoose.connect('mongodb://localhost/keep');



User.findOne({login: 'tomjam'}, function(err, user){
    if(err){
        console.log(err);
    }
    else{
        console.log(user.token);
    }
});




//Keep.find(function(err, keeps){
//
//    if (err){ throw err;}
//    keeps.forEach(function(keep){
//        console.log(keep.title);
//    });
//
//    mongoose.disconnect();
//});











