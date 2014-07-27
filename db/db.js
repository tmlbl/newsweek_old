var mongoose = require('mongoose'),
		winston = require('winston');

var db = {};

var dbUrl = 'mongodb://localhost:27017/forex';

mongoose.connect(dbUrl, function (err) {
	if (!err) {
		winston.info('Connected to MongoDB');
	} else {
		throw err;
	}
});

db.NewsEvent = require('./models/news');
db.Order = require('./models/order');
db.TradeGroup = require('./models/tradeGroup');
db.User = require('./models/user');

// Synchronizes news events into the db
db.syncEvents = function (events, cb) {
	events.forEach(function (ev) {
		db.NewsEvent.find({
			title: ev.title,
			time: ev.time
		},
		function (err, doc) {
			if (err) {
				winston.error(err);
				cb(err);
			}
			if (doc.length < 1) {
				var news = new db.NewsEvent(ev);
				news.save(function (err) {
					if (err) {
						winston.error(err);
						cb(err);
					}
				});
			}
		});
	});
	cb(null);
};

module.exports = db;
