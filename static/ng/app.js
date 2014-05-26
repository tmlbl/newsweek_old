var newsweek = angular.module('newsweek', ['ngRoute', 'ui.bootstrap']);

newsweek.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/events', {
				templateUrl: 'static/ng/tmp/events.html',
				controller: 'eventCtrl'
			})
			.otherwise({
				redirectTo: '/events'
			});
	}]);
