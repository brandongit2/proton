const gulp = require('gulp');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sasslint = require('gulp-sass-lint');
const gulpTslint = require('gulp-tslint');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');

const del = require('del');
const merge = require('merge-stream');
const named = require('vinyl-named');
const tslint = require('tslint');
const webpack = require('webpack-stream');

let src = 'src/';
let out = 'build/';

let webpack_files = [src + '!(module-)*/*.@(ts|tsx)', src + '*.@(ts|tsx)'];
let html_files = [src + '!(module-)*/*.html', src + '*.html'];
let sass_files = [src + '!(module-)*/*.scss', src + '*.scss'];
let remaining_files = [src + '!(module-)*/*.!(ts|tsx|html|scss)', src + '*.!(ts|tsx|html|scss)'];

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
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(gulpIf(isFixed, gulp.dest('../test/fixtures')))
        .pipe(eslint.failAfterError());

    let _tslint = gulp.src(src + '**/*.@(ts|tsx)')
        .pipe(gulpTslint({ fix: true, program }))
        .pipe(gulpTslint.report());

    let _sasslint = gulp.src(src + '**/*.scss')
        .pipe(sasslint())
        .pipe(sasslint.format());

    return merge(_eslint, _tslint, _sasslint);
});

// Build all source files into build/ directory.
gulp.task('build', gulp.series('clean', () => {

    //TODO: 
    _webpack = webpackBuild();
    _html = htmlBuild();
    _sass = sassBuild();
    _remaining = remainingBuild();

    _webpackWatch = watch(webpack_files, {read:false, verbose: true}, () => {return webpackBuild()});
    _htmlWatch = watch(html_files, {read:false, verbose: true}, () => {return htmlBuild()});
    _sassWatch = watch(sass_files, {read:false, verbose: true}, () => {return sassBuild()});
    _remainingWatch = watch(remaining_files, {read:false, verbose: true}, () => {return remainingBuild()});
}));

var webpackBuild = function() {
    gulp.src(webpack_files)
            .pipe(named())
            .pipe(webpack({
                mode: 'development',
                module: {
                    rules: [
                        { test: /\.(ts|tsx)$/, use: 'ts-loader' }
                    ]
                }
            }, require('webpack')))
            .pipe(uglify())
            .pipe(gulp.dest(out));
};

var htmlBuild = function() {
    return gulp.src(html_files)
        .pipe(replace(/"(\S+)\.ts"/gi, '$1.js'))
        .pipe(replace(/"(\S+)\.scss"/gi, '$1.css'))
        .pipe(gulp.dest(out));
}

var sassBuild = function() {
    return gulp.src(sass_files)
        .pipe(sasslint())
        .pipe(sasslint.format())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(out));
}

var remainingBuild = function() {
    return gulp.src(remaining_files)
        .pipe(gulp.dest(out));
}