var mongoose = require('mongoose'),
    winston = require('winston');

var db = {};

mongoose.connect('mongodb://localhost/forex', function (err) {
  if (!err) {
    winston.info('Connected to MongoDB');
  } else {
    throw err;
  }
});

db.NewsEvent = require('./models/news');
db.Trade = require('./models/trade');

db.insert = function (events, cb) {
	events.forEach(function (ev) {
		db.NewsEvent.find({ title: ev.title, time: ev.time }, function (err, doc) {
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
