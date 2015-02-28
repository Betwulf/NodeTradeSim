define([
  'jquery',
  'knockout'
], function ($, ko) {

    var shared = {
        
        PostJsonKO:  function (data, jsonURL, successFn, errorFn) {
            var dataJson = ko.toJS(data);
            var dataJsonString = JSON.stringify(dataJson);
            $.ajax( {
                url: jsonURL,
                type: 'post',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                data: dataJsonString,
                success: successFn,
                error: errorFn
            });
        },

        DeleteJsonKO: function (data, jsonURL, successFn, errorFn) {
            var dataJson = ko.toJS(data);
            var dataJsonString = JSON.stringify(dataJson);
            $.ajax( {
                url: jsonURL,
                type: 'delete',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                data: dataJsonString,
                success: successFn,
                error: errorFn
            });
        }

    }; // close shared object
    return shared;
});