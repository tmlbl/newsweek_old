var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
	'title'      : { type: String, required: true },
	'time'       : { type: Date, required: true, index: true },
	'impact'     : { type: String },
	'country'    : { type: String, required: true },
	'forecast'   : { type: String },
	'previous'   : { type: String },
	'trading'    : { type: Boolean, default: false }
});

module.exports = mongoose.model('NewsEvent', EventSchema);
