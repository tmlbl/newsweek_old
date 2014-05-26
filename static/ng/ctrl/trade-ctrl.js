newsweek.controller('tradeCtrl',
	['$scope', '$modalInstance', 'event', tradeCtrl]);

function tradeCtrl ($scope, $modalInstance, event) {
	$scope.trading = event.title;
	$scope.ok = function () {
		$modalInstance.close();
	}
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	}
}
