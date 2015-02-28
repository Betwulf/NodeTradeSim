var config = require('./config.json')
var log4js = require('log4js');

// Configure Logging
log4js.configure(config.logappender);
var logger  = log4js.getLogger(config.logcategory);
logger.setLevel(config.loglevel);

// Set logging as static vaiable outside this file
Object.defineProperty(exports, "LOG", { value : logger, });
