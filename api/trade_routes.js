var db = require('../db/db');

module.exports = function (app) {
  app.get('/api/trades', function (req, res) {
  	db.Trades.find({}, function (err, docs) {
  		if (err) res.send(500, err);
  		res.send(200, docs);
  	});
  });
  app.post('/api/trades', function (req, res) {
  	var trade = new db.Trade(req.body);
  	trade.save(function (err) {
  		if (err) {
  			res.send(500, err);
  		} else {
  			res.send(200);
  		}
  	});
  });
};
