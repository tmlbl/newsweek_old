newsweek.controller('chartCtrl',
	['$scope', '$http', chartCtrl]);

function chartCtrl ($scope, $http) {
	var url = 'http://api-sandbox.oanda.com/';
	url += 'v1/candles?instrument=';
	url += 'EUR_USD';
	url += '&count=100&candleFormat=midpoint';
	$http({ method: 'GET', url: url })
		.success(function (data) {
			$scope.data = data;
			console.log(data);
		});
}
