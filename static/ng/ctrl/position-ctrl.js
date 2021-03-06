newsweek.controller('positionCtrl', [
	'$scope', '$http', '$log', '$rootScope', positionCtrl]);

function positionCtrl ($scope, $http, $log, $rootScope) {

	$scope.positions = [];
  $rootScope.loading = true;

  if ($rootScope.accounts) {
    getPositions();
  } else {
    $http.get('/fx/accounts')
        .success(function (data) {
          $rootScope.accounts = data.accounts;
          getPositions();
        });
  }

  function getPositions() {
    $rootScope.accounts.forEach(function (acct) {
      $http.get('/fx/accounts/' + acct.accountId + '/positions')
          .success(function (data) {
            $scope.positions = $scope.positions.concat(data.positions);
            $rootScope.loading = false;
          })
          .error(function (err) {
            $log.error(err);
            $rootScope.loading = false;
          });
    });
  }

}
