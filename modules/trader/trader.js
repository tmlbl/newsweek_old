var s = require('node-schedule'),
		request = require('request'),
		cfg = require('../../config');

// Schedules execution of a tradeGroup
function register (tradeGroup) {
	var t = tradeGroup.time;
	console.log('Scheduled trade at', t);
	s.scheduleJob(t, function () {
		execute(tradeGroup);
	});
}
module.exports.register = register;

function execute (tradeGroup) {
	
}

function createTrade (options) {
	
}
