var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
   
 
var keepSchema = new Schema({
     title: String,
     content: String,
     date: {type: Date, default: Date.now},
     lastMod: Date
});
 
 
module.exports = mongoose.model('Keep', keepSchema);
   