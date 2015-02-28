﻿
// This should run only for Strategy pages
require(['/Scripts/RequireConfig.js'], function (common) {
    require(['jquery', 'knockout', 'strategyVM'], function ($, ko, newViewModel) {
        // Load initial data from Node.js Server
        $(document).ready(function () {
            var viewModel = new newViewModel();
            function loadData() {
                $.getJSON("/Data/Strategy", function (data) {
                    startVMCallback(data);
                });
            }
            
            function startVMCallback(data) {
                ko.applyBindings(viewModel);
                viewModel.ListofStrategies(data.lists);
            };
            
            loadData();
        });
    });
});
