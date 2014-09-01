var db = require('../../db/db'),
    Trader = require('./trader.js');

module.exports = load();

/**
 * Loads incomplete trades whose times have not yet come
 * into memory as Trader objects to ensure their execution
 */
function load() {
  var query = {
    completed: false,
    time: {
      $gte: Date.now()
    }
  };
  db.TradeGroup.find(query)
      .exec(handleQuery);
}

function handleQuery(err, tradeGroups) {
  if (err) {
    throw err;
  }
  logger.debug('Loading', tradeGroups.length,
      'outstanding trades into memory');
  tradeGroups.forEach(createTrader);
}

function createTrader(trade)  {
  new Trader(trade, callback);
}

function callback(err, tradeGroup) {
  if (err) {
    logger.error('Error loading trade group', err);
  } else {
    logger.debug('Finished loading trade group', tradeGroup);
  }
}
