newsweek.controller('positionCtrl', [
	'$scope', '$http', positionCtrl]);

function positionCtrl ($scope, $http) {
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
		}
	];	
}
