'use strict';

var s = require('node-schedule'),
		db = require('../../db/db'),
    OA = require('../oanda/client');

module.exports = Trader;

function Trader(options, trade) {
  var self = this;
  this.options = options;
  this.client = new OA(options.token, options.account);
  this.trade = trade;
  this.model = new db.TradeGroup(this.trade);
  this.model.save(function (err) {
    if (err) {
      logger.error(err);
    }
    logger.debug('Created trade group', self.model.toObject());
    self.schedule();
  });
}

Trader.prototype.schedule = function () {
  var t = this.trade.time;
  logger.debug('Scheduling trade at', t);
  s.scheduleJob(t, this.execute.bind(null, this));
};

Trader.prototype.execute = function (self) {
  logger.debug('Executing the trade');
  self.client.openTrade(self.trade, function (err, res) {
    logger.debug('Opened', res);
  });
  self.completed = true;
};
