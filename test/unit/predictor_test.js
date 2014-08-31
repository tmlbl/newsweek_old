var request = require('request'),
    Predictor = require('../../modules/predictor/predict');

var data = {},
    predictor;

describe('Predictor', function () {

  it('getting price data for testing...', function (next) {
    var reqtime = Date.now(),
        numcandles = 20;

    request.get('http://api-sandbox.oanda.com/v1/candles?' +
            'instrument=EUR_USD&count=' + numcandles +
            '&candleFormat=midpoint&granularity=D&' +
            'dailyAlignment=0&alignmentTimezone=America%2FLos_Angeles',

        function (err, res, body) {
          var restime = Date.now(),
              time = restime - reqtime,
              bodydata = JSON.parse(body);
          console.log('Retrieved ' + numcandles +
              ' EUR_USD candles (' + time + 'ms)');
          data = {
            err: err,
            body: bodydata
          };
          next();
        });
  });

  it('should make a prediction', function () {
    predictor = new Predictor(data.body.candles);
    var prediction = predictor.regress()(Date.now() + 1000 * 60 * 60 * 30);
    if (!typeof prediction === 'number') {
      throw new Error('Didn\'t predict a number');
    }
  });

});
