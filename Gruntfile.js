module.exports = function(grunt) {
	// project configuration
	grunt.initConfig({
    shell: { mongo: { command : 'mongod' } }   
  });
	
	grunt.loadNpmTask('');

  grunt.registerTask('default', []);   
};
