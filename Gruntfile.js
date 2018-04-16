module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
     dist: {
       src: ['src/utils.js','src/init.js'],
       dest: 'dist/utils.js'
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
    mochaTest: {
      test: {
        options: {
          reporter: 'doc',
          captureFile: 'reports/mocha.html' // Optionally capture the reporter output to a file
        },
        src: ['test/**/*.js']
      }
    },
    jsdoc: {
      dist: {
        src: ['dist/utils.js', 'package.json', 'README.md'],
        options: {
          destination: 'doc'
        }
      }
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
