  module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        files: ['Gruntfile.js','javascripts/**/*.js', 'test/**/*.js'],
        options: {
            ignores: [
              'javascripts/vendor/**/*.js',
              'javascripts/require.js',
              'javascripts/text.js',
              'javascripts/*.min.js'
              ]
        }
    },
    uglify: {
      options: {
        preserveComments: 'some',
      },
      my_target: {
        files: {
          'javascripts/dataStore.min.js': ['javascripts/dataStore.js']
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        runnerPort: 9999,
        //autoWatch: true,
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },
    watch: {
      scripts: {
        files: ['javascripts/**/*.js','test/**/*.js'],
        tasks: ['jshint', 'uglify'],
        options: {
          spawn: false,
        },
      }
    }
  });
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  grunt.registerTask('default', ['jshint', 'uglify']);
  grunt.loadNpmTasks('grunt-contrib-watch');

};