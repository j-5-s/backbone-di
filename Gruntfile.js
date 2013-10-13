  module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
        files: [
          'Gruntfile.js',
          'public/javascripts/**/*.js',
          'example/todo/**/*.js',
          'test/**/*.js'
        ],
        options: {
            ignores: [
              'public/javascripts/vendor/**/*.js',
              'example/todo/public/javascripts/vendor/**/*.js',
              '**/require.js',
              '**/text.js',
              '**/*.min.js'

              ]
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
        files: [
          'public/javascripts/**/*.js',
          'example/todo/**/*.js',
          'test/**/*.js',
          'backbone-di.js'
        ],
        tasks: ['shell'],
        options: {
          spawn: false,
        },
      }
    },
    shell: {
        cpBackboneDi: {
            command: 'cp backbone-di.js example/todo/public/javascripts && cp backbone-di.js public/javascripts'
        }
    }
  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-shell');


  grunt.registerTask('default', ['jshint', 'shell']);
  grunt.loadNpmTasks('grunt-contrib-watch');

};