var s = require('node-schedule');

function execute (tradeGroup) {
	return tradeGroup;
}

// Schedules execution of a tradeGroup
function register (tradeGroup) {
	var t = tradeGroup.time;
	console.log('Scheduled trade at', t);
	s.scheduleJob(t, function () {
		execute(tradeGroup);
	});
}
module.exports.register = register;
