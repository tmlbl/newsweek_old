newsweek.controller('positionCtrl', [
	'$scope', '$http', '$log', '$rootScope', positionCtrl]);

function positionCtrl ($scope, $http, $log, $rootScope) {

	$scope.positions = [];

	$rootScope.accounts.forEach(function (acct) {
		$http.get('/fx/accounts/' + acct.accountId + '/positions')
			.success(function (data) {
				$scope.positions = $scope.positions.concat(data.positions);
			})
			.error(function (err) {
				$log.error(err);
			});
	});

}
