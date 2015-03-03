define([
    'jquery',
    'knockout',
    'knockoutvalidation',
    'shared'
], function ($, ko, kov, shared) {
    
    // Knockout ViewModel
    var NewStrategyModel = function () {
        var self = this;
        
        
        ////////////////
        // Variables
        
        // The List of Strategies
        self.ListofStrategies = ko.observableArray([]);
        self.ListofTickerLists = ko.observableArray([]);
        
        // A strategy
        self.Strategy = {
            StrategyName: ko.observable().extend({ required: true }),
            StrategyTrainTickerList: ko.observable().extend({ required: true }),
            StrategyRealTickerList: ko.observable().extend({ required: true }),
            StrategyLayers: ko.observableArray([]),
            id: function () { }
        };
        
        // Computed variable that depends on above variables needed to be declared outside.
        self.Strategy.id = ko.computed(function () { return self.Strategy.StrategyName(); });
        // Should remove this after I've learned what's going on
        self.Debug = ko.observable("");
        
        
        
        
        
        // determine if all data is valid and we can save
        self.IsStrategySaveable = ko.computed(function () {
            if (self.Strategy.StrategyName() === undefined) return false;
            if (self.Strategy.StrategyName().length < 1) return false;
            if (self.Strategy.StrategyLayers().length < 1) return false;
            var innerArray = self.Strategy.StrategyLayers();
            return true;
        });
        
        
        
        ////////////////
        // Methods
        
        
        // Should Show Debug Field    
        self.ShowDebug = function () { return self.Debug() !== ""; }
        
        // Take out strategies with no neuron counts
        self.RemoveEmptyItems = function () {
            self.Strategy.StrategyLayers.remove(function (item) {
                return item.neuroncount() === "";
            });
        }
        
        
        // Save a new strategies object, with a list of tickers
        self.SaveStrategy = function () {
            var successFn = function successHandler(data, textStatus, jqHXR) { self.Strategy.StrategyName("Success"); }
            var errorFn = function errorHandler(data, textStatus, jqHXR) { self.Strategy.StrategyName("FAIL"); }
            self.RemoveEmptyItems();
            shared.PostJsonKO(self.Strategy, '/Data/Strategy', successFn, errorFn);
        };
        
        
        // Gets an updated list of strategies
        self.RefreshListofStrategies = function () {
            $.getJSON("/Data/Strategy", function (data) {
                self.List(data.lists);
            });
        }
        
        
        // Internal function to create a new strategy layer, doesn't add it to the observable array of the strategy
        self.CreateNewStrategyLayer = function () {
            return {
                position: ko.observable(0),
                activationfunction: 'Sigmoid Function', 
                neuroncount: ko.observable(1),
                hasbias: ko.observable(true),
                valid: ko.observable(false)
            };
        }
        
        
        // Adds a new stragtegy layer object to the array
        self.AddStrategyLayer = function () {
            // Create the base object for the new item
            var newLayer = self.CreateNewStrategyLayer();
            // Add the item to the observable array
            self.Strategy.StrategyLayers.push(newLayer);
        };
        
        
        // Removes an object from the array
        self.RemoveStrategyLayer = function (item) {
            self.self.Strategy.StrategyLayers.remove(item);
        };
        
        // New Empty object should have 1 empty rows to start
        self.AddStrategyLayer(); // Add a default item
        
    };
    // Return the 'new' ViewModel function
    return NewStrategyModel;
});