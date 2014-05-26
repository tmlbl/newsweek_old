newsweek.directive('chart',
	['$timeout', '$http', chartDirective]);

function chartDirective ($timeout, $http) {
	return {
		restrict: 'E',
		replace: true,
		template: '<div id="chart"></div>',
		link: function (scope, element, attrs) {
			var url = 'http://api-sandbox.oanda.com/';
			url += 'v1/candles?instrument=';
			url += attrs.symbol;
			url += '&count=100&candleFormat=midpoint';
			$http({ method: 'GET', url: url })
				.success(function (data) {
					console.log(data);
					var chart = d3.select('#chart');
					var svg = chart.append('svg:svg')
						.attr('height', '80%')
						.attr('width', '80%');
					var rects = svg.selectAll('rect')
						.data(data).enter()
						.append('svg:rect')
						.attr('color', 'blue')
						.attr('width', function (d) {
							return d.volume + '%';	
						});
				});
		}
	};
}
