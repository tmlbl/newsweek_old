newsweek.run(['$http', '$rootScope', appInit]);

function appInit($http, $rootScope) {
	$http.get('/fx/accounts')
		.success(function (data) {
			$rootScope.accounts = data.accounts;
		});
}
