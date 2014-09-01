
function eventCtrl ($scope, $http, $timeout, $modal, $log) {
	// Gets the upcoming news
	$http.get('/api/events/latest')
		.success(function (data) {
			data = color(data);
			$scope.latestNews = data;
			$scope.nextEvent = nextEvent(data);
		});

	// Gets the latest trades
  function getTrades() {
    $http.get('/api/trades/latest')
        .success(function (data) {
          $scope.trades = data;
          $scope.nextTrade = nextEvent(data);
        })
        .error(function (data) {
          $log.error(data);
        });
  }
  getTrades();

	// Creates a live time value
	function curTime () {
		$timeout(curTime, 1000);
		$scope.curTime = Date.now();
	}
	curTime();

	// Opens the new trade modal
	$scope.newTrade = function (ev) {
		var instance = $modal.open({
			templateUrl: 'static/ng/tmp/newTradeModal.html',
			controller: 'newTradeCtrl',
			resolve: {
				event: function () {
					return ev;
				},
				trades: function () {
					return $scope.trades;
				}
			}
		});
    instance.result.then(function () {
      getTrades();
    });
	};

	// Opens the edit trade modal
	$scope.editTrade = function (trade) {
		$modal.open({
			templateUrl: '/static/ng/tmp/editTradeModal.html',
			controller: 'editTradeCtrl',
			resolve: {
				trade: function () {
					return trade;
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
				if (ev.impact !== 'Holiday') {
					next = ev.time;
				}
			}
		});
		return events[times.indexOf(next)];
	}

	// Adds the color attr
	// TODO -- this should be a filter or something
	function color (events) {
		return _.map(events, function (ev) {
			if (ev.impact === 'High') {
				ev.color = 'danger';
			} else if (ev.impact === 'Medium') {
				ev.color = 'orange';
			} else if (ev.impact === 'Low') {
				ev.color = 'green';
			} else if (ev.impact === 'Holiday') {
				ev.color = 'gray';
			}
			return ev;
		});
	}
}

newsweek.controller('eventCtrl',
	['$scope', '$http', '$timeout', '$modal', '$log', eventCtrl]);
