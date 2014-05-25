var db = require('../db/db'),
		news = require('../modules/ffnews/ffnews');

module.exports = function (app) {
	app.get('/api/news', function (req, res) {
		var n;
		news.getNews(function (err, data) {
			n = data;
			n = news.checkDates(news.formatDates(news.cleanJSON(n)));
			console.log('You are trying to write this to InfluxDB:');
			console.log(n);
			db.writePoints('ffnews', n, function (err) {
				if (err) throw err;
				res.send('Wrote events to db');
			});
		});
	});
	app.get('/api/news/latest', function (req, res) {
		db.query('select * from ffnews where time > now();', function (err, data) {
			if (err) {
				res.send(500, err);
			}
			res.send(200, data);
		});
	});
};
