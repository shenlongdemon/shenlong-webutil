(function () {
	'use strict';
	angular
            .module('app')
            .controller('OrionIFCController', OrionIFCController);
	OrionIFCController.$inject = ['$rootScope', '$scope', "OrionIFCService"];
	function OrionIFCController($rootScope, $scope, OrionIFCService) {
		$rootScope.title = "Orion Service";
		
		$scope.FWs = [];

		$scope.FW = {};
		$scope.FW.settings = [];
		$scope.FW.updateFirmwares = [];


		$scope.setting = {};
		$scope.settingExists = {};
		$scope.firmware = {};
		$scope.firmwareExists = {};
		$scope.insertFirmware = insertFirmware;
		$scope.addSetting = addSetting;
		$scope.addSettingExists = addSettingExists;
		$scope.addFirmware = addFirmware;
		$scope.removeSetting = removeSetting;
		$scope.removeFirmware = removeFirmware;
		$scope.removeAddingSetting = removeAddingSetting;
		$scope.removeAddingFirmware = removeAddingFirmware;
		$scope.updateFirmware = updateFirmware;
		$scope.addFirmwareExists = addFirmwareExists;
		initController();
		function initController() {
			loadFWs();
		}
		function loadFWs() {
		    OrionIFCService.getFirmwares().success(function (res) {
				$scope.FWs = res.Data;				
			})
            .error(function () {
            });
		}
		
		function addSetting() {
			$scope.FW.settings.push({ name: $scope.setting.name, data: $scope.setting.data });
			$scope.setting = {};
		}
		function addSettingExists(FWid) {
			var item = $scope.FWs[FWid];
			item.settings.push({ name: $scope.settingExists.name, data: $scope.settingExists.data });
			$scope.settingExists = {};
		}
		function addFirmware() {
			$scope.FW.updateFirmwares.push({ display: $scope.firmware.display, name: $scope.firmware.name, data: $scope.firmware.data });
			$scope.firmware = {};
		}
		function addFirmwareExists(FWid) {
			var item = $scope.FWs[FWid];
			item.updateFirmwares.push({ display: $scope.firmwareExists.display, name: $scope.firmwareExists.name, data: $scope.firmwareExists.data });
			$scope.firmwareExists = {};
		}
		function removeSetting(FWid, settingIndex) {
			var item = $scope.FWs[FWid];
			item.settings.splice(settingIndex, 1);
		}
		function removeFirmware(FWid, firmwareIndex) {
			var item = $scope.FWs[FWid];
			item.updateFirmwares.splice(firmwareIndex, 1);
		}
		
		function updateFirmware(FWid) {
			var item = $scope.FWs[FWid];
		    OrionIFCService.updateFirmware(item).success(function (res) {
				window.location.reload();
			})
            .error(function () {
            });
		}
		
		function removeAddingFirmware(idx) {
		    $scope.FW.updateFirmwares.splice(idx, 1);
		}
		function removeAddingSetting(idx) {
		    $scope.FW.settings.splice(idx, 1);
		}
		function insertFirmware() {
		    OrionIFCService.insertFirmware($scope.FW).success(function (res) {
				window.location.reload();
			})
            .error(function () {
            });;
		}
	}

})();