/**
 * Created by parallels on 7/21/15.
 */

var gulp = require('gulp');
var del = require('del');




gulp.task('clean', function (cb) {
    del([
        'compiled/**/*'
    ], cb);
});


gulp.task('publish',['clean'], function () {
    gulp.src(['src/**/*'], { "base" : "." }).pipe(gulp.dest('output'));
});

gulp.task('default', ['clean','publish']);


