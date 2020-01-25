
var gulpif  = require('gulp-if');
var gulp    = require('gulp');
var flatten = require('gulp-flatten');
var changed = require('gulp-changed');
var watch   = require('gulp-watch');

function isAccountTemplate(file) {
  return file.path.includes('templates/customers');
}

gulp.task('copy', function () {
  return gulp.src(['src/liquid/**/*'])
    .pipe(gulpif(isAccountTemplate, flatten({ includeParents: 2 }), flatten({ includeParents: 1 })))
    .pipe(changed('dist/', { hasChanged: changed.compareContents }))
    .pipe(gulp.dest('dist/'));
});
  
gulp.task('copy:watch', function (done) {
  watch(['src/liquid/**/*'])
    .pipe(gulpif(isAccountTemplate, flatten({ includeParents: 2 }), flatten({ includeParents: 1 })))
    .pipe(changed('dist/', { hasChanged: changed.compareContents }))
    .pipe(gulp.dest('dist/'));

  done();
});
