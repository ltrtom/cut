var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
   
 
var keepSchema = new Schema({
     title: String,
     content: String,
     type: String,
     items: Array,
     archived: {type: Boolean, default: false},
     date: {type: Date, default: Date.now},
     lastMod: {type: Date, default: null}


});

module.exports = mongoose.model('Keep', keepSchema);
   