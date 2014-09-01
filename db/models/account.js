var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
  'name'   : { type: String, unique: true },
  'number' : { type: Number },
  'user'   : { type: mongoose.Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Account', AccountSchema);
