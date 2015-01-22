var gulp = require('gulp');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var jshint  = require('gulp-jshint');
var stylish = require('jshint-stylish');
var Pageres = require('pageres');

var paths = {
  js:     ['./*.js', './test/**/*.js'],
  test:   ['./test/**'],
  runner: './test/runner.html'
};

gulp.task('test', function () {
  return gulp
  .src(paths.runner)
  .pipe(mochaPhantomJS());
});

gulp.task('test-watch', function() {
  return gulp.watch(paths.test.concat(paths.js), ['test']);
});

gulp.task('jshint', function() {
  return gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});
gulp.task('jshint-watch', function() {
  return gulp.watch(paths.js, ['jshint']);
});

gulp.task('screenshot', function(cb) {
  var pageres = new Pageres({delay: 2})
      .src('test/runner.html', ['800x5000'])
      .dest(__dirname);
  pageres.run(function (err) {
      if (err) {
          throw err;
      }
      cb();
  });
});

gulp.task('watch', ['jshint-watch', 'test-watch']);
gulp.task('default', ['watch']);
