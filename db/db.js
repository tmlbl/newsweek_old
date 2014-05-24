var influx = require("influx"),
    winston = require("winston");

var db;

db = influx("localhost", 8086, "root", "root", "forex");

/**
 * Insert queries for each point and tests if it already
 * exists before inserting.
 * @param {String} collection
 * @param {Array} points
 * @param {Function} cb
 */
db.insert = function (collection, points, cb) {
	points.forEach(function (pt, index) {
		var query = "SELECT 1 FROM ";
		query += collection;
		query += " WHERE title = '";
		query += pt.title.toString();
		query += "';";
		db.query(query, function (err, data) {
			if (data.length < 1) {
				db.writePoint(collection, pt, function (err) {
					if (err) throw err;
					if (index == points.length - 1) {
						cb();
					}
				});
			}
		});
	});
};

module.exports = db;
