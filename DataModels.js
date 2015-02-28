
// List all Model 'constructors' here

// Basic Time Series to be used for getting ticker adjusted closing valuations over time from Yahoo
var NewTimeSeries = function(date, value) {
    var self = this;
    self.date = date;
    self.value = value;
}

// represents a ticker on a stock market somewherez
var NewTicker = function (ticker, name) {
    var self = this;
    self.ticker = ticker;
    self.timeseries = [];
}

// Represents a list of tickers above
var NewTickerList = function (ListName) {
    var self = this;
    self.ListName = ListName;
    self.ListOfTickers = [];
}

// Represents all lists of tickers known (list of above)
var NewListofTickerLists = function (name) {
    var self = this;
    self.name = name;
    self.lists = [];
}


// Represents all lists of strategies known (list of above)
var NewListofStrategies = function (name) {
    var self = this;
    self.name = name;
    self.lists = [];
}


// Exports
module.exports = {
    NewTimeSeries : NewTimeSeries, 
    NewTicker : NewTicker, 
    NewTickerList : NewTickerList, 
    NewListofTickerLists : NewListofTickerLists
};
