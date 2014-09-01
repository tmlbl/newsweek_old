var db = require('../db/db'),
		news = require('../modules/ffnews/ffnews');

module.exports = function (app) {
	// Projection: Manually executes news.fetch()
	// and returns the result.
	// TODO: remove - this will be a scheduled process
	app.get('/api/events/fetch', function (req, res) {
		news.getNews(function (err, events) {
			events = news.cleanJSON(events);
			events = news.formatDates(events);
			if (err) {
				res.send(500, err);
				return;
			}
			db.syncEvents(events, function (err) {
				if (err) {
					res.send(500, err);
					return;
				}
				res.send(200, events);
			});
		});
	});

	// Projection: Returns all events that have not
	// yet occurred.
	app.get('/api/events/latest', function (req, res) {
		db.NewsEvent.find({
			time: {
				$gte: Date.now()
			}
		}, function (err, docs) {
			if (err) {
				res.status(500).send(err);
				return;
			}
			res.status(200).send(docs);
		});
	});

	// GET /api/events -- dump all events
	app.get('/api/events', function (req, res) {
		db.NewsEvent.find({}, function (err, ev) {
			if (err) {
				res.send(500, err);
			}
			res.send(200, ev);
		});
	});

	// GET /api/events/:id -- get event by ID
	app.get('/api/events/:id', function (req, res) {
		var id = req.params.id;
		db.NewsEvent.findById(id, function (err, ev) {
			if (err) {
				res.send(500, err);
			}
			res.send(200, ev);
		});
	});

	// POST /api/events/:id -- update an event by ID
	app.post('/api/events/:id', function (req, res) {
		var id = req.params.id;
		db.NewsEvent.update({ _id: id }, req.body, {}, function (err, doc) {
			if (err) {
				res.send(500, err);
			}
			res.send(200, doc);
		});
	});

};
