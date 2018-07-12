const gulp = require('gulp');
const replace = require('gulp-replace');
const sass = require('gulp-sass');

const browserify = require('browserify');
const globby = require('globby');
const merge = require('merge-stream');
const source = require('vinyl-source-stream');
const through = require('through2');
const tsify = require('tsify');

// Build all source files into build/ directory.
gulp.task('build', async () => {
    let src = 'src/';
    let out = 'build/';

    let _browserify = browserify({
        entries: await globby([src + '**/*.ts'])
    }).plugin(tsify, {noImplicitAny: true}).bundle();

    let _html = gulp.src(src + '**/*.html')
      .pipe(replace(/"(\S+)\.ts"/gi, '$1.js'))
      .pipe(replace(/"(\S+)\.scss"/gi, '$1.css'))
      .pipe(gulp.dest(out));

    let _sass = gulp.src(src + '**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(out));

    let _remaining = gulp.src(src + '**/*.!(ts|html|scss)').pipe(gulp.dest(out));

    console.log(_html);
    return merge(_html, _sass, _remaining, _browserify);
});

// Lint, beautify source code.
gulp.task('maintain', () => {

});
