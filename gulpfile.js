/**
 * Created with IntelliJ IDEA (in accordance with File | Settings | File and Code Templates).
 * User: tohasan
 * Date: 22.10.2016
 * Time: 8:32
 */

'use strict'; // NOSONAR

const gulp = require('gulp');

gulp.task('default', function () {
    // Patterns to search files are from minimatch library
    return gulp.src('src/**/*.*', {
        // Use this option if you don't want to read content of files
        // read: false
    })
        .on('data', function (file) {
            console.log({ // NOSONAR
                contents: file.contents, //  <Buffer 2f 2a 2a 0d 0a 20 2a 20 43 72 65 61 74 65 64 20 77 69 74 68 20 49 6e 74 65 6c 6c 69 4a 20 49 44 45 41 20 28 69 6e 20 61 63 63 6f 72 64 61 6e 63 65 20 ... >
                cwd: file.cwd, // E:\\projects\\experiments\\play-with-gulp
                base: file.base, // E:\\projects\\experiments\\play-with-gulp\\src\\
                path: file.path,  // E:\\projects\\experiments\\play-with-gulp\\src\\js\\libs\\somelib.js
                // Path component helpers
                relative: file.relative, // js\\libs\\somelib.js
                dirname: file.dirname, // E:\\projects\\experiments\\play-with-gulp\\src\\js\\libs
                basename: file.basename, // somelib.js
                stem: file.stem, // somelib
                extname: file.extname // .js
            });
        })
        .pipe(gulp.dest(function (file) {
            let relative = 'other';
            if (file.extname === '.js') {
                relative = 'outjs';
            } else if (file.extname === '.css') {
                relative = 'outcss';
            }
            return `dest/${relative}`;
        }));
});
