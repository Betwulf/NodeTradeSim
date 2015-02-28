var logger = require('../../logger.js');
var db = require('../../NodeTradeSimDatabase');
var fs = require('fs');
var path = require('path');
var url = require('url');
var models = require('../../DataModels.js');
var mktdata = require('../../MarketDataSource');
var express = require('express');
var hbs = require('hbs');



// Variables
var thisname = 'Data/TickerPrice';

// write to log using log4js
var log = logger.LOG;

// Create TickerList Database Connection
var listDB = db.NewTickerListConnection();


// EXPORTS Register
function Register(expressapp, websiteDirectory) {
    
    log.info("Registering Controller: " + thisname);
    
    // accept the GET request
    expressapp.get('/' + thisname, function (req, res) {
        log.debug("JSON GET REQUEST: ", req.url);
        var tickervalue = req.query.ticker;
        var startDate = new Date(req.query.startDate);
        var endDate = new Date(req.query.endDate);
        
        if (startDate === null || endDate === null || tickervalue === null) {
            res.sendStatus(400)
        } else {
            
            log.info('Controller: Getting ticker price for ' + tickervalue);
            mktdata.GetTickerPrice(tickervalue, startDate, endDate, function (err, jsonResult) {
                if (err) {
                    log.error("Controller: TickerPrice Error, can't find ticker " + tickervalue);
                    res.sendStatus(400);
                } else {
                    res.send(jsonResult);
                }
            });
        }
    })
};

module.exports = {
    Register: Register,
    name: thisname
}