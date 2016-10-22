/**
 * Created with IntelliJ IDEA (in accordance with File | Settings | File and Code Templates).
 * User: tohasan
 * Date: 22.10.2016
 * Time: 8:32
 */

'use strict'; // NOSONAR

// Main Gulp module
const gulp = require('gulp');
// Compiles stylus to css
const stylus = require('gulp-stylus');
// Concatenates input files
const concat = require('gulp-concat');
// Logs output of pipelines
const debug = require('gulp-debug');
// Generates source maps for styles and scripts
const sourcemaps = require('gulp-sourcemaps');
// Pipeline conditions
const gulpIf = require('gulp-if');
// General module (not specific gulp plugin) to delete file and directories
const del = require('del');
// Checks that file in destination is older that file in source
// You can use another plugin: gulp-changed
const newer = require('gulp-newer');
// Adds vendor prefixes in css to extend cross-browser support
const autoprefixer = require('gulp-autoprefixer');

// Plugins for caching:
//      - gulp-remember - caches files by name
//      - gulp-cached - filters files if content of them is not changed
//      - gulp-cache - caches result of stream in the filesystem

// Plugins for browser reloading:
//      - livereload
//      - browser-sync

const browserSync = require('browser-sync').create();

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'dev';

gulp.task('clean', function () {
    return del('public');
});

gulp.task('styles', function () {
    // Stylus has cache so rebuild is not hard and long operation

    return gulp.src('src/styles/styles.styl')
        .pipe(debug({ title: 'src' }))
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(stylus())
        .pipe(autoprefixer())
        .pipe(gulpIf(isDev, sourcemaps.write('.')))
        .pipe(debug({ title: 'stylus' }))
        .pipe(gulp.dest('public'));
});

gulp.task('assets', function () {
    // Copy only files changed after last run of the task
    return gulp.src('src/assets/**', { since: gulp.lastRun('assets') })
        .pipe(newer('public'))
        .pipe(debug({ title: 'assets' }))
        .pipe(gulp.dest('public'));
});

gulp.task('pages', function () {
    // Copy only files changed after last run of the task
    return gulp.src('src/*.html', { since: gulp.lastRun('assets') })
        .pipe(newer('public'))
        .pipe(debug({ title: 'pages' }))
        .pipe(gulp.dest('public'));
});

// Watch uses chokidar inside yourself.
// Chokidar is the best tool to crossplatform watching files
// https://github.com/paulmillr/chokidar
// Google 'handling the delete event on watching'
// if you want delete files from public when origin files deleted:
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/handling-the-delete-event-on-watch.md

gulp.task('watch', function () {
    gulp.watch('src/styles/**/*.styl', gulp.series('styles'));
    gulp.watch('src/assets/**', gulp.series('assets'));
    gulp.watch('src/*.html', gulp.series('pages'));
});

gulp.task('serve', function () {
    browserSync.init({
        server: 'public'
    });

    browserSync.watch('public/**')
        .on('change', browserSync.reload);
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel(
        'styles',
        'assets',
        'pages'
    )
));

gulp.task('dev', gulp.series(
    'default',
    gulp.parallel('watch', 'serve')
));