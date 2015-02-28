var config = require('./config.json');
var models = require('./DataModels.js');
var logger = require('./logger.js');
var fs = require('fs');
var path = require('path');
var url = require('url');
var express = require('express');
var hbs = require('hbs');
var db = require('./NodeTradeSimDatabase');
var bodyParser = require('body-parser');


// write to log using log4js
var log = logger.LOG;

//var now = new Date().toJSON(); // .slice(0,10)
log.info("Starting NodeTradeSim...");
log.info("Written by John Placais, (C) 2015 - More than All Rights Reserved.");


// create express logging function
var expresslog = function expressLog(req, res, next) {
    log.debug("Request: " + req.url);
    next(); // Passing the request to the next handler in the stack.
}

// Create an express app
var expressapp = express();

// to support JSON-encoded bodies;
expressapp.use(bodyParser.json());
// to support URL-encoded bodies
expressapp.use(bodyParser.urlencoded({extended: true}));
expressapp.use(expresslog);

try {
    // Setup hbs template engine and express settings
    log.debug("Partials directory: " + path.join(__dirname, config.websitePartialsDirectory));
    hbs.registerPartials(path.join(__dirname, config.websitePartialsDirectory));
    expressapp.set('view engine', 'hbs');
    log.debug("Views directory: " + path.join(__dirname, config.websiteViewsDirectory));
    expressapp.set('views', path.join(__dirname, config.websiteViewsDirectory));
    
    
    // Setup Routes and routing functions
    var websiteDirectory = path.join(__dirname, config.websiteDirectory);
    // Assume Controllers directory in website directory
    var controllerDirectory = path.join(__dirname, config.websiteDirectory + '\\Controllers');
    log.debug('look for controllers: ' + controllerDirectory);
    var controllers = fs.readdirSync(controllerDirectory);
    controllers.forEach(function (ctrlr) {
        log.info('Loading ' + ctrlr);
        var filepath = './Website/Controllers/' + ctrlr;
        log.debug('Controller path: ' + filepath);
        var obj = require(filepath);
        var name = obj.name || name;
        
        // Controllers should export a Register function, by convention
        if (obj.Register) { obj.Register(expressapp, websiteDirectory); }
     });
    

    expressapp.use(express.static(path.join(__dirname, 'Website')));
    expressapp.get('*', function (req, res) {
        log.warn("unhandled: " + req.url);
    });
    
    // Begin Listening
    expressapp.listen(config.listenPort);
} catch (err) {
    log.error('Main listen loop crash', err);
}


