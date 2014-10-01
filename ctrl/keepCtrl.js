var mongoose = require('mongoose'),
    Keep = require('../models/keep'),
    User = require('../models/user'),
    utils  = require('../utils/utils');

mongoose.connect('mongodb://localhost/keep');


exports.add_routes = function(app){
    
    app.get('/keep', utils.isAuth, function(req, res){
       res.render('keep');
    });

    // API

    // read all
    app.get('/services/keeps', utils.isAuth, function(req, res){
        var query = Keep.find();
        
        // query parameters 
        if(Object.keys(req.query).length > 0){
           var filters = [];
           for(var k in req.query){
               var filter = {};
               var value = req.query[k];

               if (value === 'true' || value === 'false'){
                   filter[k] =  value === 'true' ? true : false;
               }
               else{
                   filter[k] = { $regex: new RegExp(value, 'i')};
               }
               filters.push(filter);
           }

           query.or(filters);
           //console.log(filters);
        }

        query.sort('-lastMod');

        query.exec(function(err, keeps){
            res.json(keeps || err);
        });
    });

    // read one
    app.get('/services/keeps/:id', utils.isAuth, function(req, res){
        Keep.findOne({_id:req.params.id}, function(err, keep){

            if (err){
                res.status(404).end();
            }
            else{
                res.json(keep);
            }
        });
    });


    // create
    app.post('/services/keeps', utils.isAuth, function(req, res){
        var newKeep = new Keep(req.body);
        newKeep.lastMod = new Date();
        
        newKeep.save(function(err, keep){
            if(err){
                res.status(400).json(err);
            }
            else{
                res.status(201).send();
                User.notifyAccess(req.session.user._id);
            }
        });
        User.notifyAccess(req.session.user._id);

    });

    // delete
    app.delete('/services/keeps/:id', utils.isAuth, function(req, res){
       Keep.remove({_id: req.params.id}, function(err){
           if (err){
               res.status(400).end(JSON.stringify(err));
           }
           else{
               res.status(204).end();
           }
       });
    });
    
    // udpate
    app.put('/services/keeps/:id', utils.isAuth, function(req, res){

        var update = req.body;
        update.lastMod = new Date();
        delete update['_id'];

        Keep.findByIdAndUpdate(req.params.id, update, function(err, keep){
            if(err){
                res.status(400).json(err);
                return;
            }
            User.notifyAccess(req.session.user._id);
            res.status(204).end();
        });

    });
    
};