
function editTradeCtrl ($scope, $modalInstance, trade, $http) {
	$scope.trade = new Object(trade);
	$scope.submit = function () {
		$http.put('/api/trades/' + trade._id, $scope.trade)
			.success(function () {
				$modalInstance.close();
			});
	};
	$scope.delete = function () {
		$http.delete('/api/trades/' + trade._id)
			.success(function () {
				trade = {};
				$modalInstance.close();
			});
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}

newsweek.controller('editTradeCtrl',
	['$scope', '$modalInstance', 'trade', '$http', editTradeCtrl]);
