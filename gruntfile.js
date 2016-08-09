module.exports = function(grunt) {
	grunt.config.init({
		watch: {
			client: {
				files: ['*.*'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
			}
		},
		connect: {
			options: {
				port: 9000,
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('connect-livereload');
	grunt.registerTask('server', ['connect:livereload', 'watch']);
};