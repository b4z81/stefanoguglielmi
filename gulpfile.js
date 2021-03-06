
var browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    livereload = require('gulp-livereload'),
    merge      = require('merge'),
    rename     = require('gulp-rename'),
    source     = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    watchify   = require('watchify'),
    watch = require("gulp-watch"),
    browserSync = require('browser-sync').create(),
    autoprefixer = require("gulp-autoprefixer"),
    uglify = require("gulp-uglify"),
    sass = require("gulp-sass"),
    imagemin = require("gulp-imagemin");

    var config = {
        js: {
            src: './src/js/app.js',       // Entry point
            outputDir: './dist/js/',  // Directory to save bundle to
            mapDir: './maps/',      // Subdirectory to save maps to
            outputFile: 'app.js' // Name to use for bundle
        },
    };

function bundle (bundler) {
  bundler
    .bundle()
    .pipe(source(config.js.src))
    .pipe(buffer())
//    .pipe(uglify())
    .pipe(rename(config.js.outputFile))
    .pipe(sourcemaps.init({ loadMaps : true }))
    .pipe(sourcemaps.write(config.js.mapDir))
    .pipe(gulp.dest(config.js.outputDir))
}

gulp.task('bundle', function () {
    var bundler = browserify(config.js.src)  // Pass browserify the entry point

    bundle(bundler);  // Chain other options -- sourcemaps, rename, etc.
})

gulp.task('scripts', function() {
  gulp.src('src/js/**/*.js')
    //  .pipe(buffer())
    //  .pipe(sourcemaps.init({loadMaps: true}))
          //.pipe(uglify())
          .on('error', gutil.log)
//      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist/js/'))
});

gulp.task("concat-js", function () {
    var jsFiles = ['./lib/file3.js', './lib/file1.js', './lib/file2.js'];
    return gulp.src(jsFiles)
        .pipe(concat("app.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"));
});


gulp.task('server', function () {
    browserSync.init({
        injectChanges: true,
        logLevel: "debug",
        server: "./dist/",
        browser: "google chrome"

        /* set the index file */
    });

    gulp.watch("src/scss/**/*.scss", ['sass']).on('change', browserSync.reload);
    gulp.watch("src/js/**/*.js", ['bundle']).on('change', browserSync.reload);
    gulp.watch("dist/**/*.html").on('change', browserSync.reload);
});

gulp.task('sass', function(){
    return gulp.src('./src/scss/style.scss')
                .pipe(sourcemaps.init())
                .pipe(sass({
                  includePaths: require('bourbon').includePaths,
                  outputStyle: 'compressed' })
                .on('error', sass.logError))
                .on('error', gutil.log)
                .pipe(autoprefixer('last 2 versions'))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest('./dist/css/'));

});

gulp.task("image-min", function () {
  gulp.src('./src/img/**/*.jpg')
      //.pipe(optipng({ optimizationLevel: 3 })())
      //.pipe(pngquant({ quality: "65-80", speed: 4 })())
      .pipe(imagemin())
      .pipe(gulp.dest('./dist/img'));
});

gulp.task("develop", ["sass","bundle","server"]);
