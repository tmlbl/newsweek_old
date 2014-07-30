var db = require('../db/db'),
		util = require('util'),
		OandaClient = require('../modules/oanda/client');

module.exports = function (app) {
  app.get('/positions', function (req, res) {
  	console.log('Request by user', req.session.user);
  	var oa = new OandaClient(req.session.token);

  	res.send(200);
  });

  app.get('/accounts', function (req, res) {
		var oa = new OandaClient(req.session.user.token);
		oa.getAccounts(function (err, accounts) {
			logger.info(accounts);
			if (err) {
				logger.error(util.inspect(err));
				return res.send(500);
			}
			return res.send(200, accounts);
		});  	
  });

  app.get('/accounts/:id', function (req, res) {
  	var oa = new OandaClient(req.session.user.token, req.params.id)
  	oa.getAccountInfo(function (err, info) {
  		if (err) {
  			logger.error(util.inspect(err));
				return res.send(500);
  		}
  		return res.send(200, info);
  	});
  });
};
