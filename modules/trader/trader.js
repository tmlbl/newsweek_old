'use strict';

var s = require('node-schedule'),
		db = require('../../db/db'),
    OA = require('../oanda/client'),
    util = require('util'),
    async = require('async'),
    precision = 5;

module.exports = Trader;

function Trader(tradeGroupModel, cb) {
  this.trade = tradeGroupModel;
  async.series([
      this._createClient.bind(null, this),
      this._loadStrategy.bind(null, this),
      this._schedule.bind(null, this)
  ], cb);
}

Trader.prototype._createClient = function (self, next) {
  var query = {
    _id: self.trade.user
  };
  db.User.findOne(query, function (err, user) {
    if (err) {
      return next(err);
    }
    self.user = user;
    self.client = new OA(user.token, self.trade.account);
    return next();
  });
};

Trader.prototype._loadStrategy = function (self, next) {
  // For now, load the default strategy
  var query = {
    name: 'default'
  };
  db.Strategy.findOne(query, function (err, strategy) {
    if (err) {
      return next(err);
    }
    self.strategy = strategy;
    return next();
  });
};

Trader.prototype._schedule = function (self, next) {
  var query = {
    _id: self.trade.event
  };
  db.NewsEvent.findOne(query, function (err, event) {
    if (err) {
      return next(err);
    }
    self.trade.time = event.time - self.strategy.timeBefore;
    self.trade.save(function (err) {
      if (err) {
        return next(err);
      }
      s.scheduleJob(self.trade.time, self.execute.bind(null, self));
      logger.debug('Scheduled trade', self.trade.id, 'at',
          util.inspect(self.trade.time));
      return next();
    });
  });
};

Trader.prototype.execute = function (self) {
  logger.debug('Executing trade', self.trade.id);
  // Get the current instrument price
  var params = {
    instruments: [self.trade.instrument]
  };
  self.client.getPrices(params, function (err, res) {
    self.ask = res.prices[0].ask;

    logger.debug('Current ask price of', self.trade.instrument, 'is', self.ask);
    logger.debug('Top order will be placed at', self.topOrder().price);
    self.client.openTrade(self.topOrder(), function (err, data) {
      if (err) {
        logger.error('Error opening top order', err);
      } else {
        logger.debug('Opened top order', data);
      }
    });
    logger.debug('Bottom order will be placed at', self.bottomOrder().price);
    self.client.openTrade(self.bottomOrder(), function (err, data) {
      if (err) {
        logger.error('Error opening bottom order', err);
      } else {
        logger.debug('Opened bottom order', data);
      }
    });
  });
  self.completed = true;
};

Trader.prototype.topOrder = function () {
  var straddle = this.strategy.straddle / 10000,
      stopLoss = this.strategy.stopLoss / 10000,
      takeProfit = this.strategy.takeProfit / 10000;
  return {
    price: parseFloat((this.ask + straddle).toFixed(precision)),
    instrument: this.trade.instrument,
    side: 'buy',
    type: 'limit',
    stopLoss: parseFloat((this.ask + straddle - stopLoss).toFixed(precision)),
    takeProfit: parseFloat((this.ask + straddle + takeProfit).toFixed(precision)),
    trailingStop: this.strategy.trailingStop,
    expiry: parseInt(((new Date().getTime() + 1000) / 1000).toFixed()),
    units: this.trade.units
  };
};

Trader.prototype.bottomOrder = function () {
  var straddle = this.strategy.straddle / 10000,
      stopLoss = this.strategy.stopLoss / 10000,
      takeProfit = this.strategy.takeProfit / 10000;
  return {
    price: parseFloat((this.ask - straddle).toFixed(precision)),
    instrument: this.trade.instrument,
    side: 'sell',
    type: 'limit',
    stopLoss: parseFloat((this.ask - straddle + stopLoss).toFixed(precision)),
    takeProfit: parseFloat((this.ask - straddle - takeProfit).toFixed(precision)),
    trailingStop: this.strategy.trailingStop,
    expiry: parseInt(((new Date().getTime() + 1000) / 1000).toFixed()),
    units: this.trade.units
  };
};
