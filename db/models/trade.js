var mongoose = require('mongoose');

var TradeSchema = new mongoose.Schema({
	'time'         : { type: Date, required: true, index: true },
	'instrument'   : { type: String, required: true },
	'units'        : { type: Number, required: true },
	'side'         : { type: String, required: true },
	'type'         : { type: String, required: true },
	'expiry'       : { type: Date },
	'price'        : { type: Number },
	'lowerBound'   : { type: Number },
	'upperBound'   : { type: Number },
	'stopLoss'     : { type: Number },
	'takeProfit'   : { type: Number },
	'trailingStop' : { type: Number }
});

module.exports = mongoose.model('Trade', TradeSchema);
