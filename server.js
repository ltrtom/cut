// web.js   
var express   = require("express");
	logfmt    = require("logfmt"),
	utils     = require('./utils/utils'),
	path      = require('path'),
	http      = require('http'),
	https     = require('https'),
	fs        = require('fs'),
	commander = require('commander'),
	app       = express();

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
app.set('path', path.dirname(require.main.filename));


//app.use(utils.redirectToHttps);

var controllers = ['LoginCtrl', 'InboxCtrl', 'keepCtrl'];

controllers.forEach(function(crtl){
    var controller = require('./ctrl/'+crtl+'.js');
    controller.add_routes(app);
    
});

// home redirect
app.get('/', utils.isAuth, function(req, res){
    res.render('home');
})


// opt parse
commander
  .option('-c, --certificate-dir <path>', 'SSL certificate dir')
  .parse(process.argv);

console.log('ENV '+ app.get('conf').env);

// the certificates are mandatory to start the server on HTTPS
if (commander.certificateDir){

	var credentials = {
		key: fs.readFileSync(path.join(commander.certificateDir, 'server.key')).toString(),
		cert: fs.readFileSync(path.join(commander.certificateDir, 'server.crt')).toString()
	};
	var httpsServer = https.createServer(credentials, app);
	
	httpsServer.listen(443);
	console.log('listening on port 443');
}


var httpServer = http.createServer(app);
var port = Number(process.env.PORT || 5000);
httpServer.listen(port);
console.log('listening on port '+port);
