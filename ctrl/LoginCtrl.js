var utils = require('../utils/utils')


exports.add_routes = function(app){
  
  app.get('/login', function(req, res){
    res.render('login');
  });

  app.post('/login', function(req, res){
      
      var conf = app.get('conf');
     
     if(req.body.login === conf.login_web && utils.hash(req.body.pass) === conf.pass_web){
         req.session.user = 'tomjam';
         req.session.pswd = req.body.pass

         var sess = utils.hash(Math.random().toString());
         res.cookie('rememberMe', sess, { maxAge: 900000, httpOnly: true });

         if (app.get('conf').env !== 'PRD'){
            utils.rememberMe(app, sess, req.session.user+':'+req.session.pswd);
         }

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
      utils.removeSess(app, req.cookies.rememberMe);
      res.redirect('/login');
    });  
  });

  app.get('/poc', function(req, res){
    res.json(req.cookies);   
  });

}; 