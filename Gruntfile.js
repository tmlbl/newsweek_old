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
		mongoimport: {
			options: {
				db : 'test',
				host : 'localhost',
				stopOnError : true,
				collections : [
					{
						name : 'users',
						type : 'json',
						file : 'test/seeddata/users.json',
						jsonArray : true,
						upsert: true,
						drop : true
					},
					{
						name : 'tradegroups',
						type : 'json',
						file : 'test/seeddata/tradegroups.json',
						jsonArray : true,
						upsert: true,
						drop : true
					},
					{
						name : 'newsevents',
						type : 'json',
						file : 'test/seeddata/newsevents.json',
						jsonArray : true,
						upsert: true,
						drop : true
					}
				]
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
				reporter: 'spec'
			},
			unit: {
				src: [
					'test/unit/*.js'
				]
			},
			db: {
				src: [
					'test/integration/*.js'
				]
			},
			api: {
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
	grunt.loadNpmTasks('grunt-mongoimport');
	grunt.loadNpmTasks('grunt-run');
	grunt.loadNpmTasks('grunt-env');
	var test = [
		'env:test',
		'simplemocha:unit',
		//'run:sampledata',
		'mongoimport',
		'simplemocha:db',
		'express:test',
		'simplemocha:api'
	];
	grunt.registerTask('test', test);
	var dbtest = [
		'mongoimport',
		'simplemocha:db'
	];
	grunt.registerTask('test:db', dbtest);
};
