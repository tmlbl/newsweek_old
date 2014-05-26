var db = require('../db/db');

module.exports = function (app) {
  app.get('/api/trades/latest', function (req, res) {
    db.TradeGroup.find({ time: { $gte: Date.now() }})
      .populate('event')
      .exec(function (err, docs) {
      if (err) res.send(500, err);
      res.send(200, docs);
    });
  });
  app.get('/api/trades', function (req, res) {
  	db.TradeGroup.find({}, function (err, docs) {
  		if (err) res.send(500, err);
  		res.send(200, docs);
  	});
  });
  app.post('/api/trades', function (req, res) {
  	var trade = new db.TradeGroup(req.body);
  	trade.save(function (err) {
  		if (err) {
  			res.send(500, err);
  		} else {
  			res.send(200);
  		}
  	});
  });
  // REST routes
  app.get('/api/trades/:id', function (req, res) {
    db.TradeGroup.findById(req.params.id)
      .populate('event')
      .exec(function (err, docs) {
        if (err) res.send(500, err);
        res.send(200, docs);
      });
  });
  app.put('/api/trades/:id', function (req, res) {
    var up = req.body;
    if (up._id) delete up._id;
    db.TradeGroup.update({ _id: req.params.id }, up)
      .exec(function (err) {
        if (err) res.send(500, err);
        res.send(200);
      });
  });
  app.delete('/api/trades/:id', function (req, res) {
    db.TradeGroup.remove({ _id: req.params.id })
      .exec(function (err) {
        if (err) res.send(500, err);
        res.send(200);
      });
  });
};
