(function () {
    'use strict';
    angular
            .module('app')
            .controller('HomeController', HomeController);
    HomeController.$inject = ['$rootScope', '$scope'];
    function HomeController($rootScope, $scope) {      
    	$rootScope.title = "shenlong-webutl";
        initController();
        function initController() {
           
        }
    }

})();