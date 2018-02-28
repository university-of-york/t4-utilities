module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        force:true,
        evil:true,
        moz:true,
        sub:true,
        rhino:true
      },
      files: ['src/**/*.js']
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    jsdoc: {
      dist: {
        src: ['src/**/*.js', 'package.json', 'README.md'],
        options: {
          destination: 'doc'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('default', ['jshint', 'jsdoc']);

};