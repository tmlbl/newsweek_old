var Trader = require('../../modules/trader/trader'),
    mongoose = require('mongoose'),
    db = require('../../db/db');

require('../../common/logger');

describe('Trader class', function () {
  var trader;

  var testevent = {
    title: 'MPC Member Broadbent Speaks',
    country: 'GBP',
    time: Date.now() + 120000,
    impact: 'Medium',
    _id: mongoose.Types.ObjectId(),
    trading: false
  };

  it('must create a test event', function (done) {
    db.NewsEvent.create(testevent, function (err) {
      if (err) {
        throw err;
      }
      done();
    });
  });

  it('should initialize the class', function () {
    trader = new Trader({
      account: 	8564825,
      token: '7d5100fcb48f09bff2c85a92b5ef6639-' +
          '744dfed42981e7020c732a34184da930'
    },
    {
      units: 2,
      instrument: 'EUR_USD',
      event: testevent._id
    });
    if (!trader.execute) {
      throw new Error('Didn\'t find the class object');
    }
    if (trader.completed) {
      throw new Error('Trade was initialized as already completed');
    }
  });

  it('should be marked as completed', function (next) {
    setTimeout(function () {
      if (!trader.completed) {
        throw new Error('The trade was not marked as completed');
      }
    }, 900);
    setTimeout(next, 1000);
  });

  it('should retain the trade information', function () {
    if (trader.trade.units !== 2) {
      throw new Error('Expected 2, got ' + trader.trade.units);
    }
  });

  it('should persist the trade in the database', function (done) {
    var id = trader.tradeId();
    if (!id) {
      throw new Error('Trader didn\'t return a trade ID');
    }
    db.TradeGroup.findOne({ _id: id }, function (err, tradeGroup) {
      if (err) {
        throw err;
      }
      if (!tradeGroup) {
        throw new Error('The tradegroup is not in the database');
      }
      done();
    });
  });

  it('should set a trade time based on the event', function () {
    if (typeof trader.trade.time !== 'number') {
      throw new Error('Expected trade time to be a number but got ' +
        typeof trader.trade.time);
    }
  });

});
