module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
     dist: {
       src: ['src/**/*.js'],
       dest: 'dist/utils.js'
     },
     options: {
       separator: '\n',
       banner: '/* global dbStatement, publishCache, section, content, language, isPreview, com, org, importPackage, java, MediaManager, BufferedReader, BufferedWriter, InputStreamReader, FileWriter */\n /**\n * Javascript utilities for use within programmable layouts.\n */\n ({\n',
       footer: '}).init();\n'
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
    uglify: {
      compress: {
        files: {
          'dist/utils.min.js': ['dist/utils.js']
        },
        options: {
          mangle: false
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', [ 'uglify', 'concat', 'jsdoc', 'mochaTest', 'eslint', 'watch']);

};
