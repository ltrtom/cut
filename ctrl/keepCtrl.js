var mongoose = require('mongoose'),
    Keep = require('../models/keep.js'),
    utils  = require('../utils/utils');

mongoose.connect('mongodb://localhost/keep');


exports.add_routes = function(app){
    
    app.get('/keep', utils.isAuth, function(req, res){
       res.render('keep');
    });

    // API

    // read all
    app.get('/api/keeps', utils.isAuth, function(req, res){
        var query = Keep.find();
        
        // query parameters 
        if(Object.keys(req.query).length > 0){
           var filters = [];
           for(var k in req.query){
               var filter = {};
               filter[k] = { $regex: new RegExp(req.query[k], 'i')};
               filters.push(filter);
           }
           query.or(filters);
        }
        
        query.exec(function(err, keeps){
            res.json(keeps || err);
        });
    });
    
    // read one
    app.get('/api/keeps/:id', utils.isAuth, function(req, res){
        Keep.findOne({_id:req.params.id}, function(err, keep){
            res.json(keep || err);
        });
    });
    
    // create 
    app.post('/api/keeps', utils.isAuth, function(req, res){
        var newKeep = new Keep(req.body);
        newKeep.lastMod = new Date();
        
        newKeep.save(function(err, keep){
            if(err){
                res.statusCode = 400;
                res.json(err);
            }
            else{
                res.statusCode = 201;
                res.send('');
            }
        });
    });
    
    
    // delete
    app.delete('/api/keeps/:id', utils.isAuth, function(req, res){
       Keep.remove({_id: req.params.id}, function(err){
            res.statusCode = err ? 400 : 204;
            res.end(err ? JSON.stringify(err) : '');
       }); 
    });
    
    // udpate
    app.put('/api/keeps/:id', utils.isAuth, function(req, res){
        Keep.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content,
            lastMod: new Date()
        }, function(err, keep){
            if(err){
                res.statusCode = 400;
                res.json(err);
                return;
            }
            res.statusCode = 204;
            res.end();
        });
    });
    
};