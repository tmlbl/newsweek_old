var db = require('../../db/db'),
		config = require('../../config.js'),
		path = require('path');

module.exports = function (app) {

	app.get('/', function (req, res) {
		if (req.session.user) {
			res.cookie('token', req.session.user.token, {});
			res.cookie('host', config.apiHost, {});
			res.sendfile('views/main.html', {}, function (err) {
				if (err) {
					throw err;
				}
			});
		} else {
			res.redirect('/login');
		}
	});

	app.get('/login', function (req, res) {
		res.sendfile(path.resolve('views/login.html'), {}, function (err) {
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
				return res.send(500, err);
			} else {
				req.session.user = user;
				res.redirect('/');
			}
		});
	});

	app.post('/users/new', function (req, res) {
		if (!req.body.username) {
			res.send(500, 'Must supply a username');
		}
		if (!req.body.password) {
			res.send(500, 'Must supply a password');
		}
		if (!req.body.token) {
			res.send(500, 'Must supply an Oanda API token');
		}
		var user = new db.User(req.body);
		user.save(function (err, user) {
			if (err) {
				console.error(err);
				return res.send(500, 
						'There was an error creating your account');
			}
			console.log('Saved user', user)
			req.session.user = user;
			return res.redirect('/');
		});
	});

	app.get('/logout', function (req, res) {
		req.session.destroy(function () {
			res.redirect('/');
		});
	});

};
