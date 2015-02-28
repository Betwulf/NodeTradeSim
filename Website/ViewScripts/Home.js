
// This should run only for the Main page
require(['/Scripts/RequireConfig.js'], function (common) { 
    require(['jquery'], function($) {
        // Load initial data from Node.js Server
        $(document).ready(function () {
            $('.Fadein').fadeIn(400);
        });
    });
});
