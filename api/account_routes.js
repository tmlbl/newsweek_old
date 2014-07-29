var db = require('../db/db');

module.exports = function (app) {
  app.get('/accounts', function (req, res) {
  	console.log(req.user);
  	res.send(200);
  });
};
