var request = require('request'),
		url = require('url'),
		config = require('../../config');

module.exports = OandaClient;

function OandaClient(apiToken, accountId) {
	this.apiToken = apiToken;
	this.accountId = accountId;
	this.endpoint = 'https://' + config.apiHost;
}

OandaClient.prototype._request = function (url, method, body, cb) {
	var options = {
		url: url,
		method: method,
		form: body,
		headers: {
			'Authorization': 'Bearer ' + this.apiToken,
			'Content-Type': 'application/x-www-form-urlencoded',
      'X-Accept-Datetime-Format': 'UNIX'
		}
	};
	request(options, function (err, res) {
    var data = JSON.parse(res.body);
    if (data && data.code) {
      err = data;
    }
		if (err) return cb(err);
		cb(null, data);
	});
};

OandaClient.prototype._get = function (url, cb) {
	this._request(url, 'GET', {}, cb);
};

OandaClient.prototype._post = function (endpoint, body, cb) {
	this._request(endpoint, 'POST', body, cb);
};

OandaClient.prototype._delete = function (url, cb) {
	this._request(url, 'DELETE', {}, cb);
};

OandaClient.prototype.getPrices = function (params, cb) {
	var uri = url.parse(this.endpoint);
	uri.query = params;
	uri.pathname = '/v1/prices';
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
	this._get(this.endpoint + '/v1/accounts/' + this.accountId +
      '/positions', cb);
};

OandaClient.prototype.getOrders = function (cb) {
  this._get(this.endpoint + '/v1/accounts/' + this.accountId +
      '/orders', cb);
};

OandaClient.prototype.getTrades = function (cb) {
  this._get(this.endpoint + '/v1/accounts/' + this.accountId +
      '/trades', cb);
};

OandaClient.prototype.openTrade = function (order, cb) {
	this._post(this.endpoint + '/v1/accounts/' + this.accountId +
		  '/orders', order, cb);
};

OandaClient.prototype.getTradeInfo = function (orderId, cb) {
	this._get(this.endpoint + '/v1/accounts/' + this.accountId +
		  '/trades/' + orderId, cb);
};

OandaClient.prototype.closeTrade = function (orderId, cb) {
	this._delete(this.endpoint + '/v1/accounts/' + this.accountId +
		  '/trades/' + orderId, cb);
};
