'use strict';

var s = require('node-schedule'),
		db = require('../../db/db'),
    OA = require('../oanda/client'),
    util = require('util'),
    async = require('async');

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
  self.completed = true;
};
