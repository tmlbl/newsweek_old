var OA = require('../modules/oanda/client'),
    config = require('../config');

module.exports = function (db) {
  var oa = new OA(config.apiKey, config.accountId);
  oa.getInstruments(function (err, res) {
    if (err) {
      logger.error('Error getting instruments from Oanda', err);
    }
    res.instruments.forEach(function (instrument) {
      db.Instrument.findOne({ name: instrument.instrument })
          .exec(function (err, doc) {
            if (err) {
              logger.error('Error getting instruments from db', err);
            }
            if (!doc) {
              instrument.name = instrument.instrument;
              db.Instrument.create(instrument, function (err) {
                if (err) {
                  logger.error('Error creating instrument', err);
                }
              });
            }
          });
    });
  });
};
