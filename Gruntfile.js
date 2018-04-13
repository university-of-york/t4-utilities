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

  grunt.registerTask('default', ['eslint', 'jsdoc']);

};
