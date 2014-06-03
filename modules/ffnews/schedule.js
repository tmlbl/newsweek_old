var schedule = require('node-schedule'),
		news = require('./ffnews');

// Every Sunday at 5pm
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 0;
rule.hour = 17;
rule.minute = 0;

schedule.scheduleJob(rule, function () {
	news.fetch(function (err, news) {
		if (err) {
			winston.error('There was an error fetching weekly news', err);
		} else {
			winston.info('Fetched weekly news', news);
		}
	});
});
