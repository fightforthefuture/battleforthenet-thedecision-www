var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');

var bundler = watchify(browserify('./src/index.jsx', watchify.args));

// Reactify
var reactify = require('reactify');
bundler.transform(reactify)
bundler.transform('brfs');

gulp.task('js', bundle); // Add task: 'gulp js'
bundler.on('update', bundle); // Bundle when dependencies are updated
function bundle() {
    return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error')) // Log errors

    .pipe(source('bundle.js'))

    // // Sourcemaps (optional)
    // .pipe(buffer()).pipe(sourcemaps.init({
    //     loadMaps: true
    // })) // Loads map from Browserify file
    // .pipe(sourcemaps.write('./')) // Creates .map file

    .pipe(gulp.dest('./dist'));
}
