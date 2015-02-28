var logger = require('../../logger.js');
var fs = require('fs');
var path = require('path');
var url = require('url');
var express = require('express');
var hbs = require('hbs');



// Variables
var thisname = 'Strategies';

// write to log using log4js
var log = logger.LOG;



function BuildPath(websiteDirectory, name) {
    log.debug("BuildPath: " + websiteDirectory + '\\Views\\' + name + 'View');
    return websiteDirectory + '\\Views\\' + name + 'View';
}


// EXPORTS Register
function Register(expressapp, websiteDirectory) {
    log.info("Registering Controller: " + thisname);
    // accept the GET request
    expressapp.get('/' + thisname, function (req, res) {
        res.render(BuildPath(websiteDirectory, thisname));
    })
    
    // accept POST request
    expressapp.post('/' + thisname, function (req, res) {
        res.send('Got a POST request');
    })
    
    // accept PUT request
    expressapp.put('/' + thisname, function (req, res) {
        res.send('Got a PUT request');
    })
    
    // accept DELETE request
    expressapp.delete('/' + thisname, function (req, res) {
        res.send('Got a DELETE request');
    })
}


module.exports = {
    Register: Register,
    name: thisname
}