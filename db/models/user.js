var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	'username': { type: String, required: true },
	'password': { type: String, required: true },
	'token'   : { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
