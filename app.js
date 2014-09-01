var express = require('express'),
		bodyParser = require('body-parser'),
		session = require('express-session'),
		cookieParser = require('cookie-parser'),
		app = express();

require('./common/logger');

require('./db/dev_test_data')();
require('./modules/trader/load');

app.use('/static', express.static(__dirname + '/static'));
app.use(function (req, res, next) {
	logger.debug(req.method, req.url);
	next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('./common/secure_headers'));
app.use(cookieParser());
app.use(session({
	secret: 'daggeurotype',
  resave: true,
  saveUninitialized: true
}));

require('./modules/auth/auth_routes')(app);

require('./api/event_routes')(app);
require('./api/trade_routes')(app);
require('./api/account_routes')(app);

var port = process.env.PORT || 8080;
app.listen(port, function () {
	logger.info('Server started on port', port);
});
