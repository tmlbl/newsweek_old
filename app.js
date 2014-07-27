var express = require('express'),
		winston = require('winston'),
		bodyParser = require('body-parser'),
		session = require('express-session'),
		cookieParser = require('cookie-parser'),
		app = express();

require('./db/dev_test_data')();

app.use('/static', express.static(__dirname + '/static'));
app.use(function (req, res, next) {
	console.log(req.method + ' ' + req.url);
	next();
});
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
	secret: 'gwyneviere'
}));

winston.add(winston.transports.File, { filename: 'winston.log' });
winston.info('Starting the application...');

require('./modules/auth/auth_routes')(app);

require('./api/event_routes')(app);
require('./api/trade_routes')(app);

var port = process.env.PORT || 8080;
app.listen(port, function () {
	winston.info('Server started on port', port);
});
