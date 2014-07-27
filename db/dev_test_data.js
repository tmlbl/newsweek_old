var db = require('./db'),
		async = require('async'),
		news = require('../modules/ffnews/ffnews');

module.exports = genTestData;

var store = {
	user: {},
	events: [],
	trades: []
};

function genTestData() {
	if (process.env.NODE_ENV !== 'dev') {
		console.log('Env is not dev, skipping test data');
		return;
	}
	console.log('Generating test data');
	async.series([
		createTestUser,
		getEventData
	], function (err, results) {
		console.log('Finished generating test data');
	});
}

function createTestUser(next) {
	// Check if the test user already exists
	db.User.findOne({ username: 'tim', password: 'root' }, function (err, user) {
		if (user) {
			console.log('Test user already exists');
			return next();
		}
		console.log('Generating test user');
		// Create the test user
		var testUser = new db.User({
			username: 'tim',
			password: 'root',
			token: '7d5100fcb48f09bff2c85a92b5ef6639-744dfed42981e7020c732a34184da930'
		});
		testUser.save(function (err, user) {
			if (err) {
				throw err;
			}
			console.log('Created test user', user);
			store.user = user;
			next();
		});
	});
}

function getEventData(next) {
	// Syncs the latest news event data
	news.getNews(function (err, events) {
		events = news.cleanJSON(events);
		events = news.formatDates(events);
		if (err) {
			console.log(err);
			return;
		}
		db.syncEvents(events, function (err) {
			if (err) {
				console.log(err);
				return;
			}
			console.log('Synced news events');
			next();
		});
	});
}
