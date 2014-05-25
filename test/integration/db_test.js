var chai = require('chai'),
		should = chai.should(),
		expect = chai.expect,
		db = require('../../db/db.js');

function cleanUp (cb) {
	db.dropSeries('test', function (err) {
		if (err) throw err;
		db.query('SELECT * FROM test;', function (err, data) {
			expect(data.length).to.equal(0);
			cb();
		});
	});
}

describe('InfluxDB', function () {
	it('should clear the test collection', function (done) {
		cleanUp(function () {
			done();
		});
	});
	it('should write a point', function (done) {
		var point = {
			time: Date.now(),
			title: 'Johnson'
		};
		db.writePoint('test', point, {}, function (err) {
			expect(err).to.equal(null);
			done();
		});
	});
	it('should retrieve that point', function (done) {
		db.query('SELECT 1 FROM test;', function (err, data) {
			expect(err).to.equal(null);
			expect(data[0].name).to.equal('test');
			expect(data[0].points[0][2]).to.equal('Johnson');
			done();
		});
	});
	it('should clean up', function (done) {
		cleanUp(function () {
			done();
		});
	});
});

describe('DB Insert', function () {
	it('should clean up', function (done) {
		cleanUp(function () {
			done();
		});
	});
	it('should not insert duplicates', function (done) {
		var points = [
			{
				time: Date.now(),
				title: 'Johnson'
			},
			{
				time: Date.now() - 1000,
				title: 'Anders'
			}
		];
		db.writePoint('test', points[0], {}, function (err) {
			if (err) throw err;
			db.insert('test', points, function (err) {
				if (err) throw err;
				db.query('SELECT * FROM test;', function (err, data) {
					expect(err).to.equal(null);
					expect(data[0].name).to.equal('test');
					expect(data[0].points.length).to.equal(2);
					done();
				});
			});
		});
	});
	it('should clean up', function (done) {
		cleanUp(function () {
			done();
		});
	});
});
