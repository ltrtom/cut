var inbox = require('inbox'),
    fs    = require('fs'),
    MailParser = require("mailparser").MailParser,
    utils  = require('../utils/utils');


function tojson(obj){
    return JSON.stringify(obj);
}


function createClient(app, req, res){

    var pswd    = req.session.pswd;
    var decrypt = utils.decrypt(pswd, app.get('conf').pass);

    if (!pswd || !decrypt){
        res.redirect('login');
    }

    return inbox.createConnection(false, "imap.gmail.com", {
            secureConnection: true,
            auth:{
                user: app.get('conf').email,
                pass: decrypt
            }
        });
}

exports.add_routes = function(app){
    
    
    // INDEX MAILBOX
    app.get('/mail/:mailbox?', utils.isAuth, function(req, res){  
        
       var mailbox = req.params.mailbox;
       
       if(!mailbox)
           mailbox = app.get('conf').default_mailbox;
       var render = {
           currentMailbox: mailbox
       };
       
       var client = createClient(app, req, res);
        client.connect();
        client.on('connect', function(){
            client.openMailbox(mailbox, function(error, info){
                if(error)
                    throw error;
                client.listMessages(-15, function(err, messages){
                    // take last 15 messages
                    render.messages = messages.reverse();
                    // get all mailboxes
                    client.listMailboxes(function(err, mailboxes){
                        if(err)
                            throw err;
                        render.mailboxes = mailboxes;
                        client.close();
                    });
                });
            });
            
            client.on('close', function(){
                    res.render('inbox', render);
            });         
        });
    });
    
    // SHOW ONE EMAIL
    app.get('/mail/:mailbox/:uid', utils.isAuth, function(req, res){
       var uid = req.param('uid');
       
       var client = createClient(app, req, res);
        client.connect();
        client.on('connect', function(){
            client.openMailbox(req.params.mailbox, function(error, info){
                
                if(error){
                    res.render('message', {
                        error: error
                    });
                    return;
                }
                
                client.fetchData(uid, function(error, message){
                    var body = "";
                    var stream = client.createMessageStream(uid);
                    
                    stream.on('data', function(chunk){
                        body += chunk.toString('utf8');
                    });
                    
                    stream.on('end', function(){
                        var mailparser = new MailParser();
                        
                        mailparser.on('end', function(email){
                            var render = {
                              params: req.params,
                              html: email.html  
                            };
                            
                            if(!render.html){
                                render.txt = email.text
                            }
                            res.render('message', render);
                            client.close();
                        });
                        
                        mailparser.write(body);
                        mailparser.end();
                    });
                    
                });
            });
        });
    });
    
    
    
    app.get('/mail/:mailbox/search/:query', utils.isAuth, function(req, res){
        var client = createClient(app, req, res);
        
        console.log(req.params.query);
        
        client.connect();
        client.on('connect', function(){
            client.openMailbox(req.params.mailbox, function(error, info){
                
                
                var query = {
                    header: ["subject", req.params.query]
                };
                
                client.search(query, function(err, seqs){
                    res.json(seqs);
                });
            });
        });
        
    });
    
    
   // DELETE MESSAGE
   app.get('/mail/:mailbox/:uid/delete', utils.isAuth, function(req, res){
       var client = createClient(app, req, res);
       client.connect();
       client.on('connect', function(){
           client.openMailbox(req.params.mailbox, function(error, info){
               client.deleteMessage(req.params.uid, function(err){
                    if(error){
                        res.render('message', {
                            error: err
                        });
                    }
                    else{
                        res.redirect('/mail/'+req.params.mailbox);
                    }
               });
           });
       });
       
   });
    
    
   // API JSON
    app.get('/api', utils.isAuth,  function(req, res){
    
        var client = createClient(app, req, res);
        client.connect();
        client.on('connect', function(){
            client.openMailbox("INBOX", function(error, info){
                client.listMessages(-10, function(err, messages){
                    res.end(JSON.stringify(messages));
                    client.close();
                });
            });
        });
    });
};