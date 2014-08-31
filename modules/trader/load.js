var db = require('../../db/db'),
    Trader = require('./trader.js');

module.exports = load();

/**
 * Loads incomplete trades whose times have not come
 * into memory as Trader objects to ensure their execution
 */
function load() {
  var query = {
    completed: false,
    time: {
      $gte: Date.now()
    }
  };
  db.NewsEvent.find(query, function (err, tradeGroups) {
    if (err) {
      throw err;
    }
    tradeGroups.forEach(function (trade) {
      new Trader(trade);
    });
  });
}
