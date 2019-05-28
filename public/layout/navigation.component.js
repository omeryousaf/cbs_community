import angular from 'angular';

function navigationController(ConfigService, $http) {
	this.selected = 'Account';

	this.selectNavbarItem = function(newSelected, isInsideDropdown) {
		if (isInsideDropdown) {
			this.selected = newSelected;
		}
		if (newSelected === 'Logout') {
			$http.get(ConfigService.serverIp + '/api/logout').catch(function(error) {});
		}
	};
}

angular.module('navigationComponent', []).component('navigation', {
  templateUrl: 'layout/navigation.template.html',
  controller: ['ConfigService', '$http', navigationController]
});