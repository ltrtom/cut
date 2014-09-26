var crypto = require('crypto'),
    fs     = require('fs'),
    path   = require('path'),
    User   = require('../models/user');

exports.isAuth = function(req, res, next){
	if (req.session.user)
		next();
	else{

        // check for a token in the headers
        var token = (req.headers['authorization'] || '').replace('Bearer ', '');
        var sess = req.cookies.rememberMe;

        if(token){
            User.findOne({token: token}, function(err, user){

                if (err){console.log(err);}
                if (user){
                    next();
                }
                else{
                    res.statusCode = 401;
                    res.send('Wrong access token')
                }
            });

        }
        else if (sess){

            User.findOne({token: sess}, function(err, user){

                if (err){console.log(err);}
                if (user){
                    req.session.user = user;
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


exports.redirectToHttps = function(req, res, next){
	if (!req.secure){
		var host = req.get('host').split(':')[0]; //remove the port
		res.redirect('https://' + host + req.originalUrl);		
	}
	else{
		next();
	}
}

