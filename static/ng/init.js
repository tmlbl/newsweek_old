newsweek.run(['$http', '$rootScope', appInit]);

function appInit($http, $rootScope) {
  $rootScope.loading = true;
  $http.get('/fx/accounts')
      .success(function (data) {
        $rootScope.accounts = data.accounts;
        $rootScope.loading = false;
      });
  $http.get('/fx/instruments')
      .success(function (data) {
        $rootScope.instruments = data;
      });
}
