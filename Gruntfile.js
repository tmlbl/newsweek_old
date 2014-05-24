module.exports = function (grunt) {
	grunt.initConfig({
		run: {
			options: {
				failOnError: true
			},
			sampledata: {
				cmd: "node",
				args: [
						"modules/ffnews_genTestData.js"
				]
			}
		},
		env: {
			test: {
				NODE_ENV: "test"
			}
		},
		simplemocha: {
			options: {
				globals: [
					"should"
				],
				timeout: 5000,
				ignoreLeaks: false,
				ui: "bdd",
				reporter: "spec"
			},
			unit: {
				src: [
					"test/unit/*.js"
				]
			},
			integration: {
				src: [
						"test/integration/*.js"
				]
			}
		}
	});
	grunt.loadNpmTasks("grunt-simple-mocha");
	grunt.loadNpmTasks("grunt-run");
	grunt.loadNpmTasks("grunt-env");
	var test = [
		"env:test",
		"simplemocha:unit",
		"run:sampledata",
		"simplemocha:integration"
	];
	grunt.registerTask("test", test);
};
