(function () {
    'use strict';

    angular
        .module('app')
        .factory('OrionService', OrionService);

    OrionService.$inject = ['$http', 'Constants'];
    function OrionService($http, Constants) {
        var service = {};
        var API_BASE = Constants.API_BASE;
        var API_GET = Constants.API_GET.replace("{service}", "orion");
        var API_POST = Constants.API_POST;
       
        
        return service;     

      
    }

})();
