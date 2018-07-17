const gulp = require('gulp');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sasslint = require('gulp-sass-lint');
const gulpTslint = require('gulp-tslint');
const uglify = require('gulp-uglify');

const del = require('del');
const merge = require('merge-stream');
const named = require('vinyl-named');
const tslint = require('tslint');
const webpack = require('webpack-stream');

let src = 'src/';
let out = 'build/';

// Cleans build/ directory.
gulp.task('clean', () => {
    return del(out + '**/*');
});

// Lints all TypeScript/JavaScript files.
gulp.task('lint', () => {
    let program = tslint.Linter.createProgram('./tsconfig.json');

    function isFixed(file) {
        return file.eslint != null && file.eslint.fixed;
    }

    let _eslint = gulp.src(src + '**/*.js')
        .pipe(eslint({fix: true}))
        .pipe(eslint.format())
        .pipe(gulpIf(isFixed, gulp.dest('../test/fixtures')))
        .pipe(eslint.failAfterError());

    let _tslint = gulp.src(src + '**/*.@(ts|tsx)')
        .pipe(gulpTslint({fix: true, program}))
        .pipe(gulpTslint.report());

    let _sasslint = gulp.src(src + '**/*.scss')
        .pipe(sasslint())
        .pipe(sasslint.format());

    return merge(_eslint, _tslint, _sasslint);
});

// Build all source files into build/ directory.
gulp.task('build', gulp.series('clean', () => {
    let _webpack = gulp.src([src + '!(module-)*/*.@(ts|tsx)', src + '*.@(ts|tsx)'])
        .pipe(named())
        .pipe(webpack({
            mode: 'development',
            module: {
                rules: [
                    {test: /\.(ts|tsx)$/, use: 'ts-loader'}
                ]
            }
        }, require('webpack')))
        .pipe(uglify())
        .pipe(gulp.dest(out));

    let _html = gulp.src([src + '!(module-)*/*.html', src + '*.html'])
        .pipe(replace(/"(\S+)\.ts"/gi, '$1.js'))
        .pipe(replace(/"(\S+)\.scss"/gi, '$1.css'))
        .pipe(gulp.dest(out));

    let _sass = gulp.src([src + '!(module-)*/*.scss', src + '*.scss'])
        .pipe(sasslint())
        .pipe(sasslint.format())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(out));

    let _remaining = gulp.src([src + '!(module-)*/*.!(ts|tsx|html|scss)', src + '*.!(ts|tsx|html|scss)'])
        .pipe(gulp.dest(out));

    return merge(_html, _sass, _remaining, _webpack);
}));

// Lint, beautify source code.
gulp.task('maintain', () => {

});
