var crypto = require('crypto');


function hash(bytes){
     var shasum = crypto.createHash('sha512');
     shasum.update(bytes);
     return shasum.digest('hex');
}

exports.add_routes = function(app){
  
  app.get('/login', function(req, res){
    res.render('login');
  });

  app.post('/login', function(req, res){
      
      var conf = app.get('conf');
     
     if(req.body.login === conf.login_web && hash(req.body.pass) === conf.pass_web){
         req.session.user = 'tomjam';
         if(req.session.redirect)
            res.redirect(req.session.redirect);
         else
            res.redirect('/');
     }
     else{
         res.render('login',{
             message: 'Login or password wrong',
             lastLogin: req.body.login
         });
     }
  });

  app.get('/logout', function(req, res){
    req.session.destroy(function(){
            res.redirect('/login');
    });
  });

};