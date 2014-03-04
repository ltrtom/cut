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


var loginCtrl = require('./ctrl/LoginCtrl.js');
var inboxCtrl = require('./ctrl/InboxCtrl.js');
loginCtrl.add_routes(app);
inboxCtrl.add_routes(app);


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});