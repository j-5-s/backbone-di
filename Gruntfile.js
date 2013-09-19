module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        files: ['Gruntfile.js','javascripts/**/*.js', 'test/**/*.js'],
        options: {
            ignores: ['javascripts/vendor/**/*.js', 'javascripts/require.js', 'javascripts/text.js']
        }
    },

    watch: {
      scripts: {
        files: ['app/javascripts/**/*.js','test/**/*.js'],
        tasks: ['jshint'],
        options: {
          spawn: false,
        },
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['jshint']);
  grunt.loadNpmTasks('grunt-contrib-watch');

};