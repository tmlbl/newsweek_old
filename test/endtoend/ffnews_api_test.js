var superagent = require('superagent'),
		chai = require('chai'),
		expect = chai.expect;

describe('Forex News API', function () {
	it('should execute the fetch operation', function (done) {
		superagent.get('http://localhost:8080/api/news/fetch')
			.end(function (err, res) {
				expect(err).to.equal(null);
				expect(res.body[0].title).to.be.a('string');
				done();
			});
	});
	it('should return the latest news', function (done) {
		superagent.get('http://localhost:8080/api/news/latest')
			.end(function (err, res) {
				expect(err).to.equal(null);
				expect(res.body[0].title).to.be.a('string');
				done();
			});
	});
});
