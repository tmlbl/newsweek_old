var Trader = require('../../modules/trader/trader'),
    mongoose = require('mongoose');

require('../../common/logger');

describe('Trader class', function () {
  var trader;

  it('should initialize the class', function () {
    trader = new Trader({
      account: 	8564825,
      token: '7d5100fcb48f09bff2c85a92b5ef6639-' +
          '744dfed42981e7020c732a34184da930'
    },
    {
      time: Date.now() + 500,
      units: 2,
      instrument: 'EUR_USD',
      event: mongoose.Types.ObjectId()
    });
    if (!trader.execute) {
      throw new Error('Didn\'t find the class object');
    }
  });

  it('should be marked as completed', function (next) {
    setTimeout(function () {
      if (!trader.completed) {
        throw new Error('The trade was not marked as completed');
      }
    }, 900);
    setTimeout(next, 1000);
  });

});
