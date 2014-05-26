var newsweek = angular.module('newsweek', ['ngRoute', 'ui.bootstrap']);

newsweek.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/events', {
				templateUrl: 'static/ng/tmp/events.html',
				controller: 'eventCtrl'
			})
			.when('/positions', {
				templateUrl: 'static/ng/tmp/positions.html',
				controller: 'positionCtrl'
			})
			.when('/charts', {
				templateUrl: 'static/ng/tmp/charts.html',
				controller: 'chartCtrl'
			})
			.otherwise({
				redirectTo: '/events'
			});
	}]);
