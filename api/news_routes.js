var db = require('../db/db'),
		news = require('../modules/ffnews/ffnews');

module.exports = function (app) {
	app.get('/api/news/fetch', function (req, res) {
		var n;
		news.fetch(function (err, events) {
			if (err) res.send(500, err);
			db.insert(events, function (err) {
				if (err) res.send(500, err);
				res.send(200, events);
			});
		});
	});
	app.get('/api/news/latest', function (req, res) {
		db.NewsEvent.find({ time: { $gte: Date.now() }}, function (err, docs) {
			if (err) res.send(500, err);
			res.send(200, docs);
		});
	});
};
