// vim: set ft=javascript:

var gulp = require('gulp');

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var uglify = require('gulp-uglify');

var pkg = require('./package.json');
var cacheBuster = pkg.version;

var paths = {
    fonts: [
        'src/fonts/**/*'
    ],
    scripts: [
        'bower_components/jquery/dist/jquery.js',
        'src/js/main.js'
    ],
    styles: [
        'bower_components/normalize-css/normalize.css',
        'src/less/main.less'
    ]
};

gulp.task('clean-scripts', function(){
    return gulp.src('dist/js/**/*', {read: false})
        .pipe(clean());
});

gulp.task('scripts', ['clean-scripts'], function(){
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(uglify())
        .pipe(concat(pkg.name+'-'+cacheBuster+'.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('clean-styles', function(){
    return gulp.src('dist/css/**/*', {read: false})
        .pipe(clean());
});

gulp.task('styles', ['clean-styles'], function(){
    return gulp.src(paths.styles)
        .pipe(less({compress:true}))
        .pipe(concat(pkg.name+'-'+cacheBuster+'.min.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('clean-fonts', function(){
    return gulp.src('dist/fonts/**/*', {read: false})
        .pipe(clean());
});

gulp.task('copy-fonts', ['clean-fonts'], function(){
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy', ['copy-fonts']);

gulp.task('default', ['scripts', 'styles', 'copy']);

gulp.task('watch', ['default'], function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
});
