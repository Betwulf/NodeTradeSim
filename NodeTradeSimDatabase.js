var config = require('./config.json');
var logger = require('./logger.js');
var cradle = require('cradle');



// write to log using log4js
var log = logger.LOG;


var c = new (cradle.Connection)(config.cradleIP, config.cradlePort, { auth: { username: config.cradleLogin, password: config.cradlePassword } });

function NewTickerListConnection() {
    var listDB = c.database(config.cradleDBTickerList);
       
    listDB.exists(function (err, exists) {
        if (err) {
            log.error('Error trying to access ' + config.cradleDBList + ' in CouchDB at ' + config.cradleIP, err);
        } else if (exists) {
            log.info('tickerlist Database exists.');
        } else {
            log.info('Creating tickerlist Database.');
            listDB.create();
        }
    });
    return listDB;
};




function NewStrategyConnection() {
    var strategyDB = c.database(config.cradleDBStrategy);
    
    strategyDB.exists(function (err, exists) {
        if (err) {
            log.error('Error trying to access ' + config.cradleDBList + ' in CouchDB at ' + config.cradleIP, err);
        } else if (exists) {
            log.info('strategyDB Database exists.');
        } else {
            log.info('Creating strategyDB Database.');
            strategyDB.create();
        }
    });
    return strategyDB;
};



module.exports = {
    NewTickerListConnection: NewTickerListConnection,
    NewStrategyConnection: NewStrategyConnection
}