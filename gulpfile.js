const gulp = require('gulp');
const livereload = require('gulp-livereload');
const concat = require("gulp-concat");
const minifycss = require('gulp-minify-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const run = require("gulp-run");

var cssSources = [
  'assets/photon-0.1.2-dist/css/photon.css',
  "assets/css/**/*.css"
];

gulp.task('css', () => {
	gulp.src(cssSources)
		.pipe(concat('sourcery.css'))
		.pipe(autoprefixer({browsers: ['last 2 versions', 'ie 10']}))
		.pipe(gulp.dest('app/public/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('app/public/css'))
		.pipe(livereload());
});

gulp.task('watch', function(){
	livereload.listen();
	gulp.watch(cssSources, ['css']);
});

gulp.task("build", ["css"]);

gulp.task('run', ['build'], function() {
	return run('electron .').exec();
});

gulp.task('default', ['watch', 'run']);