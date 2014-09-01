var mongoose = require('mongoose');

var StrategySchema = new mongoose.Schema({
  'name'         : { type: String, unique: true },
  'straddle'     : { type: Number },
  'timeBefore'   : { type: Number },
  'stopLoss'     : { type: Number },
  'takeProfit'   : { type: Number },
  'trailingStop' : { type: Number }
});

module.exports = mongoose.model('Strategy', StrategySchema);
