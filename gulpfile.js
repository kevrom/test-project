'use strict';

var production = false;

// Module Requires
var path = require('path');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var watchify = require('watchify');
var _ = require('lodash');
var babelify = require('babelify');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');

// Gulp paths and options
var SRC_DIR = './client/src';
var BUILD_DIR = './dist';

var SRC_JS = path.join(SRC_DIR, 'js');
var SRC_SASS = path.join(SRC_DIR, 'sass');
var SRC_LESS = path.join(SRC_DIR, 'less');
var SRC_IMG = path.join(SRC_DIR, 'img');
var SRC_FONTS = path.join(SRC_DIR, 'fonts');
var SRC_PARTIALS = path.join(SRC_DIR, 'partials');

var BROWSERIFY_BUNDLES = [{
    debug: true,
    entries: SRC_JS + '/main.js',
    dest: BUILD_DIR,
    outputName: 'global.js',
    paths: ['./node_modules', './src/js'],
    fullPaths: true
}];

var BROWSERSYNC = {
    server: {
        baseDir: './client/src'
    }
};

// Move partials
gulp.task('partials', function() {
    return gulp.src(SRC_PARTIALS + '/**/*.html')
        .pipe(gulp.dest(path.join(BUILD_DIR, 'partials')))
        .pipe(gulpif(!production, browserSync.reload({
            stream: true
        })));
});

gulp.task('watch', function() {
    //gulp.watch(SRC_SASS + '/*', ['styles']);
    //gulp.watch(SRC_IMG + '/*', ['images']);
    gulp.watch(SRC_PARTIALS + '/*', ['partials']);
});

// Javscript linting
gulp.task('lint', function() {
    return gulp.src(SRC_JS)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

// Javascript assets pipeline
gulp.task('scripts', ['lint'], function(cb) {
    var queue = BROWSERIFY_BUNDLES.length;

    function browserifyIt(config) {
        _.extend(config, {
            cache: {},
            packageCache: {}
        });

        var b = browserify(config);
        b.transform(babelify);

        b = watchify(b);

        function done() {
            if (--queue === 0) {
                cb();
            }
        }

        function bundle() {
            console.log('Building scripts...');
            return b
                .bundle()
                .on('error', function(err) {
                    console.log(err);
                })
                .pipe(source(config.outputName))
                .pipe(gulp.dest(config.dest))
                .pipe(browserSync.reload({
                    stream: true
                }))
                .on('end', done);
        }

        b.on('update', bundle);

        return bundle();
    }

    BROWSERIFY_BUNDLES.forEach(browserifyIt);
});

// Browser Sync
gulp.task('browserSync', function() {
    browserSync.init(BROWSERSYNC);
});

// Build task
gulp.task('build', function(cb) {
    runSequence(
        // run these in parallel
        [
            'lint',
            'scripts',
        ],
        function(err) {
            if (err) {
                cb(err);
            }
            cb();
        }
    );
});

// Default gulp task
gulp.task('default', ['build', 'watch', 'partials', 'browserSync']);