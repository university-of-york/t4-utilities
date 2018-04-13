module.exports = function(grunt) {

  grunt.initConfig({
    // watch: {
    //   files: ['<%= jshint.files %>'],
    //   tasks: ['jshint']
    // },
    jsdoc: {
      dist: {
        src: ['src/**/*.js', 'package.json', 'README.md'],
        options: {
          destination: 'doc'
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
          clearCacheFilter: (key) => true, // Optionally defines which files should keep in cache
          noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
        },
        src: ['test/**/*.js']
      }
    },
    eslint: {
       options: {
           configFile: '.eslintrc.json'
       },
       src: ['src/**/*.js']
    }
  });

  grunt.loadNpmTasks("gruntify-eslint");
  // grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.registerTask('default', ['eslint', 'jsdoc', 'mochaTest']);

};
