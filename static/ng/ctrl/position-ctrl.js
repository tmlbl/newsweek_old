newsweek.controller('positionCtrl', [
	'$scope', '$http', '$log', positionCtrl]);

function positionCtrl ($scope, $http, $log) {
	$scope.positions = [
		{
			symbol: 'EUR_USD',
			price: 1.23334
		},{
			symbol: 'EUR_USD',
			price: 1.23334
		},{
			symbol: 'EUR_USD',
			price: 1.23334
		},{
			symbol: 'EUR_USD',
			price: 1.23334
		},{
			symbol: 'EUR_USD',
			price: 1.23334
		},{
			symbol: 'EUR_USD',
			price: 1.23334
		}
	];
}
