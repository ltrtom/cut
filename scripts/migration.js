var mongoose = require('mongoose'),
    Keep = require('../models/keep.js'),
    User = require('../models/user.js');

mongoose.connect('mongodb://localhost/keep');



//var user = new User({
//    login: "tomjam",
//    password: "b639a4b84da9c76f96d73648653c41830e9ee6e5fa9705caf5e85417a25e5f851def089ef5124374b5fa536c6a556aa700b7c7204c59a88c2f02d3d01b2f6e69",
//    gmailAdress: "ltrtom@gmail.com",
//    gmailPassword: "1dc2b5e260866bb44bcb1009fc93ffb8",
//    token: ""
//});


User.findOne({
    login: "tomjam",
    gmailAdress: "ltrtom@gmail.com"
}, function(err, user){
    console.log(err);
    console.log(user);

    mongoose.disconnect();


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











