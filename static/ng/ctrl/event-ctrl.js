newsweek.controller('eventCtrl',
	['$scope', '$http', '$timeout', '$modal', eventCtrl]);

function eventCtrl ($scope, $http, $timeout, $modal) {
	$scope.appName = 'Newsweek';
	// Gets the latest news
	$http.get('/api/events/latest')
		.success(function (data) {
			data = color(data);
			$scope.latestNews = data;
			$scope.nextEvent = nextEvent(data);
		});
	// Gets the latest trades
	$http.get('/api/trades/latest')
		.success(function (data) {
			$scope.trades = data;
			$scope.nextTrade = nextEvent(data);
		});
	// Creates a live time value
	function curTime () {
		$timeout(curTime, 1000);
		$scope.curTime = Date.now();
	}
	curTime();
	// Gets a live instrument price for next event
	function livePrice () {
		$timeout(livePrice, 5000);
		if ($scope.nextEvent) {
			var url = 'http://api-sandbox.oanda.com/v1/prices?instruments=';
			if ($scope.nextTrade) url += $scope.nextTrade.instrument;
			$http({ method: 'GET', url: url })
				.success(function (data) {
					$scope.livePrice = data.prices[0].bid;
				});
		}
	}
	livePrice();
	// Opens the new trade modal
	$scope.newTrade = function (ev) {
		var instance = $modal.open({
			templateUrl: 'static/ng/tmp/tradeModal.html',
			controller: 'tradeCtrl',
			resolve: {
				event: function () {
					return ev;
				},
				trades: function () {
					return $scope.trades;
				}
			}
		});
	};
	// Finds the nextmost event and returns it
	function nextEvent (events) {
		var next;
		var times = [];
		_.map(events, function (ev) {
			times.push(ev.time);
			if (!next || next > ev.time) {
				if (ev.impact != 'Holiday') {
					next = ev.time;
				}
			}
		});
		return events[times.indexOf(next)];
	}
	// Adds the color attr
	function color (events) {
		return _.map(events, function (ev) {
			if (ev.impact == 'High') {
				ev.color = 'danger';
			} else if (ev.impact == 'Medium') {
				ev.color = 'orange';
			} else if (ev.impact == 'Low') {
				ev.color = 'green';
			} else if (ev.impact == 'Holiday') {
				ev.color = 'gray';
			}
			return ev;
		});
	}
}
