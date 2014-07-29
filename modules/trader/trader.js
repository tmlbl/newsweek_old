var s = require('node-schedule'),
		db = require('../../db/db'),
		async = require('async');

var store = {};

// Creates a new tradegroup and the associated trades
function newTrade(params, callback) {
	store.params = params;
	async.series([
		createTradeGroup,
		registerOrders
	], callback);
}
module.exports.new = newTrade;

// Creates a new trade group and schedules execution
function createTradeGroup (next) {
	logger.debug('In', createTradeGroup.name);
	var tradeGroup = new db.TradeGroup(store.params);
	tradeGroup.save(function (err) {
		if (err) {
			logger.error(err);
		} 
		logger.debug('Created trade group', tradeGroup.toObject());
		store.tradeGroup = tradeGroup;
		next();
	});
}

// Schedules execution of a tradeGroup
function registerOrders (next) {
	logger.debug('In', registerOrders.name);
	var t = store.tradeGroup.time;
	console.log('Scheduling trade at', t);
	s.scheduleJob(t, execute.bind(store.tradeGroup));
	next();
}

// Executes the trades in a tradeGroup
function execute (tradeGroup) {
	return tradeGroup;
}
