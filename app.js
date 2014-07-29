var express = require('express'),
		bodyParser = require('body-parser'),
		session = require('express-session'),
		cookieParser = require('cookie-parser'),
		app = express();

require('./db/dev_test_data')();

require('./common/logger');

app.use('/static', express.static(__dirname + '/static'));
app.use(function (req, res, next) {
	console.log(req.method + ' ' + req.url);
	next();
});
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
	secret: 'daggeurotype'
}));

require('./modules/auth/auth_routes')(app);

require('./api/event_routes')(app);
require('./api/trade_routes')(app);
require('./api/account_routes')(app);

var port = process.env.PORT || 8080;
app.listen(port, function () {
	logger.info('Server started on port', port);
});
