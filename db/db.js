var influx = require("influx"),
    winston = require("winston");

var db;

db = influx("localhost", 8086, "root", "root", "forex");

module.exports.db = db;
