var xml = require('xml2js'),
		request = require('request'),
		winston = require('winston');

// Aggregate function to fetch and save the news
function fetch (cb) {
	getNews(function (err, news) {
		if (err) cb(err, null);
		news = cleanJSON(news);
		news = formatDates(news);
		news = checkDates(news);
		cb(null, news);
	});
};
module.exports.fetch = fetch;

/**
 * Gets the weekly forex news information from Forex Factory
 * and parses it to JSON for consumption.
 * @param {Function} cb (err, news)
 * @returns {Object} news -- json of week's news
 */
function getNews (cb) {
	var url = 'http://www.forexfactory.com/ffcal_week_this.xml';
	request.get(url, function (err, res, body) {
		if (err) cb(err, null);
		if (res.statusCode == 200) {
			xml.parseString(body, function (err, news) {
				if (err) {
					cb(err, null);
					winston.error(err);
				}
				cb(null, news);
			});
		}
	});
}
module.exports.getNews = getNews;

/**
 * The data is arbitrarily nested.
 * Also, the parsed JSON comes through with lots of arrays
 * of length 1 as values. We'll flatten those to strings,
 * and return an array of event objects.
 * @param {Object} json
 * @returns {Array} json array of events
 */
function cleanJSON (json) {
	var res = [];
	if (json && json.weeklyevents) {
		json = json.weeklyevents.event;
	}
	for (var i in json) {
		if (json.hasOwnProperty(i)) {
			for (var j in json[i]) {
				if (json[i].hasOwnProperty(j)) {
					if (json[i][j].length == 1) {
						json[i][j] = json[i][j][0];
					}
				}
			}
			res.push(json[i]);
		}
	}
	return res;
}
module.exports.cleanJSON = cleanJSON;

/**
 * Parses the date and time attributes of the news
 * event into a unix timestamp for storage
 * @param {Array} events
 * @returns {Array} events
 */
function formatDates (events) {
  var am, pm, time;
  events.forEach(function (el) {
		if (el.date) {
			var d = el.date.split('-');
			d = [ d[2], d[0], d[1] ];
			el.date = d.join('-');
		}
		el.date += 'T';
		if (el.time) {
			el.old = el.time;
			if (el.time.length < 7) {
				time = '0' + el.time;
				el.time = time;
			}
			am = el.time.indexOf('am');
			pm = el.time.indexOf('pm');
		}
    if (am !== -1) {
      el.time = el.time.slice(0, am);
    } else if (pm !== -1) {
      time = el.time.slice(0, pm);
			time = time.split(':');
			time[0] = parseInt(time[0]);
			if (time[0] != 12) {
				time[0] += 12;
			}
			el.time = time.join(':');
		}
		time = Date.parse(el.date + el.time);
		el.time = time;
	});
	return events;
}
module.exports.formatDates = formatDates;

/**
 * Before saving, strip out any events that evaluated
 * to an invalid time
 * @param {Array} events JSON Array of forex events
 * @returns {Array} events Minus those whose time
 * evaluates to NaN
 */
function checkDates (events) {
	for (var i = events.length - 1; i >= 0; i--) {
		if (events[i] && isNaN(events[i].time)) {
			winston.error('Found NaN time');
			events.splice(i, 1);
		}
	}
	return events;
}
module.exports.checkDates = checkDates;
