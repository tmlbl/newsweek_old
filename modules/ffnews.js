var xml = require("xml2js"),
		request = require("request"),
		winston = require("winston")
    db = require("../db/db.js");

/**
 * Gets the weekly forex news information from Forex Factory
 * and parses it to JSON for consumption.
 * @param {Function} cb (err, news)
 * @returns {Object} news -- json of week's news
 */
module.exports = function (cb) {
	var url = "http://www.forexfactory.com/ffcal_week_this.xml";
	request.get(url, function (err, res, body) {
		if (err) cb(err, null);
		if (res.statusCode == 200) {
			xml.parseString(body, function (err, news) {
				if (err) {
					cb(err, null);
					winston.error(err);
				}
				cb(null, cleanJSON(news));
			});
		}
	});
};

/**
 * The data is arbitrarily nested.
 * Also, the parsed JSON comes through with lots of arrays
 * of length 1 as values. We'll flatten those to strings,
 * and return an array of event objects.
 * @param {Object} json
 * @returns {Array} clean json
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
module.exports.testCleanJSON = cleanJSON;

/**
 * Saves the news event data to the database
 */
function saveEvents (events) {
  function parseDates (el, index, array) {
   events[index].time = Date.parse(el.time)
  }
  events.forEach(parseDates);
  db.writePoints("ffnews", events, {}, function (err) {
    if (err) {
      winston.error("Error saving events to db", err);
    } else {
      winston.info("Saved FXF events to db");
    }
  });
}
module.exports.saveEvents = saveEvents;

