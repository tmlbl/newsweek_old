newsweek.run(['$http', '$rootScope', appInit]);

function appInit($http, $rootScope) {
	$http.get('/accounts')
		.success(function (data) {
			$rootScope.accounts = data.accounts;
		});
}
