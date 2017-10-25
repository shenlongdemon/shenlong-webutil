(function () {
    'use strict';

    angular
        .module('app')
        .factory('OrionIFCService', OrionIFCService);

    OrionIFCService.$inject = ['$http', 'Constants'];
    function OrionIFCService($http, Constants) {
        var service = {};
        var API_BASE = Constants.API_BASE;
        var API_GET = Constants.API_GET.replace("{service}", "orion");
        var API_POST = Constants.API_POST;
       
        service.insertFirmware = insertFirmware;
        service.getFirmwares = getFirmwares;
        service.updateFirmware = updateFirmware;
        return service;     

        function insertFirmware(fw) {
            var api = API_POST;
            var str = JSON.stringify(fw);
            var compress = LZString.compressToUTF16(str);

            var obj = { service: "orion", action: "insertFirmware", obj: compress };
            return $http.post(api, obj);
        }
        function getFirmwares() {
            var api = API_GET.replace("{action}", "getFirmwares").replace("{obj}",1);            
            return $http.get(api);
        }
        function updateFirmware(fw) {
            var str = JSON.stringify(fw);
            var compress = LZString.compressToUTF16(str);

            var api = API_POST;
            var obj = { service: "orion", action: "updateFirmware", obj: compress };
            return $http.post(api, obj);
        }
    }

})();
