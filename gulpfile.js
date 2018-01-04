/**
 * Gulpfile
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var babelify = require('babelify');
var envify = require('envify');
var uglifyify = require('uglifyify');

var Pathes = {
    HTML: 'src/index.html',
    OUT: 'app.js',
    DEST: 'docs',
    JS_ENTRY_POINT: 'src/app.js',
    SCSS_ENTRY_POINT: 'src/styles/app.scss',
    IMGS: 'src/images/*'
};

gulp.task('html', function() {
    return gulp.src(Pathes.HTML)
        .pipe(gulp.dest(Pathes.DEST));
});

gulp.task('imgs', function() {
    return gulp.src(Pathes.IMGS)
        .pipe(gulp.dest(Pathes.DEST));
});

gulp.task('sass', function() {
    return gulp.src(Pathes.SCSS_ENTRY_POINT)
        .pipe(sass({
            includePaths: [
                'node_modules/normalize-scss/sass'
            ]
        }))
        .pipe(cssnano())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(Pathes.DEST));
});

gulp.task('js', function() {
    return browserify({
        entries: Pathes.JS_ENTRY_POINT,
        debug: true,
        transform: [
            [envify, { global: true, NODE_ENV: 'production' }],
            [uglifyify, { global: true }],
            babelify
        ]
    })
        .bundle()
        .pipe(source(Pathes.OUT))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(Pathes.DEST));
});

gulp.task('app', ['html', 'js', 'sass', 'imgs']);

gulp.task('default', ['app']);
