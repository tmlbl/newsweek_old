var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var TradeGroupSchema = new mongoose.Schema({
	'time'       : { type: Date, required: true, index: true },
	'event'      : { type: Schema.ObjectId, required: true, ref: 'NewsEvent' },
	'instrument' : { type: String, required: true },
	'units'      : { type: Number, required: true },
	'trades'     : [{ type: Schema.ObjectId }]
});

module.exports = mongoose.model('TradeGroup', TradeGroupSchema);
