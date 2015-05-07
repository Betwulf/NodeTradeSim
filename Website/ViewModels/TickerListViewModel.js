
define([
  'jquery',
  'knockout',
  'knockoutvalidation',
  'shared'
], function ($, ko, kov, shared) {

// Knockout ViewModel
var NewTickerListModel = function () {
    var self = this;

    ////////////////
    // Variables
    self.tickerEmptyErrorMessage = "Please enter a ticker symbol";
    self.tickerNotFoundErrorMessage = "Ticker symbol not found";
    self.tickerNotValidErrorMessage = "Ticker symbol badly formatted, try again";
    self.ListofLists = ko.observableArray([]);
    self.TickerList = {
        ListName: ko.observable().extend( { required: true } ),
        ListOfTickers: ko.observableArray([]),
        id: function() {}
    };

    // Computed variable that depends on above variables needed to be declared outside.
    self.TickerList.id = ko.computed(function() { return self.TickerList.ListName(); });
    // Should remove this after I've learned what's going on
    self.Debug = ko.observable("");

    // determine if all data is valid and we can save
    self.IsTickerListSaveable = ko.computed(function () {
        if (self.TickerList.ListName() === undefined) return false;
        if (self.TickerList.ListName().length < 1) return false;
        if (self.TickerList.ListOfTickers().length < 1) return false;
        var innerArray = self.TickerList.ListOfTickers();
        for (var i = 0; i < innerArray.length; i++) {
            //alert(" Status: " + innerArray[i].valid() + " " + innerArray[i].newRow());
            if ((innerArray[i].valid() || innerArray[i].newRow()) === false) return false;
        }
        return true;
    });

    ////////////////
    // Methods

    // Should Show Debug Field    
    self.ShowDebug = function () { return self.Debug() !== ""; }


    // Take out tickers with no ticker symbol
    self.RemoveEmptyItems = function () {
        self.TickerList.ListOfTickers.remove(function(item) { 
            return item.ticker() === "";
        });
    }


    // JSON Call to find out if a ticker is valid
    self.TickerLookup = function (ticker, action) {
        if (typeof ticker === "string") {
             $.getJSON("/Data/TickerLookup?ticker=" + ticker, function (data) {
                self.Debug(JSON.stringify(data));
                action(data);
            });
        }
    }


    // Save a new TickerList object, with a list of tickers
    self.SaveTickerList = function () {
        var successFn = function successHandler(data, textStatus, jqHXR) { self.TickerList.ListName("Success"); }
        var errorFn = function errorHandler(data, textStatus, jqHXR) { self.TickerList.ListName("FAIL"); }
        self.RemoveEmptyItems();
        ko.utils.arrayForEach(self.TickerList.ListOfTickers(), function(item) { 
            var currentTicker = item.ticker();
            item.ticker(currentTicker.toUpperCase());
        });
        shared.PostJsonKO(self.TickerList, '/Data/TickerList', successFn, errorFn);
    };


    // Save a new TickerList object, with a list of tickers
    self.DeleteTickerList = function () {
        var successFn = function successHandler(data, textStatus, jqHXR) { self.TickerList.ListName("Success"); }
        var errorFn = function errorHandler(data, textStatus, jqHXR) { self.TickerList.ListName("FAIL"); }
        shared.DeleteJsonKO(self.TickerList, '/Data/TickerList', successFn, errorFn);
    };


    // Gets an updated list of Ticker Lists
    self.RefreshListofLists = function () {
        $.getJSON("/Data/TickerList", function (data) {
            self.ListOfTickers(data.lists);
        });
    }

    // Internal function to create a new ticker item, doesn't add it to the observable array
    self.CreateNewTickerItem = function() {
        return { 
            ticker: ko.observable(""),
            tickerdescription: ko.observable(self.tickerEmptyErrorMessage), 
            weight: 100,
            valid: ko.observable(false),
            newRow: ko.observable(true)
        };
    }

    // Adds a new tickerlist object to the array
    self.AddTickerItem = function() {
        // Create the base object for the new item
        var newItem = self.CreateNewTickerItem();
        // subscribe to changes in the ticker name to update the description
        newItem.ticker.subscribe( function TickerItemSubscribe(newValue) { 
            if (newItem.newRow()) {
                newItem.newRow(false);
                self.AddTickerItem(); // Add a default item
            }
            // Check if valid characters in ticker
            var pos = newValue.search(/[^a-zA-Z\d\-]/);
            if (pos !== -1) {
                newItem.tickerdescription(self.tickerNotValidErrorMessage);
            }
            else {
                // Do the lookup
                self.TickerLookup(newValue, function TickerLookupHandler(data) { 
                    if (data.StockExchange === null) {
                        var tempVal = newItem.ticker();
                        newItem.ticker(tempVal+" ?");
                        newItem.tickerdescription(self.tickerNotFoundErrorMessage);
                        newItem.valid(false);
                    } else {
                        newItem.tickerdescription(data.Name);
                        newItem.valid(true);
                    }
                });
            }
        });
        // Add the item to the observable array
        self.TickerList.ListOfTickers.push(newItem);
    };

    // Removes an object from the array
    self.removeTickerItem = function(item) {
        self.TickerList.ListOfTickers.remove(item);
    };


    // Sort ticker items in the array
    self.SortByName = function() {
        self.TickerList.ListOfTickers.sort(function(a, b) {
            return a.name < b.name ? -1 : 1;
        });
    };
 
    // New Empty object should have 1 empty rows to start
    self.AddTickerItem(); // Add a default item

};


    // Return the 'new' ViewModel function
    return NewTickerListModel;
});

