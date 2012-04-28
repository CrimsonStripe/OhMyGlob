#!/bin/env node
//  OpenShift sample Node application

var express = require('express');
var fs      = require('fs');
var routes	= require('./routes');
var path 		= require('path');
var walk 		= require('walk');


// Setup Mongo
var Mongolian = require('mongolian');
var server = new Mongolian(
							"ec2-174-129-59-27.compute-1.amazonaws.com",
							"ec2-50-19-137-189.compute-1.amazonaws.com",
							"ec2-184-73-46-2.compute-1.amazonaws.com"
							);
//var server = new Mongolian; // for local db
var db = server.db("test");

//  Local cache for static content [fixed and loaded at startup]
/*
var zcache = { 'index.html': '' };
zcache['index.html'] = fs.readFileSync('./index.html'); //  Cache index.html
*/

// Create "express" server.
var app  = express.createServer();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');

    next();
}

app.configure(function(){
  app.set('views', __dirname + '/public');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
	app.use(express.cookieParser());
	app.use(express.session({ secret: "newevkflsls" }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

/*  =====================================================================  */
/*  Setup route handlers.  */
/*  =====================================================================  */

// ## Load Routes
function bootRoutes(app, db) {
  var dir     = path.join(__dirname, 'routes')
    , walker  = walk.walk(dir, { followLinks: false });
  walker.on('file', function(root, stat, next) {
    if(path.extname(stat.name) === '.js') {
		  require(path.join(root, stat.name))(app, db);
    }
    next();
  });
  walker.on('end', function() {
  });
};

bootRoutes(app, db);

/* OpenShift
// Handler for GET /health
app.get('/health', function(req, res){
    res.send('1');
});

// Handler for GET /asciimo
app.get('/asciimo', function(req, res){
    var link="https://a248.e.akamai.net/assets.github.com/img/d84f00f173afcf3bc81b4fad855e39838b23d8ff/687474703a2f2f696d6775722e636f6d2f6b6d626a422e706e67";
    res.send("<html><body><img src='" + link + "'></body></html>");
});

// Handler for GET /
app.get('/', function(req, res){
    res.send(zcache['index.html'], {'Content-Type': 'text/html'});
});
*/






//  Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP;
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

if (typeof ipaddr === "undefined") {
   console.warn('No OPENSHIFT_INTERNAL_IP environment variable');
}

//  terminator === the termination handler.
function terminator(sig) {
   if (typeof sig === "string") {
      console.log('%s: Received %s - terminating Node server ...',
                  Date(Date.now()), sig);
      process.exit(1);
   }
   console.log('%s: Node server stopped.', Date(Date.now()) );
}

//  Process on exit and signals.
process.on('exit', function() { terminator(); });

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'
].forEach(function(element, index, array) {
    process.on(element, function() { terminator(element); });
});


//  And start the app on that interface (and port).
app.listen(port, ipaddr, function() {
   console.log('%s: Node server started on %s:%d ...', Date(Date.now() ),
               ipaddr, port);
});

