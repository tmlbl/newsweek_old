var superagent = require('superagent'),
		chai = require('chai'),
		db = require('../../db/db');
		expect = chai.expect;

describe.only('Forex News API', function () {
	var obj;
	it('must load a model', function (done) {
		db.NewsEvent.findOne({ country: 'USD' }, function (err, doc) {
			obj = doc;
			console.log(doc);
			done();
		});
	});
	it('should return the news', function (done) {
		superagent.get('http://127.0.0.1:8080/api/events')
			.end(function (err, res) {
				expect(err).to.equal(null);
				done();
			});
	});
	it('should get an event by id', function (done) {
		superagent.get('http://127.0.0.1:8080/api/events/' + obj._id)
			.end(function (err, res) {
				expect(err).to.equal(null);
				expect(res.body.title).to.equal(obj.title);
				done();
			});
	});
	it('should modify an event', function (done) {
		superagent.post('http://127.0.0.1:8080/api/events/' + obj._id)
			.send({ trading: true })
			.end(function (err, res) {
				console.log(doc);
				expect(err).to.equal(null);
				db.NewsEvent.findById(obj._id, function (err, doc) {
					expect(err).to.equal(null);
					expect(doc.trading).to.equal(true);
					done();
				});
			});
	});
});
