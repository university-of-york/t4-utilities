module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
     dist: {
       src: ['src/**/*.js'],
       dest: 'dist/utils.js'
     }
   },
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
          reporter: 'markdown',
          captureFile: 'reports/mocha.md', // Optionally capture the reporter output to a file
        },
        src: ['test/**/*.js']
      }
    },
    eslint: {
       options: {
           configFile: '.eslintrc.json',
           outputFile: 'reports/lint.html',
           format: 'html'
       },
      target: ["dist/utils.js"]
    },
    watch: {
      files: ['dist/utils.js'],
      tasks: ['eslint', 'mochaTest']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks("gruntify-eslint");
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['concat', 'jsdoc', 'mochaTest', 'eslint', 'watch']);

};
