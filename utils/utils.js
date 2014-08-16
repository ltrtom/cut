var crypto = require('crypto');


exports.isAuth = function(req, res, next){
	if (req.session.user)
		next();
	else{
		res.redirect('login');
	}
};


exports.encrypt = function(key, text){
	var algorithm = 'aes256'; 
	var cipher = crypto.createCipher(algorithm, key);  
	var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

	return encrypted;
}

exports.decrypt = function(key, encrypted){
	var algorithm = 'aes256', decrypted = null;

	try{
		var decipher = crypto.createDecipher(algorithm, key);
		decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
	}catch(err){
		return decrypted;
	}
	return decrypted;
}

exports.hash = function hash(bytes){
	var shasum = crypto.createHash('sha512');
	shasum.update(bytes);
	return shasum.digest('hex');
}



