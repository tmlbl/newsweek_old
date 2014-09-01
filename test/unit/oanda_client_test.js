var OandaClient = require('../../modules/oanda/client.js'),
		config = require('../../config.js');

describe('Oanda API Client', function () {
	var client,
			acctId,
			orderId,
      trading;

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
      console.dir(res.positions);
			done();
		});
	});

	it('should create a trade', function (done) {
		client.openTrade({
			type: 'market',
			instrument: 'EUR_USD',
			side: 'sell',
			units: 2
		}, function (err, res) {
			if (err && err.code === 24) {
				console.log('Trading is halted');
        trading = false;
			} else if (err) {
        throw err;
      } else {
        orderId = res.tradeOpened.id;
        trading = true;
        console.log('Opened order ' + orderId);
      }
			done();
		});
	});

	it('should get information on that trade', function (done) {
    if (!trading) {
      return done();
    }
		client.getTradeInfo(orderId, function (err, res) {
			if (err) {
				throw err;
			}
			if (res.code) {
				throw new Error('Got error code ' + res.code);
			}
			done();
		});
	});

	it('should close all trades', function (done) {
    if (!trading) {
      return done();
    }
    client.getTrades(function (err, res) {
      var least;
      res.trades.forEach(function (trade) {
        if (!least || trade.time < least) {
          least = trade;
        }
      });
      client.closeTrade(least.id, function (err) {
        if (err) {
          throw err;
        }
        console.log('Closed order ' + least.id);
        done();
      });
    });
	});
});
