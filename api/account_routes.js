var db = require('../db/db'),
		util = require('util'),
		OandaClient = require('../modules/oanda/client');

module.exports = function (app) {
  app.get('/fx/accounts/:id/positions', function (req, res) {
  	var oa = new OandaClient(req.session.user.token, req.params.id);
    oa.getPositions(function (err, positions) {
      logger.info(positions);
      if (err) {
        logger.error(util.inspect(err));
        return res.status(500).send();
      }
      return res.status(200).send(positions);
    });
  });

  app.get('/fx/accounts', function (req, res) {
		var oa = new OandaClient(req.session.user.token);
		oa.getAccounts(function (err, accounts) {
			logger.info(accounts);
			if (err) {
				logger.error(util.inspect(err));
				return res.status(500).send();
			}
			return res.status(200).send(accounts);
		});
  });

  app.get('/fx/accounts/:id', function (req, res) {
  	var oa = new OandaClient(req.session.user.token, req.params.id)
  	oa.getAccountInfo(function (err, info) {
  		if (err) {
  			logger.error(util.inspect(err));
				return res.status(500).send();
  		}
  		return res.status(200).send(info);
  	});
  });
};
