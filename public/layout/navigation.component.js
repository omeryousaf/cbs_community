function navigationController(ConfigService, $http) {
	this.selected = 'Account';

	this.selectFromDropdown = function(newSelected) {
		this.selected = newSelected;
		if (newSelected === 'Logout') {
			$http.get(ConfigService.serverIp + '/api/logout');
		}
	};

	this.selectOther = function() {
		this.selected = 'Account';
	};
}

angular.module('navigationComponent', []).component('navigation', {
  templateUrl: 'layout/navigation.template.html',
  controller: ['ConfigService', '$http', navigationController]
});