
// This should run only for Testing ListManager pages
require(['/Scripts/RequireConfig.js'], function (common) { 
    require(['jquery', 'knockout', 'tickerListVM', 'qunit'], function($, ko, newViewModel, QUnit) {

        // Start Module with any initialization
        module( "TickerListVM Tests", {
            setup: function() {
                //ok( true, "Begin Module - TickerListVM Tests" );
            }, 
            teardown: function() {
                //ok( true, "End Module - TickerListVM Tests" );
            }
        });

        // Start with basic checking 
        QUnit.test( "Does the viewModel module Exist", function() {
            var viewModel = new newViewModel();
            QUnit.expect(3);
            ok( ko !== undefined, "Knockout is defined");
            ok( viewModel !== undefined, "viewModel is defined");
            ok( viewModel.TickerList.ListOfTickers().length === 1, "Ticker List has 1 empty ticker by default");
        });

        // Test Basic ViewModel Functions
        QUnit.test( "Testing viewModel functions", function() {
            var viewModel = new newViewModel();
            QUnit.expect(4);
            viewModel.TickerList.ListOfTickers.removeAll();
            ok (viewModel.TickerList.ListOfTickers().length === 0, "Emptied the ticker list");

            var item = { name: 'Test', id: 0 };
            viewModel.TickerList.ListOfTickers.push( item );
            ok (viewModel.TickerList.ListOfTickers().length === 1, "pushed 1 to the ticker list");

            viewModel.removeTickerItem(function (item) { return item.name === 'Test'});
            ok (viewModel.TickerList.ListOfTickers().length === 0, "Test Remove ticker item");

            viewModel.AddTickerItem();
            ok (viewModel.TickerList.ListOfTickers().length === 1, "Test Add ticker item");
        });


        // Test JSON Calls
        QUnit.asyncTest( "Testing JSON functions", function() {
            var viewModel = new newViewModel();
            QUnit.expect(3);
            viewModel.TickerList.ListOfTickers.removeAll();
            ok (viewModel.TickerList.ListOfTickers().length === 0, "Emptied the ticker list");
            
            // setup data
            viewModel.TickerList.ListName('Test');
            var item = { ticker: 'Test', tickerdescription: 'Test', weight: 100 };
            viewModel.TickerList.ListOfTickers.push( item );
            ok (viewModel.TickerList.ListOfTickers().length === 1, "pushed 1 to the ticker list");

            // Save
            QUnit.stop(); // needed for async call
            viewModel.SaveTickerList();

            jQuery( document ).one( "ajaxStop", function() {
                ok (viewModel.TickerList.ListName() === 'Success', "SaveTickerList.");
			    jQuery( document ).off("ajaxError.passthru");
			    start(); // let QUnit know we can continue the testing
		    });

            // TODO: Fix this - versioning issues with CouchDB cause this test to fail on 2nd time
            // Delete
            //viewModel.TickerList.ListName('Test');
            //viewModel.DeleteTickerList();
            //ok (viewModel.TickerList.ListName() === 'Success', "DeleteTickerList.");


        });



        // start QUnit.
        QUnit.load();
        QUnit.start();

    });
});


