newsweek.directive('chart',
	['$timeout', '$http', chartDirective]);

function chartDirective ($timeout, $http) {
	$timeout(makeChart, 500);
	return {
		template: '<div id="chart"></div>'
	};
}

function makeChart () {
	var chart = d3.select('#chart');
	var svg = chart.append('svg')
		.attr('height', '80%')
		.attr('width', '80%');
	var bars = svg.selectAll('rect')
		.data()
}
