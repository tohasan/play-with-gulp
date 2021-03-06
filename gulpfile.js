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
// Notifications during build (for example, about errors)
const notify = require('gulp-notify');
// Extends pipe method of stream, for example, to add error handler
// We use this plugin to catch errors on any pipe in pipeline
// As alternative we can use following plugins:
//      - multipipe,
//      - stream-combiner2
const plumber = require('gulp-plumber');
// Combines pipes
const combiner = require('stream-combiner2').obj;
// Allows write simple pipes as streams of object
const through2 = require('through2').obj;
// File object
const File = require('vinyl');
// Validates javascript
const eslint = require('gulp-eslint');
// Module works with file system
const fs = require('fs');

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
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'styles',
                    message: err.message
                };
            })
        }))
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

gulp.task('lint', function () {
    const eslintResults = {};
    const cacheEslintFilePath = `${process.cwd()}/tmp/eslint.results.json`;
    let cacheEslint = {};
    // Check that cache exists
    if (fs.existsSync(cacheEslintFilePath)) {
        // If lint cache exists then get it
        cacheEslint = JSON.parse(fs.readFileSync(cacheEslintFilePath));
    }

    return gulp.src(['src/**/*.js', 'gulpfile.js'], { read: false })
        .pipe(debug({ title: 'src' }))
        .pipe(through2((file, encoding, callback) => {
            // If file is in lint cache and
            // modification date of processing file equals modification date in cache
            // then do not lint file because we know result
            const cacheInfo = cacheEslint[file.path];
            if (cacheInfo !== undefined && cacheInfo.mtime === file.stat.mtime.toJSON()) {
                file.eslint = cacheInfo.eslint;
            }
            // Throw file to the next stream
            callback(null, file);
        }))
        .pipe(gulpIf(
            file => !file.eslint,
            combiner(
                through2((file, encoding, callback) => {
                    file.contents = fs.readFileSync(file.path);
                    callback(null, file);
                }),
                debug({ title: 'eslint' }),
                eslint(),
                through2((file, encoding, callback) => {
                    eslintResults[file.path] = {
                        eslint: file.eslint,
                        mtime: file.stat.mtime
                    };
                    callback(null, file);
                })
            )
        ))
        .pipe(eslint.format())
        .on('end', () => {
            fs.writeFileSync(cacheEslintFilePath, JSON.stringify(eslintResults));
        })
        .pipe(eslint.failAfterError());
});

gulp.task('through', function () {
    return gulp.src('src/**')
        .pipe(through2(function (file, encoding, callback) {
            const fileBak = file.clone();
            fileBak.path += '.bak';
            this.push(fileBak);
            callback(null, file);
        }))
        .pipe(gulp.dest('dest'));
});

gulp.task('manifest', function () {
    const mtimes = {};

    return gulp.src('src/**')
        .pipe(through2(function (file, encoding, callback) {
            mtimes[file.relative] = file.stat.mtime;
            callback(null, file);
        }))
        .pipe(gulp.dest('dest'))
        .pipe(through2(
            function (file, encoding, callback) {
                callback();
            }, function (callback) {
                const manifest = new File({
                    // cwd, base, path, contents
                    contents: new Buffer(JSON.stringify(mtimes)),
                    base: process.cwd(),
                    path: process.cwd() + '/manifest.json'
                });
                manifest.isManifest = true;
                // Tu add manifest to pipeline we must use push
                // instead of callback. In this case callback is not suitable option.
                this.push(manifest);
                callback();
            }
        ))
        .pipe(gulp.dest('.'));
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