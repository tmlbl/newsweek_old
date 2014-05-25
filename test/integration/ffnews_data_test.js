var chai = require('chai'),
		should = chai.should(),
		expect = chai.expect,
		fs = require('fs'),
		path = require('path'),
		db = require('../../db/db'),
		news = require('../../modules/ffnews/ffnews');

function cleanUp (cb) {
	
}

describe('Live data set', function () {
	var data;
	it('should load and parse data', function (done) {
		fs.readFile(path.resolve('test/integration/sampledata'), 'utf8', function (err, file) {
			if (err) {
				console.error('There was an error loading the sample data file:');
				throw err;
			}
			if (file) {
				try {
					data = JSON.parse(file);
				} catch (err) {
					console.error('Error parsing sample json:');
					throw err;
				}
			}
			done();
		});
	});
	it('should be formed as expected', function () {
		data.should.be.an('object');
		data.weeklyevents.should.be.an('object');
		data.weeklyevents.event.should.be.an('array');
	});
	it('should parse all times without errors', function () {
		var events = data;
		events = news.cleanJSON(events);
		events = news.formatDates(events);
		events.forEach(function (el) {
			var is = isNaN(el.time);
			if (is) {
				console.error('Badly parsed datetime: ' + el.date + ' ' + el.old);
			}
			expect(is).to.equal(false);
		});
	});
});
