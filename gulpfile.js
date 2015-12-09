var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('watch', function () {
  gulp.task('default')
  var watcher = gulp.watch('./app/js/*.js', ['default']);
  watcher.on('change', function(event) {
    console.log('File was ' + event.type + ', running tasks...');
  });
})

gulp.task('default', function () {
  gulp.src('app/js/app.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production
    }))
    .pipe(gulp.dest('build'))

  gulp.src('app/js/options.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production
    }))
    .pipe(gulp.dest('build'))

});
