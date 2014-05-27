module.exports = function (grunt) {
	grunt.initConfig({
		run: {
			options: {
				failOnError: true
			},
			sampledata: {
				cmd: 'node',
				args: [
						'modules/ffnews/ffnews_genTestData.js'
				]
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			}
		},
		simplemocha: {
			options: {
				globals: [
					'should'
				],
				timeout: 5000,
				ignoreLeaks: false,
				ui: 'bdd',
				reporter: 'xunit-file'
			},
			unit: {
				src: [
					'test/unit/*.js'
				]
			},
			integration: {
				src: [
					'test/integration/*.js'
				]
			},
			e2e: {
				src: [
					'test/endtoend/*.js'
				]
			}
		},
		express: {
			test: {
				options: {
					script: './app.js',
					port: 8080
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-run');
	grunt.loadNpmTasks('grunt-env');
	var test = [
		'env:test',
		'simplemocha:unit',
		'run:sampledata',
		'simplemocha:integration',
		'express:test',
		'simplemocha:e2e'
	];
	grunt.registerTask('test', test);
};
