var crypto = require('crypto'),
    fs     = require('fs'),
    path   = require('path');


exports.isAuth = function(req, res, next){
	if (req.session.user)
		next();
	else{
		var sess = req.cookies.rememberMe;
		if (sess){

			var filepath = path.join(req.app.get('path'), 'sessions', exports.hash(sess).substr(0, 15));

			fs.readFile(filepath, function (err, data) {
			  if (!err){
			  	var split = data.toString().split(':');
			  	req.session.user = split[0];
			  	req.session.pswd = split[1];
			  	next();
			  }
			  else{
				res.redirect('login');		  	
			  }
			});
		}
		else{
			res.redirect('login');	   
		}
	}
};


exports.encrypt = function(key, text){
	var algorithm = 'aes256'; 
	var cipher = crypto.createCipher(algorithm, key);  
	var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

	return encrypted;
};

exports.decrypt = function(key, encrypted){
	var algorithm = 'aes256', decrypted = null;   

	try{
		var decipher = crypto.createDecipher(algorithm, key);
		decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
	}catch(err){
		return decrypted;
	}
	return decrypted;
};

exports.hash = function(bytes){
	var shasum = crypto.createHash('sha512');
	shasum.update(bytes);
	return shasum.digest('hex');
};


exports.rememberMe = function(app, cookiesid, data){

	var filepath = path.join(app.get('path'), 'sessions', exports.hash(cookiesid).substr(0, 15));

	fs.writeFile(filepath, data, function(err){
		if (err) return console.log(err);
		console.log('DONE : ' +filepath);   
	});
};

exports.removeSess = function(app, cookiesid){

	if (!cookiesid){
		return;
	}

	var filepath = path.join(app.get('path'), 'sessions', exports.hash(cookiesid).substr(0, 15));
	fs.exists(filepath, function(exists){
		if (exists){
			fs.unlink(filepath);
		}
	});
};


exports.getKeysDir = function(app){
	return path.resolve(app.get('path'), '..', 'keys');
};

exports.redirectToHttps = function(req, res, next){
	if (!req.secure){
		var host = req.get('host').split(':')[0]; //remove the port
		res.redirect('https://' + host + req.originalUrl);		
	}
	else{
		next();
	}
}

