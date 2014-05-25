var chai = require('chai'),
		should = chai.should(),
		expect = chai.expect,
		news = require('../../modules/ffnews/ffnews');

describe('Forex Factory news module', function () {
	it('should get valid data', function (done) {
		news.getNews(function (err, data) {
			expect(err).to.equal(null);
			data.should.be.an('object');
			done();
		});
	});
});

describe('CleanJSON function', function () {
	it('should parse errant JSON', function () {
		var data = {
			'weeklyevents': {
				'event': [
					{
						'title': ['Some Title'],
						'impact': ['some impact']
					}
				]
			}
		};
		var expect = [
			{
				'title': 'Some Title',
				'impact': 'some impact'
			}
		];
		var result = news.cleanJSON(data);
		result[0].title.should.equal(expect[0].title);
		result[0].impact.should.equal(expect[0].impact);
	});
	it('should not panic', function () {
		news.cleanJSON({
			'unexpected': {
				'nested': 'values'
			}
		});
		news.cleanJSON({
			'weeklyevents': {
				'something': ['unexpected']
			}
		});
		news.cleanJSON(undefined);
	});
});

describe('FormatDates function', function () {
	it('should parse date info to timestamp', function () {
		var data = [
			{
				'date': '05-12-2014',
				'time': '11:50am'
			}
		];
		var expect = [
			{
				'time': 1399895400000
			}
		];
		var result = news.formatDates(data);
		result[0].time.should.equal(expect[0].time);
	});
	it('should handle times with no leading 0', function () {
		var data = [
			{
				'date': '05-13-2014',
				'time': '5:30am'
			}
		];
		var expect = [
			{
				'time': 1399959000000
			}
		];
		var result = news.formatDates(data);
		result[0].time.should.equal(expect[0].time);
	});
	it('should convert pm times to military time', function () {
		var data = [
			{
				'date': '05-13-2014',
				'time': '2:30pm'
			}
		];
		var expect = [
			{
				'time': 1399991400000
			}
		];
		var result = news.formatDates(data);
		result[0].time.should.equal(expect[0].time);
	});
});
