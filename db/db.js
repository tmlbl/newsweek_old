var mongoose = require('mongoose'),
  winston = require('winston');

function db() {}

var dbUrl = 'mongodb://localhost:27017/forex';

mongoose.connect(dbUrl, function (err) {
  if (!err) {
    logger.debug('Connected to MongoDB');
  } else {
    throw err;
  }
});

db.NewsEvent = require('./models/event');
db.Order = require('./models/order');
db.TradeGroup = require('./models/trade');
db.User = require('./models/user');
db.Strategy = require('./models/strategy');
db.Instrument = require('./models/instrument');
db.Account = require('./models/account');

// Synchronizes news events into the db
db.syncEvents = function (events, cb) {
  events.forEach(function (ev) {
    db.NewsEvent.find({
      title: ev.title,
      time: ev.time
    },
    function (err, doc) {
      if (err) {
        winston.error(err);
        return cb(err);
      }
      if (doc.length < 1) {
        var news = new db.NewsEvent(ev);
        news.save(function (err) {
          if (err) {
            winston.error(err);
            return cb(err);
          }
          cb(null);
        });
      }
    });
  });
};

// Insert the default strategy
db.Strategy.find({ name: 'default' }, function (err, strategy) {
  if (err) {
    logger.error('Error upserting default strategy', err);
  }
  if (!strategy.name) {
    logger.debug('Creating the default strategy...');
    db.Strategy.create({
      'name'         : 'default',
      'straddle'     : 10, // pips
      'timeBefore'   : 120000, // 2 minutes
      'stopLoss'     : 20, // pips
      'takeProfit'   : 30, // pips
      'trailingStop' : 10 // pips
    });
  }
});

// Load the list of instruments from Oanda
require('./load_instruments')(db);

module.exports = db;
