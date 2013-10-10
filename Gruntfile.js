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