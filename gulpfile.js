/**
 * Created with IntelliJ IDEA (in accordance with File | Settings | File and Code Templates).
 * User: tohasan
 * Date: 22.10.2016
 * Time: 8:32
 */

'use strict'; // NOSONAR

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const del = require('del');

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
        .pipe(gulpIf(isDev, sourcemaps.write('.')))
        .pipe(debug({ title: 'stylus' }))
        .pipe(gulp.dest('public'));
});

gulp.task('assets', function () {
    // Copy only files changed after last run of the task
    return gulp.src('src/assets/**', { since: gulp.lastRun('assets') })
        .pipe(debug({ title: 'assets' }))
        .pipe(gulp.dest('public'));
});

gulp.task('pages', function () {
    // Copy only files changed after last run of the task
    return gulp.src('src/*.html', { since: gulp.lastRun('assets') })
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


gulp.task('default', gulp.series(
    'clean',
    gulp.parallel(
        'styles',
        'assets',
        'pages'
    )
));

gulp.task('dev', gulp.series('default', 'watch'));