'use strict';

var s = require('node-schedule'),
		db = require('../../db/db'),
    OA = require('../oanda/client');

module.exports = Trader;

function Trader(options, trade, cb) {
  this.options = options;
  this.client = new OA(options.token, options.account);
  this.trade = trade;
  this.schedule(cb);
}

Trader.prototype.schedule = function (cb) {
  var query = {
    _id: this.trade.event
  },
  self = this;
  db.NewsEvent.findOne(query, function (err, event) {
    if (err) {
      cb(new Error('Error finding event in db'));
    }
    if (!event) {
      cb(new Error('Couldn\'t find event in db'));
    }
    self.event = event;
    self.trade.time = event.time - 120000;
    self.model = new db.TradeGroup(self.trade);
    self.model.save(function (err) {
      if (err) {
        cb(err);
      }
      logger.debug('Scheduling trade', self.model.id, 'at', self.trade.time);
      s.scheduleJob(self.trade.time, self.execute.bind(null, self));
      cb(null, self.model.id);
    });
  });
};

Trader.prototype.execute = function (self) {
  logger.debug('Executing trade', self.model.id);
  self.client.openTrade(self.trade, function (err, res) {
    logger.debug('Opened', res);
    self.completed = true;
  });
};

Trader.prototype.tradeId = function () {
  return this.model._id.toString()
};
