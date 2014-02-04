// DEPENDENCIES
// ============
var express = require("express"),
    http = require("http"),
    port = (process.env.PORT || 8002),
    server = module.exports = express();
var fs = require("fs");
//var request = require('request');
var db = require('../server/db');
var pool = db.create()
var posts = require('./posts')(pool)

// SERVER CONFIGURATION
// ====================
server.configure(function() {
    var oneDay = 86400000;
    server.use(express.compress());
    server.use(express.static(__dirname + "/../public", {
        maxAge: oneDay
    }));
    server.use(express.favicon(__dirname + "/../public/img/favicon.ico"));

    if (process.env.NODE_ENV !== 'production') {

        server.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    }

    server.use(express.bodyParser());
    server.use(server.router);
});

server.get('/featured.json', function(req, res) {
    posts.getAllFeatured(res, req)
});
server.get('/meme/:slug.json', function(req, res) {
    posts.getOne(res, req)
});

server.get('/captions/:cat_id/:sortField/:sortOrder/:after.json', function(req, res) {
    posts.getCaptions(res, req)
});

//handles all other requests to the backbone router
server.get("*", function(req, res) {
    fs.createReadStream(__dirname + "/../public/index.html").pipe(res);
});

// SERVER
// ======

// Start Node.js Server
http.createServer(server).listen(port);

console.log('\nWelcome !\nPlease go to http://localhost:' + port + ' to start using this');

if (process.env.NODE_ENV === 'production') {
    var nullfun = function() {};
    console.log = nullfun;
    console.info = nullfun;
    console.error = nullfun;
    console.warn = nullfun;
}