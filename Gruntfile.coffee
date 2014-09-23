#global module:false

"use strict"

module.exports = (grunt) ->
  grunt.loadNpmTasks "grunt-bower-task"
  grunt.loadNpmTasks "grunt-contrib-copy"

  grunt.initConfig

    copy:
      jquery:
        files: [{
          expand: true
          cwd: "bower_components/jquery/dist/"
          src: "jquery.min.js"
          dest: "vendor/js/"
        }]
      threejs:
        files: [{
          expand: true
          cwd: "bower_components/threejs/build/"
          src: "three.min.js"
          dest: "vendor/js/"
        }]
      statsjs:
        files: [{
          expand: true
          cwd: "bower_components/stats.js/build/"
          src: "stats.min.js"
          dest: "vendor/js/"
        }]
      datgui:
        files: [{
          expand: true
          cwd: "bower_components/dat-gui/build/"
          src: "dat.gui.min.js"
          dest: "vendor/js/"
        }]
 
  grunt.registerTask "deps", [
    "copy"
  ]