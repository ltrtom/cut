var utils = require('../utils/utils'),
    mongoose = require('mongoose'),
    User = require('../models/user.js');


exports.add_routes = function(app){
  
  app.get('/login', function(req, res){
    res.render('login');
  });

  app.post('/login', function(req, res){

      User.findOne({
          login: req.body.login,
          password: utils.hash(req.body.pass || '')
      }, function(err, user){

          if (err){console.log(err);}

          if (user){
              req.session.user = user;
              req.session.user.plainPassword = req.body.pass;

              if (app.get('conf').env !== 'PRD'){

                  if (!req.session.user.token){

                      req.session.user.token = utils.hash(Math.random().toString());
                      req.session.user.save();

                  }
                  res.cookie('rememberMe', req.session.user.token, { maxAge: 900000, httpOnly: true });
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
  });

  app.post('/services/oauth/login', function(req, res){

      User.findOne({
          login: req.body.login,
          password: utils.hash(req.body.password || '')
      }, function(err, user){

          if (err){console.log(err);}

          if (user){
              user.token = utils.hash(Math.random().toString());

              user.save(function(err, u){

                if (err){console.log(err);}

                res.json(u);
              });
          }
          else{
            res.statusCode = 400;
            res.send('User not found');

          }

      });

  });


 app.get('/services/oauth/me', function(req, res){

     User.findOne({
         token: (req.headers['authorization'] || '').replace('Bearer ', '')
     }, function(err, user){
        if (user){
            res.json(user);
        }
        else{
            res.statusCode = 401;
            res.send('Wrong access token');
        }
     });
 });


  app.get('/logout', function(req, res){
    req.session.destroy(function(){

      res.clearCookie('rememberMe');
      res.redirect('/login');
    });  
  });


}; 