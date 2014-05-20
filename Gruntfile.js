module.exports = function (grunt) {
	grunt.initConfig({
		simplemocha: {
			options: {
				globals: ['should'],
				timeout: 3000,
				ignoreLeaks: false,
				ui: 'bdd',
				reporter: 'spec'
			},
			all: { src: ['test/**/*.js'] }
		}
	});
	grunt.loadNpmTasks("grunt-simple-mocha");
	grunt.registerTask("test", ["simplemocha"]);
};
