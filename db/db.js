var influx = require("influx"),
    winston = require("winston");

var env = process.env.NODE_ENV || "test";
var db;

if (env == "test") {
	db = influx("localhost", 8086, "tmlbl", "tmlbl", "forex");
}

module.exports.db = db;
