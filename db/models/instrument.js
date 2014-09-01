var mongoose = require('mongoose');

var InstrumentSchema = new mongoose.Schema({
  'name' : { type: String, unique: true },
  'pip'  : { type: Number }
});

module.exports = mongoose.model('Instrument', InstrumentSchema);
