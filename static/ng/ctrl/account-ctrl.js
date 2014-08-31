newsweek.controller('accountCtrl', [
  '$scope', '$http', '$rootScope', accountCtrl]);

function accountCtrl($scope, $http, $rootScope) {
  $scope.acctInfo = [];
  $scope.loading = true;

  if ($rootScope.accounts) {
    getAccountDetails();
  } else {
    $http.get('/fx/accounts')
        .success(function (data) {
          $rootScope.accounts = data.accounts;
          getAccountDetails();
        });
  }

  function getAccountDetails() {
    $rootScope.accounts.forEach(function (a) {
      $http.get('/fx/accounts/' + a.accountId)
          .success(function (data) {
            $scope.acctInfo.push(data);
            $scope.loading = false;
          });
    });
  }
}
