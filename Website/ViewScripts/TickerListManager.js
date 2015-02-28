
// This should run only for ListManager pages
require(['/Scripts/RequireConfig.js'], function (common) { 
    require(['jquery', 'knockout', 'tickerListVM'], function($, ko, newViewModel) {
        // Load initial data from Node.js Server
        $(document).ready(function () {
            var viewModel = new newViewModel();
            function loadData() {
                $.getJSON("/Data/TickerList", function (data) {
                    startVMCallback(data); 
                });    
            }

            function startVMCallback(data) {
                ko.applyBindings(viewModel);
                viewModel.ListofLists(data.lists);
            };

            loadData();
        });
    });
});
