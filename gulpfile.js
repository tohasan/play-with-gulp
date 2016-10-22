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

gulp.task('styles', function () {
    return gulp.src('src/styles/styles.styl')
        .pipe(debug({ title: 'src' }))
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(sourcemaps.write('.'))
        .pipe(debug({ title: 'stylus' }))
        .pipe(gulp.dest('public'));
});

gulp.task('default', gulp.series('styles'));
