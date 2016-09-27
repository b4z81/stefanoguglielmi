var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('script', function() {
  gulp.src('./src/js/*.js')
    .pipe(browserify())
    .pipe(gulp.dest('./dist/js'));
});


gulp.task('compress', function (cb) {
  pump([
        gulp.src('./dist/js/*.js'),
        uglify(),
        gulp.dest('./dist/js')
    ],
    cb
  );
});
