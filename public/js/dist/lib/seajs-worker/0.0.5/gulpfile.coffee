path    = require 'path'
gulp    = require 'gulp'
gutil   = require 'gulp-util'
coffee  = require 'gulp-coffee'
connect = require 'gulp-connect'
watch   = require 'gulp-watch'

# Sources
coffee_src    = './src/**/*.coffee'
coffee_dst    = './dist'
test_src      = './tests/coffee/**/*.coffee'
test_dst      = './tests/spec'

watch_sources = ->
  gulp.watch coffee_src, ['coffee']
  gulp.watch test_src, ['build_test']

compile_coffee = (src = coffee_src, dst = coffee_dst)->
  gulp.src src
    .pipe coffee bare: true
    .on 'error', gutil.log
    .pipe gulp.dest dst

gulp.task 'coffee', ->
  compile_coffee()

gulp.task 'build_test', ->
  compile_coffee test_src, test_dst

gulp.task 'server', ['coffee'], ->
  connect.server
    livereload: true

gulp.task 'watch', ->
  watch_sources()

gulp.task 'livereload', ->
  gulp.src [coffee_src, test_src], read: false
    .pipe watch()
    .pipe connect.reload()

gulp.task 'default', ['coffee', 'build_test', 'watch', 'server', 'livereload']
