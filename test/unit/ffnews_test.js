var should = require("should"),
		news = require("../../modules/ffnews");

describe("Forex Factory news module", function () {
	it("should get valid data", function () {
		news(function (err, data) {
			err.should.equal(null);
			data.should.be.an("object");
			data[0].should.be.an("object");
		});
	});
});

describe("CleanJSON function", function () {
	it("should parse errant JSON", function () {
		var sampleData = {
			"weeklyevents": {
				"event": [
					{
						"title": ["Some Title"],
						"impact": ["some impact"]
					}
				]
			}
		};
		var expectResult = [
			{
				"title": "Some Title",
				"impact": "some impact"
			}
		];
		var result = news.testCleanJSON(sampleData);
		result[0].title.should.equal(expectResult[0].title);
		result[0].impact.should.equal(expectResult[0].impact);
	});
	it("should not panic", function () {
		news.testCleanJSON({
			"unexpected": {
				"nested": "values"
			}
		});
		news.testCleanJSON({
			"weeklyevents": {
				"something": ["unexpected"]
			}
		});
		news.testCleanJSON(undefined);
	});
});
