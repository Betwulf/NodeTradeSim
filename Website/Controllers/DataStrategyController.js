var logger = require('../../logger.js');
var db = require('../../NodeTradeSimDatabase');
var fs = require('fs');
var path = require('path');
var url = require('url');
var models = require('../../DataModels.js');
var express = require('express');
var hbs = require('hbs');



// Variables
var thisname = 'Data/Strategy';

// write to log using log4js
var log = logger.LOG;

// Create TickerList Database Connection
var strategyDB = db.NewStrategyConnection();


// EXPORTS Register
function Register(expressapp, websiteDirectory) {
    
    log.info("Registering Controller: " + thisname);
    
    // accept the GET request
    expressapp.get('/' + thisname, function (req, res) {
        strategyDB.all(function (err, data) {
            if (err) {
                log.error("Error getting all Lists with cradle.", err);
                return res.send(400);
            } else {
                log.info('Logging all lists from cradle\n', data);
                var jsonResult = new models.NewListofTickerLists('All Lists');
                jsonResult.lists = data;
                return res.send(jsonResult);
            }
        });
    })
    
    
    
    // accept POST request
    expressapp.post('/' + thisname, function (req, res) {
        var data = req.body;
        log.info("Received POST -->", data);
        if (data.id === undefined) {
            strategyDB.save(data, function (err, CradleResponse) {
                if (err) {
                    // Handle error
                    log.error("Trying to post list", err);
                    return res.sendStatus(400);
                } else {
                    // Handle success
                    return res.sendStatus(200);
                }
            });
        } else {
            strategyDB.save(data.id, data, function (err, CradleResponse) {
                if (err) {
                    // Handle error
                    log.error("Trying to post list", err);
                    return res.sendStatus(400);
                } else {
                    // Handle success
                    return res.sendStatus(200);
                }
            });
        }
    })
    
    // accept PUT request
    expressapp.put('/' + thisname, function (req, res) {
        res.send('Got a PUT request');
    })
    
    // accept DELETE request
    expressapp.delete('/' + thisname, function (req, res) {
        var data = req.body;
        log.info("Received DELETE -->", data);
        if (data.id === undefined) {
            strategyDB.remove(data, function (err, CradleResponse) {
                if (err) {
                    // Handle error
                    log.error("Trying to DELETE list item", err);
                    return res.sendStatus(400);
                } else {
                    // Handle success
                    return res.sendStatus(200);
                }
            });
        } else {
            strategyDB.remove(data.id, data, function (err, CradleResponse) {
                if (err) {
                    // Handle error
                    log.error("Trying to DELETE list item", err);
                    return res.sendStatus(400);
                } else {
                    // Handle success
                    return res.sendStatus(200);
                }
            });
        }
    })
}


module.exports = {
    Register: Register,
    name: thisname
}