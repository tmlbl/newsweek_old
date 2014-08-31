'use strict';

var ss = require('simple-statistics'),
    _ = require('lodash');

module.exports = Predictor;

/**
 * Predictor performs mapreduce operations on candle data
 * to make short-term predictions
 */
function Predictor (candles) {
  this.candles = candles;
}

/**
 * Returns a linear regression function that can accept a
 * Datetime and return a predicted price
 * @return {Function} regression (datetime)
 */
Predictor.prototype.regress = function () {
  var linedata = _.map(this.candles, function (candle) {
    return [ Date.parse(candle.time), candle.closeMid ];
  });
  return ss.linear_regression().data(linedata).line();
};

/**
 * Returns the skewness of the instrument price for the dataset
 * @return {Number}
 */
Predictor.prototype.skewness = function () {
  var linedata = _.map(this.candles, function (candle) {
    return candle.closeMid;
  });
  return ss.sample_skewness(linedata);
};
