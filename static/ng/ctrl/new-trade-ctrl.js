function newTradeCtrl ($scope, $modalInstance, event, trades, $http, $log) {
	$scope.event = event;
	$scope.error = 'ERROR';
	$scope.trade = {
		event: event._id,
		instrument: '',
		units: 0
	};
	$scope.symbols = [
		'EUR_USD', 'EUR_JPY', 'EUR_CHF', 'EUR_GBP',
		'EUR_AUD', 'USD_JPY', 'USD_CAD', 'USD_CHF',
		'GBP_CHF', 'GBP_JPY', 'GBP_USD', 'AUD_USD',
		'AUD_JPY', 'NZD_USD'
	];
	$scope.submit = function () {
		$http.post('/api/trades', $scope.trade)
			.success(function (data) {
				$scope.trade.event = {
					title: event.title
				};
				trades.push($scope.trade);
				$modalInstance.close();
			})
			.error(function (err) {
				$scope.error = err;
				$log.error('Error posting the trade: ', err);
			});
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}

newsweek.controller('newTradeCtrl',
	['$scope', '$modalInstance', 'event', 'trades', '$http', '$log', newTradeCtrl]);
