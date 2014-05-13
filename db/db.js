var influx = require("influx");

var db = influx("localhost", 8086, "tmlbl", "tmlbl", "forex");

function save (collection, items) {
	db.writePoints(collection, items, {}, function (err) {
		if (err) {
			winston.error(err, "Error saving events to db");
		} else {
			winston.info(items, "Saved items to db");
		}
	});
}

module.exports.db = db;
module.exports.save = save;
