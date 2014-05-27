var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var EventSchema = new mongoose.Schema({
	'title'    : { type: String, required: true },
	'time'     : { type: Date, required: true, index: true },
	'impact'   : { type: String },
	'country'  : { type: String, required: true },
	'forecast' : { type: String },
	'previous' : { type: String },
	'trading'  : { type: Boolean },
	'trades'   : { type: Schema.ObjectId }
});

module.exports = mongoose.model('NewsEvent', EventSchema);
