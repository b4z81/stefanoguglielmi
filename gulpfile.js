
var browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    livereload = require('gulp-livereload'),
    merge      = require('merge'),
    rename     = require('gulp-rename'),
    source     = require('vinyl-source-stream'),
    sourceMaps = require('gulp-sourcemaps'),
    watchify   = require('watchify');


var config = {
    js: {
        src: './src/js/app.js',       // Entry point
        outputDir: './dist/js/',  // Directory to save bundle to
        mapDir: './maps/',      // Subdirectory to save maps to
        outputFile: 'app.js' // Name to use for bundle
    },
};
function bundle (bundler) {

    // Add options to add to "base" bundler passed as parameter
    bundler
      .bundle()                                                        // Start bundle
      .pipe(source(config.js.src))                        // Entry point
      .pipe(buffer())                                               // Convert to gulp pipeline
      .pipe(rename(config.js.outputFile))          // Rename output from 'main.js'
                                                                              //   to 'bundle.js'
    //  .pipe(sourceMaps.init({ loadMaps : true }))  // Strip inline source maps
    //  .pipe(sourceMaps.write(config.js.mapDir))    // Save source maps to their
                                                                                      //   own directory
      .pipe(gulp.dest(config.js.outputDir))        // Save 'bundle' to build/
      .pipe(livereload());                                       // Reload browser if relevant
}

gulp.task('bundle', function () {
    var bundler = browserify(config.js.src)  // Pass browserify the entry point

    bundle(bundler);  // Chain other options -- sourcemaps, rename, etc.
})
