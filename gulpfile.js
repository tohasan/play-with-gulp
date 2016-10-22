/**
 * Created with IntelliJ IDEA (in accordance with File | Settings | File and Code Templates).
 * User: tohasan
 * Date: 22.10.2016
 * Time: 8:32
 */


const gulp = require('gulp');

gulp.task('hello', function (callback) {
    console.log('hello!'); // NOSONAR

    // Signal async completion
    callback();
});

gulp.task('example:promise', function () {
    return new Promise((resolve) => {
        // ...
        resolve('result');
    });
});

gulp.task('example:stream', function () {
    // Read all from steam (and throw the data away) and then done
    return require('fs').createReadStream(__filename);
});

gulp.task('example:process', function () {
    // Returns child process
    return require('child_process').spawn('ping', ['127.0.0.1']);
});

gulp.task('example', gulp.series(
    'hello',
    'example:promise',
    'example:stream',
    'example:process'
));

gulp.task('example:parallel', gulp.parallel(
    'hello',
    'example:promise',
    'example:stream',
    'example:process'
));