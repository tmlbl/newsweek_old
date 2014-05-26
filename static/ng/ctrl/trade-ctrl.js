newsweek.controller('tradeCtrl',
	['$scope', '$modalInstance', 'event', tradeCtrl]);

function tradeCtrl ($scope, $modalInstance, event) {
	$scope.event = event;
	$scope.symbols = [
		'EUR_USD', 'EUR_JPY', 'EUR_CHF', 'EUR_GBP',
		'EUR_AUD', 'USD_JPY', 'USD_CAD', 'USD_CHF',
		'GBP_CHF', 'GBP_JPY', 'GBP_USD', 'AUD_USD',
		'AUD_JPY', 'NZD_USD'
	];
	$scope.ok = function () {
		$modalInstance.close();
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}
