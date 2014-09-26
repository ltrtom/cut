var mongoose = require('mongoose'),
    Keep = require('../models/keep.js');

mongoose.connect('mongodb://localhost/keep');




var keep = new Keep({
    type: 'list',
    title: "bonjour",
    items: [
        {
            content: "chips",
            done: false
        },
        {
            content: "café",
            done: true
        }
    ],
    archived: false
});


keep.save(function (err, k){
   if (err){throw err;}
   console.log(k);

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











