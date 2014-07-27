var request = require('request'),
		url = require('url'),
		config = require('../../config');

module.exports = OandaClient;

function OandaClient(apiToken, accountId) {
	this.apiToken = apiToken;
	this.accountId = accountId;
	this.endpoint = config.apiHost;
}

OandaClient.prototype._request = function (url, method, body, cb) {
	var options = {
		url: url,
		method: method,
		headers: {
			'Authorization': 'Bearer ' + this.apiToken
		}
	};
	request(options, function (err, res) {
		if (err) return cb(err);
		cb(null, JSON.parse(res.body));
	});
};

OandaClient.prototype._get = function (url, cb) {
	this._request(url, 'GET', {}, cb);
};

OandaClient.prototype._post = function (endpoint, body, cb) {
	var uri = url.parse(endpoint);
	uri.query = body;
	var fmturl = url.format(uri);
	console.log(fmturl);
	this._request(fmturl, 'POST', {}, cb);
};

OandaClient.prototype._delete = function (url, cb) {
	this._request(url, 'DELETE', {}, cb);
};

OandaClient.prototype.getPrices = function (params, cb) {
	var uri = url.parse(this.endpoint);
	uri.query = params;
	uri.pathname = '/v1/prices'
	var fmturl = url.format(uri);
	this._get(fmturl, cb);
};

OandaClient.prototype.getAccounts = function (cb) {
	this._get(this.endpoint + '/v1/accounts', cb);
};

OandaClient.prototype.getAccountInfo = function (cb) {
	this._get(this.endpoint + '/v1/accounts/' + this.accountId, cb);
};

OandaClient.prototype.getPositions = function (cb) {
	this._get(this.endpoint + '/v1/accounts/' + this.accountId + '/positions', cb);
};

OandaClient.prototype.openOrder = function(order, cb) {
	this._post(this.endpoint + '/v1/accounts/' + this.accountId +
		'/orders', order, cb);
};

OandaClient.prototype.closeOrder = function(orderId, cb) {
	this._delete(this.endpoint + '/v1/accounts' + this.accountId +
		'/orders/' + orderId, cb);
};
