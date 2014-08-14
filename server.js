// web.js   
var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
app.use(express.json());       
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');
app.locals.moment = require('moment');

var confFile = require('./conf/conf.json');
app.set('conf', confFile);


var controllers = ['LoginCtrl', 'InboxCtrl', 'keepCtrl'];

controllers.forEach(function(crtl){
    var controller = require('./ctrl/'+crtl+'.js');
    controller.add_routes(app);
    
});


// home redirect
app.get('/', function(req, res){
    res.render('home');
})



var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});