var xml = require("xml2js"),
		request = require("request"),
		winston = require("winston"),
    db = require("../db/db.js");

module.exports = function () {
	getNews(function (err, news) {
		news = cleanJSON(news);
		news = formatDates(news);
		db.save("ffnews", news);
	});
};

/**
 * Gets the weekly forex news information from Forex Factory
 * and parses it to JSON for consumption.
 * @param {Function} cb (err, news)
 * @returns {Object} news -- json of week's news
 */
function getNews (cb) {
	var url = "http://www.forexfactory.com/ffcal_week_this.xml";
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
 * @returns {Object} clean json
 */
function cleanJSON (json) {
	if (json && json.weeklyevents) {
		json = json.weeklyevents.event;
	} else {
		winston.error("Received malformed JSON");
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
		}
	}
	return json;
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
			var d = el.date.split("-");
			d = [ d[2], d[0], d[1] ];
			el.date = d.join("-");
		}
		el.date += "T";
		if (el.time) {
			if (el.time.length < 7) {
				time = "0" + el.time;
				el.time = time;
			}
			am = el.time.indexOf("am");
			pm = el.time.indexOf("pm");
		}
    if (am !== -1) {
      el.time = el.time.slice(0, am);
    } else if (pm !== -1) {
      time = el.time.slice(0, pm);
			time = time.split(":");
			time[0] = parseInt(time[0]) + 12;
			el.time = time.join(":");
    }
		time = Date.parse(el.date + el.time);
    el.time = time;
  });
  return events;
}
module.exports.formatDates = formatDates;
