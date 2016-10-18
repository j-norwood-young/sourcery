const gulp = require('gulp');
const livereload = require('gulp-livereload');
const concat = require("gulp-concat");
const minifycss = require('gulp-minify-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const run = require("gulp-run");
const less = require("gulp-less");
// const iconutil = require('gulp-iconutil');
const sketch = require('gulp-sketch');

var cssSources = [
  'assets/photon-0.1.2-dist/css/photon.css',
  "assets/css/**/*.css",
  "assets/css/**/*.less",
];

var jsxSources = [
	"app/views/**/*.jsx"
];

gulp.task('css', () => {
	gulp.src(cssSources)
		.pipe(less())
		.pipe(concat('sourcery.css'))
		.pipe(autoprefixer({browsers: ['last 2 versions', 'ie 10']}))
		.pipe(gulp.dest('app/public/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('app/public/css'))
		.pipe(livereload());
});

gulp.task('jsx', () => {
	gulp.src(jsxSources)
	.pipe(livereload());
});

gulp.task('icon', () => {
  gulp.src('./asset/icon/*.sketch')
    .pipe(sketch({
      exports: 'artboards',
      format: 'png',
      scales: '1.0,2.0'
    }))
    // .pipe(iconutil('app.icns'))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function(){
	livereload.listen();
	gulp.watch(cssSources, ['css']);
	gulp.watch(jsxSources, ['jsx']);
});

gulp.task("build", ["css"]);

gulp.task('run', ['build'], function() {
	return run('electron .').exec();
}, ['watch']);

gulp.task('default', ['watch', 'run']);