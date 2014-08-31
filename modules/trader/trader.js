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
    logger.debug('Created trade group', self.model.id);
    self.schedule();
  });
}

Trader.prototype.schedule = function () {
  var t = this.trade.time;
  logger.debug('Scheduling trade', this.model.id, 'at', t);
  s.scheduleJob(t, this.execute.bind(null, this));
};

Trader.prototype.execute = function (self) {
  logger.debug('Executing trade', self.model.id);
  self.client.openTrade(self.trade, function (err, res) {
    logger.debug('Opened', res);
  });
  self.completed = true;
};
