newsweek.controller('accountCtrl', [
  '$scope', '$http', '$rootScope', accountCtrl]);

function accountCtrl($scope, $http, $rootScope) {
  $scope.acctInfo = [];

  if ($rootScope.accounts) {
    $rootScope.accounts.forEach(function (a) {
      $http.get('/fx/accounts/' + a.accountId)
        .success(function (data) {
          $scope.acctInfo.push(data);
        });
    });
  }
}
