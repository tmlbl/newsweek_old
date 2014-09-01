function newTradeCtrl ($scope, $modalInstance, event, trades,
                       $http, $log, symbols) {
	$scope.event = event;

	$scope.trade = {
		event: event._id,
		instrument: '',
		units: 0
	};
	$scope.symbols = symbols;
	$scope.submit = function () {
		$http.post('/api/trades', $scope.trade)
			.success(function (data) {
				$scope.trade.event = {
					title: event.title
				};
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
	['$scope', '$modalInstance', 'event', 'trades', '$http',
    '$log', 'symbols', newTradeCtrl]);
