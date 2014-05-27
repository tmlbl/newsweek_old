newsweek.directive('chart',
	['$timeout', '$http', chartDirective]);

function chartDirective ($timeout, $http) {
	return {
		restrict: 'E',
		link: function (scope, element, attrs) {
			var url = 'http://api-sandbox.oanda.com/';
			url += 'v1/candles?instrument=';
			url += 'EUR_USD';//attrs.symbol;
			url += '&count=100&candleFormat=midpoint';
			$http({ method: 'GET', url: url })
				.success(function (data) {
					console.log(data);

					var chart = d3.select('chart')
						.attr('height', '80%')
						.attr('width', '100%');

					var x = d3.scale.linear()
						.domain([
							d3.min(data.candles.map(function (d) {
								return Date.parse(d.time);
							})),
							d3.max(data.candles.map(function (d) {
								return Date.parse(d.time);
							}))
						]);

					var svg = chart.append('svg:svg')
						.attr('height', '80%')
						.attr('width', '100%');

					var rects = svg.selectAll('rect')
						.data(data.candles).enter()
						.append('svg:rect')
						.attr('color', 'blue')
						.attr('width', 10)
						.attr('height', 10)
						.attr('y', function (d) {
							return d.closeMid * 100;	
						})
						.attr('x', function (d, i) {
							return i * 15;
						});
				});
		}
	};
}
