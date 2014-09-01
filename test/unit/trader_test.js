var Trader = require('../../modules/trader/trader'),
    mongoose = require('mongoose'),
    db = require('../../db/db');

require('../../common/logger');

describe('Trader class', function () {
  var trader;

  var testEvent = {
    title: 'MPC Member Broadbent Speaks',
    country: 'GBP',
    time: Date.now() + 120000,
    impact: 'Medium',
    _id: mongoose.Types.ObjectId()
  };

  var testUser = {
    username: 'tim',
    password: 'root',
    token: '7d5100fcb48f09bff2c85a92b5ef6639-744dfed42981e7020c732a34184da930',
    _id: mongoose.Types.ObjectId()
  };

  var testTrade = {
    event: testEvent._id,
    instrument: 'EUR_GBP',
    units: 30,
    account: 8564825,
    user: testUser._id,
    time: 'Mon Sep 01 2014 01:33:00 GMT+0000 (UTC)',
    _id: mongoose.Types.ObjectId(),
    orders: []
  };

  it('inserts the test models', function (done) {
    db.NewsEvent.create(testEvent, function (err) {
      if (err) {
        throw err;
      }
      db.User.create(testUser, function (err) {
        if (err) {
          throw err;
        }
        db.TradeGroup.create(testTrade, function (err) {
          if (err) {
            throw err;
          }
          done();
        })
      });
    });
  });

  it('should initialize the class', function () {
    var query = {
      _id: testTrade._id
    };
    db.TradeGroup.findOne(query, function (err, trade) {
      if (err) {
        throw err;
      }
      trader = new Trader(trade, function (err) {
        if (err) {
          throw err;
        }
      });
      if (!trader.execute) {
        throw new Error('Didn\'t find the class object');
      }
      if (trader.completed) {
        throw new Error('Trade was initialized as already completed');
      }
    });
  });

  it('should be marked as completed', function (done) {
    setTimeout(function () {
      if (!trader.completed) {
        throw new Error('The trade was not marked as completed');
      }
    }, 900);
    setTimeout(done, 1000);
  });

  it('should retain the trade information', function () {
    if (trader.trade.units !== testTrade.units) {
      throw new Error('Expected ' + testTrade.units +
          ', got ' + trader.trade.units);
    }
  });

  it('should set a trade time based on the event', function () {
    try {
      Date.parse(trader.trade.time);
    } catch (err) {
      throw err;
    }
  });

});
