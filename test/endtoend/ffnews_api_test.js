var superagent = require('superagent'),
		chai = require('chai'),
		news = require('../../modules/ffnews/ffnews'),
		expect = chai.expect;

describe.only('Forex News API', function () {
	var obj;
	it('should populate the db', function (done) {
		news.fetch(function (err) {
			if (err) throw err;
			done();
		});
	});
	it('should return the latest news', function (done) {
		superagent.get('http://localhost:8080/api/events/latest')
			.end(function (err, res) {
				expect(err).to.equal(null);
				expect(res.body[0].title).to.be.a('string');
				obj = res.body[3];
				done();
			});
	});
	it('should get an event by id', function (done) {
		superagent.get('http://localhost:8080/api/events/' + obj._id)
			.end(function (err, res) {
				expect(res.body.title).to.equal(obj.title);
				done();
			});
	});
});
