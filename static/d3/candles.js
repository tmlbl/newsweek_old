// Create the svg chart
var chart = d3.select("#chart")
	.append("svg:svg")
	.attr("width", "100%")
	.attr("height", "100%");

// Process the data to find min and max time
chart.maxTime = 0;
chart.minTime = 0;
_.each(sampleCandles, function (datum, index) {
	var t = sampleCandles[index].time = Date.parse(datum.time);
	chart.minTime = 80000000000000;
	if (t > chart.maxTime) {
		chart.maxTime = t;
	} else if (t < chart.minTime) {
		chart.minTime = t;
	}
});
console.log(chart.maxTime);
console.log(chart.minTime);

chart.selectAll("rect")
	.data(sampleCandles)
	.enter().append("svg:rect")
	.attr("x", function (d) {
		return d.time;
	});
