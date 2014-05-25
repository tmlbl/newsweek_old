var influx = require('influx'),
    winston = require('winston');

var db;

db = influx('localhost', 8086, 'root', 'root', 'forex');

/**
 * Insert queries for each point and tests if it already
 * exists before inserting.
 * @param {String} collection
 * @param {Array} points
 * @param {Function} cb
 */
db.insert = function (collection, points, cb) {
	points.forEach(function (ev, ix, arr) {
		var q = 'select 1 from ' + collection;
		q += ' where title = \'' + ev.title;
		q += '\';';
		db.query(q, function (err, data) {
			if (data.length < 1) {
				db.writePoint(collection, ev, function (err) {
					if (ev.title == arr[arr.length - 1].title) {
						if (err) {
							cb(err);
						} else {
							cb(null);
						}
					}
				});
			}
		});
	});
};

module.exports = db;
