var inbox = require('inbox'),
    fs    = require('fs'),
    MailParser = require("mailparser").MailParser;

function isAuth(req, res, next){
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}



function createClient(app){
    return inbox.createConnection(false, "imap.gmail.com", {
            secureConnection: true,
            auth:{
                user: app.get('conf').email,
                pass: app.get('conf').pass
            }
        });
}

exports.add_routes = function(app){
    
    
    // INDEX MAILBOX
    app.get('/', isAuth, function(req, res){  
        
       
       var client = createClient(app);
        client.connect();
        client.on('connect', function(){
            client.openMailbox("INBOX", function(error, info){
                client.listMessages(-15, function(err, messages){
                    res.render('home', {
                        messages: messages.reverse()
                    });
                    client.close();
                });
            });
        });
    });
    
    // SHOW ONE EMAIL
    app.get('/email/:uid', isAuth, function(req, res){
       var uid = req.param('uid');
       
       var client = createClient(app);
        client.connect();
        client.on('connect', function(){
            client.openMailbox("INBOX", function(error, info){
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
                              html: email.html  
                            };
                            
                            if(!render.html){
                                render.txt = email.text
                            }
                            res.render('message', render);
                        });
                        
                        mailparser.write(body);
                        mailparser.end();
                    });
                    
                });
            });
        });
    });
    
    
    
   // API JSON
    app.get('/api', isAuth,  function(req, res){
    
        var client = createClient(app);
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