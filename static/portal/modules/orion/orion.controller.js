(function () {
	'use strict';
	angular
            .module('app')
            .controller('OrionController', OrionController);
	OrionController.$inject = ['$rootScope', '$scope', "OrionService"];
	function OrionController($rootScope, $scope, OrionService) {
		$rootScope.title = "Orion Service";
		
		
		function initController() {
			
		}
		
	}

})();