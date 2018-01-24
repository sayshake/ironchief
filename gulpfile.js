const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
var rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
/* -------- Server  -------- */
gulp.task('server', function() {
  browserSync.init({
    server: {
      port: 9000,
      baseDir: "build"
    }
  });

  gulp.watch('build/**/*').on('change', browserSync.reload);
});

/* ------------ Pug compile ------------- */
gulp.task('templates:compile', function buildHTML() {
    return gulp.src([
        'source/templates/index.pug',
        'source/templates/obchee-menu.pug',
        'source/templates/sportivnoe-menu.pug',
        'source/templates/zdorovoe-menu.pug',
        'source/templates/kak-eto-rabotaet.pug',
        'source/templates/o-nas.pug',
        'source/templates/otzyvy.pug',
        'source/templates/blog.pug',
        'source/templates/kontakty.pug',  
        'source/templates/stalnoi-kachok.pug',  
        'source/templates/myaso-dlya-sportsmena.pug',  
        'source/templates/sportivnoe-pitanie.pug',  
        'source/templates/post-pechenki.pug',  
        'source/templates/gora-myuhc.pug',  
        'source/templates/relief.pug',  
        'source/templates/super-suhka.pug',  
        'source/templates/telo-mechty.pug',  
        'source/templates/bystroslim-zh.pug',  
        'source/templates/bystroslim-m.pug',  
        'source/templates/eda-dlya-zhizni-zh.pug',  
        'source/templates/eda-dlya-zhizni-m.pug',  
        'source/templates/zelenyi.pug'  
    ])
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('build'))
});

/* ------------ Styles compile ------------- */
gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(autoprefixer())
    .pipe(gulp.dest('build/css'));
});

/* --------  js -------- */
gulp.task('js', function() {
    return gulp.src([
            'source/js/main.js'
//            'source/js/jquery.min.js',
//            'source/js/tether.min.js',
//            'source/js/bootstrap.min.js'        
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
});
/* --------  js bootrap -------- */
gulp.task('bootstrap', function() {
    return gulp.src([
            'source/bootstrap/jquery.min.js',
            'source/bootstrap/tether.min.js',
            'source/bootstrap/bootstrap.min.js'        
        ])
        .pipe(gulp.dest('build/bootstrap'));
});

/* ------------ Sprite ------------- */
gulp.task('sprite', function(cb) {
  const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));

  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('source/styles/global/'));
  cb();
});

/* ------------ Delete ------------- */
gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
});

/* ------------ Copy fonts ------------- */
gulp.task('copy:fonts', function() {
  return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});

/* ------------ Copy images ------------- */
gulp.task('copy:images', function() {
  return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

/* ------------ Copy ------------- */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/* ------------ Watchers ------------- */
gulp.task('watch', function() {
  gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
  gulp.watch('source/js/**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile','js', 'bootstrap','sprite', 'copy'),
  gulp.parallel('watch', 'server')
  )
);

