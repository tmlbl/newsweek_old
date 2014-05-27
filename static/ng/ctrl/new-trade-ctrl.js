newsweek.controller('newTradeCtrl',
	['$scope', '$modalInstance', 'event', 'trades', '$http', newTradeCtrl]);

function newTradeCtrl ($scope, $modalInstance, event, trades, $http) {
	$scope.event = event;
	$scope.trade = {
		time: event.time,
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
			.success(function (data, status) {
				$scope.trade.event = {
					title: event.title
				};
				trades.push($scope.trade);
				$http.put('/api/events/' + event._id, { trading: true })
					.success(function (data, status) {
						event.trading = true;
						$modalInstance.close();
					});
			});
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}
