var db = require('../../db/db');

module.exports = function (app) {

	app.get('/', function (req, res) {
		if (req.session.user) {
			res.cookie('token', req.session.user.token, {});
			res.sendfile('./views/main.html', {}, function (err) {
				if (err) {
					throw err;
				}
			});
		} else {
			res.redirect('/login');
		}
	});

	app.get('/login', function (req, res) {
		res.sendfile('./views/login.html', {}, function (err) {
			if (err) {
				throw err;
			}
		});
	});

	app.post('/login', function (req, res) {
		db.User.findOne({
			username: req.body.username,
			password: req.body.password
		}, function (err, user) {
			if (err) {
				res.send('There was an error fetching your account.');
			} else {
				req.session.user = user;
				res.redirect('/');
			}
		});
	});

	app.get('/logout', function (req, res) {
		req.session.destroy(function () {
			res.redirect('/');
		});
	});

};
