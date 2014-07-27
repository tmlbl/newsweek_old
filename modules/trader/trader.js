var s = require('node-schedule'),
		db = require('../../db/db'),
		async = require('async');

var store;

// Creates a new tradegroup and the associated trades
function newTrade(params, callback) {
	store.params = params;
	async.series([
		createTradeGroup,
		createOrders,
		registerOrders
	], function (err, results) {
		if (err) {
			console.error(err);
		}
		console.log(results);
	});
}
module.exports.new = newTrade;

function createTradeGroup (next) {
	var tradeGroup = new db.TradeGroup(store.params);
	tradeGroup.save(function (err, grp) {
		store.tradeGroup = grp;
		next();
	});
}

function createOrders (next) {
	next();
}

// Schedules execution of a tradeGroup
function registerOrders () {
	var t = store.tradeGroup.time;
	console.log('Scheduled trade at', t);
	s.scheduleJob(t, execute.bind(store.tradeGroup));
}

// Executes the trades in a tradeGroup
function execute (tradeGroup) {
	return tradeGroup;
}


