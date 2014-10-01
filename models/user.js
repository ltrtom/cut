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

userSchema.statics.notifyAccess = function(id){

    this.findByIdAndUpdate(id, {lastAccess: new Date()}, function(err, user){
        if(err){
            console.log(err);
        }
        else{
            console.log('User %s has been notified', user.login);
        }

    });

};


module.exports = mongoose.model('User', userSchema);
   