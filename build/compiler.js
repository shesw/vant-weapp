const gulp = require('gulp');
const path = require('path');
const postcss = require('gulp-postcss');
const cssmin = require('gulp-clean-css');
const rename = require('gulp-rename');
const isProduction = process.env.NODE_ENV === 'production';
const src = path.join(__dirname, '../packages');
const dist = path.join(__dirname, isProduction ? '../dist' : '../example/dist');
const ext = ['js', 'pcss', 'json', 'wxml'];

function copy(ext) {
  return gulp.src([src + '/**/*.' + ext]).pipe(gulp.dest(dist));
}

gulp.task('compile-pcss', () => {
  return gulp
    .src([src + '/**/*.pcss'])
    .pipe(postcss())
    .pipe(cssmin())
    .pipe(
      rename(path => {
        path.extname = '.wxss';
      })
    )
    .pipe(gulp.dest(dist));
});

gulp.task('compile-js', () => copy('js'));
gulp.task('compile-json', () => copy('json'));
gulp.task('compile-wxml', () => copy('wxml'));
gulp.task('build', ext.map(ext => 'compile-' + ext));
gulp.start('build');

if (!isProduction) {
  ext.forEach(ext => {
    gulp.watch(src + '/**/*.' + ext, ['compile-' + ext]);
  });
}
