'use strict';
var db = require('../db/db');

module.exports = function (app) {
  app.get('/fx/instruments', function (req, res) {
    db.Instrument.find({}, function (err, instruments) {
      if (err) {
        res.send(500).send(err);
      }
      res.status(200).send(instruments);
    });
  });
};
