  module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        files: ['Gruntfile.js','public/javascripts/**/*.js', 'test/**/*.js'],
        options: {
            ignores: [
              'public/javascripts/vendor/**/*.js',
              'public/javascripts/require.js',
              'public/javascripts/text.js',
              'public/javascripts/*.min.js'
              ]
        }
    },
    uglify: {
      options: {
        preserveComments: 'some',
      },
      my_target: {
        files: {
          'public/javascripts/dataStore.min.js': ['public/javascripts/dataStore.js']
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
        files: ['public/javascripts/**/*.js','test/**/*.js'],
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