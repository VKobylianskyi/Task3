'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    npmDist = require('gulp-npm-dist'),
    cssnano = require('gulp-cssnano'),
    browserSync = require('browser-sync').create(),
    livereload = require('gulp-livereload');

gulp.task('build-styles', () => {
    return gulp.src('src/styles/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(cssnano())
        .pipe(gulp.dest('dist/'))
        .pipe(livereload());
});

gulp.task('copy-assets', () => {
    return gulp.src('src/assets/**/*')
        .pipe(gulp.dest('./dist'))
});

gulp.task('copy:libs', function() {
    gulp.src(npmDist(), {base: './node_modules'})
        .pipe(gulp.dest('./dist/node_modules'));
});

gulp.task('serve', () => {
    livereload.listen();

    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch('src/styles/*.scss', ['build-styles']);
    gulp.watch('src/index.html', ['copy-html']);
    gulp.watch('src/assets/**/*', ['copy-assets']);
    gulp.watch('./node_modules', ['copy:libs'])
});

gulp.task('copy-html', () => {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', ['build-styles', 'copy-html', 'copy-assets', 'copy:libs', 'serve']);
gulp.task('build', ['build-styles', 'copy-html', 'copy-assets', 'copy:libs']);
