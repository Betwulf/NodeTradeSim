var logger = require('./logger.js');
var yqlp = require('yqlp');



// write to log using log4js
var log = logger.LOG;

function GetDateString(date) {
    return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
}

// GetTickerInfo('AAPL', function (err, jsonResult) {...} );
function GetTickerInfo(ticker, callback)
{
    // In case losers don't give a callback, which would make no sense, but hey.
    callback = callback || function () { };

    ticker = ticker.toUpperCase(); // NOT using toLocaleLowerCase because we are dealing with US stocks
    var pos = ticker.search(/^a-zA-Z\d\-/);
    log.debug("pos = " + pos);
    if (pos !== -1) {
        ticker = ticker.substring(0, pos);
    }
    
    log.info('Getting ticker info for ' + ticker);
    // select Symbol, Name, StockExchange,LastTradePriceOnly from yahoo.finance.quote where symbol in ("YHOO","AAPL","GOOG","MSFT")
    //  'SELECT Date, Adj_Close FROM yahoo.finance.historicaldata WHERE symbol="AAPL" and startDate = "2014-01-01" and endDate = "2014-02-01"'
    yqlp.exec('SELECT Symbol, Name, StockExchange, LastTradePriceOnly from yahoo.finance.quote where symbol in ("' + ticker + '")',
            function yqlResponse(err, YQLPResponse) {
        if (err) {
            log.error('Error trying to call Yahoo using YQLP ', err);
            return callback(err);
        } else {
            if (YQLPResponse.query.count === 0) {
                log.warn('YQLP Count is ZERO: ', ticker);
                var jsonResult = { Symbol: null, Name: null, StockExchange: null, LastTradePriceOnly: null };
                log.debug('YQLP Resp: ', jsonResult);
                return callback(null, jsonResult);
            } else {
                var jsonResult = YQLPResponse.query.results.quote;
                //expected JSON = { LastTradePriceOnly: '77.85', Name: 'American Express', Symbol: 'AXP', StockExchange: 'NYSE' }
                log.debug('YQLP Resp: ', jsonResult);
                return callback(null, jsonResult);
            }
        }
    });
}

function GetTickerPrice(ticker, startDate, endDate, callback) {
    // In case losers don't give a callback, which would make no sense, but hey.
    callback = callback || function () { };
    
    ticker = ticker.toUpperCase(); // NOT using toLocaleLowerCase because we are dealing with US stocks
    var pos = ticker.search(/^a-zA-Z\d\-/);
    log.debug("pos = " + pos);
    if (pos !== -1) {
        ticker = ticker.substring(0, pos);
    }
    var endDateString = GetDateString(endDate);
    var startDateString = GetDateString(startDate);
    
    log.info('Getting prices for ' + ticker + ' from ' + startDateString + ' to ' + endDateString);
    var yquery = 'SELECT * from yahoo.finance.historicaldata where symbol = "' + ticker + '" and startDate = "' + startDateString + '" and endDate = "' + endDateString + '"';
    log.debug("YQL Query: " + yquery);
    yqlp.exec(yquery,
            function yqlResponse(err, YQLPResponse) {
        if (err) {
            log.error('Error trying to call Yahoo using YQLP ', err);
            return callback(err);
        } else {
            if (YQLPResponse.query.count === 0) {
                log.warn('YQLP Count is ZERO: ', ticker);
                var jsonResult = { quote:[] };
                log.debug('YQLP Resp: ', jsonResult);
                return callback(null, jsonResult);
            } else {
                var jsonResult = YQLPResponse.query.results;
                //log.debug('YQLP Resp: ', jsonResult);
                return callback(null, jsonResult);
            }
        }
    });
}


module.exports = {
    GetTickerInfo: GetTickerInfo,
    GetTickerPrice: GetTickerPrice
}