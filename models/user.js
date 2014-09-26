var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
   
 
var userSchema = new Schema({
     login: String,
     password: String,
     gmailAdress: String,
     gmailPassword: String,
     token: String,
     lastAccess: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);
   