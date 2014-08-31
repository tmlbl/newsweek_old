'use strict';

var s = require('node-schedule'),
		db = require('../../db/db'),
    OA = require('../oanda/client');

module.exports = Trader;

function Trader(options, trade) {
  this.options = options;
  this.client = new OA(options.token, options.account);
  this.trade = trade;
  this.schedule();
}

Trader.prototype.schedule = function () {
  var query = {
    _id: this.trade.event
  },
  self = this;
  db.NewsEvent.findOne(query, function (err, event) {
    if (err) {
      logger.error('Error finding event', query);
    }
    if (!event) {
      logger.error('Event not found', query);
    }
    self.event = event;
    self.trade.time = event.time - 120000;
    self.model = new db.TradeGroup(self.trade);
    self.model.save(function (err) {
      if (err) {
        logger.error(err);
      }
      logger.debug('Scheduling trade', self.model.id, 'at', self.trade.time);
      s.scheduleJob(self.trade.time, self.execute.bind(null, self));
    });
  });
};

Trader.prototype.execute = function (self) {
  logger.debug('Executing trade', self.model.id);
  self.client.openTrade(self.trade, function (err, res) {
    logger.debug('Opened', res);
  });
  self.completed = true;
};

Trader.prototype.tradeId = function () {
  return this.model._id.toString()
};
