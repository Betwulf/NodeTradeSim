/*
* 
*  Bootstrap file for requirejs
*
*/

require.config({
    baseUrl: '/',
    paths: { 
        jquery: 'Scripts/jquery-1.10.2',
        bootstrap: 'Scripts/bootstrap',
        respond: 'Scripts/respond',
        knockout: 'Scripts/knockout-3.0.0',
        koe: 'Scripts/ko.extenders',
        kom: 'Scripts/ko.mapping',
        knockoutvalidation: 'Scripts/knockout.validation',
        //jqueryv: 'Scripts/jquery.validate',
        //jqueryvo: 'Scripts/jquery.validate.unobtrusive',
        qunit: 'Scripts/qunit-1.14.0',
        // ViewModels
        shared: 'ViewModels/Shared',
        tickerListVM: 'ViewModels/TickerListViewModel',
    },
    shim: {
        jquery: {
            exports: "$"
        },
        knockout: {
            deps: ['jquery'],
            exports: 'ko'
        },
        qunit: {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        }
    }
});

