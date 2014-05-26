var express = require('express'),
		news = require('./modules/ffnews/ffnews'),
		winston = require('winston'),
		app = express();

app.use('/static', express.static(__dirname + '/static'));

winston.add(winston.transports.File, { filename: 'winston.log' });
winston.remove(winston.transports.Console);
winston.info('Starting the application...');

app.get('/', function (req, res) {
	res.sendfile('./main.html', {}, function (err) {
		if (!err) {
			winston.info('User accessed index.html');
		}
	});
});

require('api/news_routes')(app);
require('api/trade_routes')(app);

var port = process.env.PORT || 8080;
app.listen(port, function () {
	console.log('Server started on port', port);
});
