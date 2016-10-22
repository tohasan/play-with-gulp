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
    return gulp.src('src/styles/styles.styl')
        .pipe(debug({ title: 'src' }))
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(stylus())
        .pipe(gulpIf(isDev, sourcemaps.write('.')))
        .pipe(debug({ title: 'stylus' }))
        .pipe(gulp.dest('public'));
});

gulp.task('assets', function () {
    return gulp.src('src/assets/**')
        .pipe(gulp.dest('public'));
});

gulp.task('pages', function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('public'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel(
        'styles',
        'assets',
        'pages'
    )
));
