var chai = require('chai'),
		OandaClient = require('../../modules/oanda/client.js'),
		config = require('../../config.js');

describe.only('Oanda Client Class', function () {
	var client,
			acctId;
	beforeEach(function () {
		client = new OandaClient(config.apiKey, acctId);
	});

	it('should get the price of an instrument', function (done) {
		client.getPrices({instruments: ['EUR_USD']}, function (err, res) {
			if (err) {
				throw err;
			}
			if (!res) {
				throw new Error('Didn\'t get price for instrument');
			}
			done();
		});
	});

	it('should get accounts for a user', function (done) {
		client.getAccounts(function (err, res) {
			if (err) {
				throw err;
			}
			acctId = res.accounts[0].accountId;
			if (res.length < 1 || !acctId) {
				throw new Error('Didn\'t get a user');
			}
			done();
		});
	});

	it('should get a specific account', function (done) {
		client.getAccountInfo(function (err, res) {
			if (err) {
				throw err;
			}
			if (!res) {
				throw new Error('Didn\'t get account info for ' + acctId);
			}
			done();
		});
	});

	it('should get open positions', function (done) {
		client.getPositions(function (err, res) {
			if (!res.hasOwnProperty('positions')) {
				throw new Error('Didn\'t get positions');
			}
			done();
		});
	});

	it('should create an order', function (done) {
		client.openOrder({
			instrument: 'EUR_USD',
			units: 0.01,
			side: 'sell',
			price: 200,
			type: 'limit',
			takeProfit: 300,
			upperBound: 0,
			lowerBound: 0,
			trailingStop: 10
		}, function (err, res) {
			console.log(res);
			if (err) {
				throw err;
			}
			if (res.code !== 1) {
				throw new Error('Got non-success status code ' + res.code);
			}
			done();
		});
	});
});
