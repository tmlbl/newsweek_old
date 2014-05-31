var mongoose = require('mongoose'),
		ObjectId = mongoose.Schema.ObjectId;

var TradeGroupSchema = new mongoose.Schema({
	'time'       : { type: Date, required: true, index: true },
	'event'      : { type: ObjectId, required: true, ref: 'NewsEvent' },
	'instrument' : { type: String, required: true },
	'units'      : { type: Number, required: true },
	'user'       : { type: ObjectId, ref: 'User' },
	'trades'     : [{ type: ObjectId, ref: 'Trade' }]
});

module.exports = mongoose.model('TradeGroup', TradeGroupSchema);
