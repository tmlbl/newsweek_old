var mongoose = require('mongoose'),
		ObjectId = mongoose.Schema.ObjectId;

var EventSchema = new mongoose.Schema({
	'title'      : { type: String, required: true },
	'time'       : { type: Date, required: true, index: true },
	'impact'     : { type: String },
	'country'    : { type: String, required: true },
	'forecast'   : { type: String },
	'previous'   : { type: String },
	'trading'    : { type: Boolean }
});

module.exports = mongoose.model('NewsEvent', EventSchema);
