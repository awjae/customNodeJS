import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'del';
import fileinclude from 'gulp-file-include';
import dartSass from 'sass';
import spritesmith from 'gulp.spritesmith';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
// import imagemin from 'gulp-imagemin';
import {create as bsCreate} from 'browser-sync';
const browserSync = bsCreate();
import fs from 'fs';
import url from 'url';

const paths = {
  styles: {
    src: 'src/styles/*.css',
    dest: 'dist/'
  },
  styles_scss: {
    src: 'src/styles/*.scss',
    dest: 'dist/'
  },
  scripts: {
    src: 'src/scripts/*.js',
    dest: 'dist/'
  },
  html: {
    src: 'src/html/**/*.html',
    dest: 'dist/html'
  },
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png}',
    dest: 'dist/images/'
  },
  sprite: {
    src: 'src/images/**/*.{jpg,jpeg,png}',
    dest: 'dist/'
  }
};

function clean() {
  return del([ 'dist' ]);
}

function styles() {
  return gulp.src([paths.styles.src, paths.styles_scss.src])
    .pipe(sass({
      outputStyle:  'expanded',
      sourceComments:  false
    }).on('error', sass.logError)) // sass 옵션
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(concat('main.min.css'))
    // .pipe(rename({
    //   basename: 'main',
    //   suffix: '.min'
    // }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.reload( {stream : true} ));
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.reload( {stream : true} ));
}

function sprite() {
  const spriteData = gulp.src(paths.sprite.src).pipe(
    spritesmith({
      imgName: "sprite.png",
      cssName: "sprite.scss",
      padding: 4
    })
  );
  
  const imgStream = new Promise(function(resolve) {
    spriteData.img.pipe(gulp.dest(paths.sprite.dest)).on("end", resolve);
  });
  
  const cssStream = new Promise(function(resolve) {
    spriteData.css.pipe(gulp.dest(paths.sprite.dest)).on("end", resolve);
  });
  
  return Promise.all([imgStream, cssStream]);
}

function duplicateLib() {
  return gulp.src("src/lib/*") 
  .pipe(gulp.dest('dist/lib'));
}

function watchFiles() {
  gulp.watch(paths.scripts.src, scripts);
  // gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.styles_scss.src, styles);
  gulp.watch(paths.html.src, includeTask);
}


function includeTask () {
    return gulp.src(["src/html/main/*", // ★★★★ 불러올 파일의 위치 
          // "!" + "./src/html/include*"  ★★★★ 읽지 않고 패스할 파일의 위치
        ]) 
        .pipe(fileinclude({ 
            prefix: '@@', basepath: '@file' 
        })) 
        .pipe(gulp.dest('dist/html')) // ★★★★ 변환한 파일의 저장 위치 지정 
        .pipe(browserSync.reload( {stream : true} ));
}; 

function images() {
  return gulp.src(paths.images.src, {since: gulp.lastRun(images)})
    // .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
}

function browserSyncFunc() {
  browserSync.init({ 
    port : 3333, 
    server: { 
      baseDir: 'dist',
      directory: true
    } 
  });
}

exports.includeTask = includeTask;
exports.delete = clean
exports.scripts = scripts
exports.styles = styles
exports.duplicateLib = duplicateLib
exports.sprite = sprite
exports.default = function() {
  return gulp.src('src/scripts/*.js')
  .pipe(babel())
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest('dist'));
}

exports.build = gulp.series(clean, gulp.parallel(duplicateLib, styles, scripts, includeTask, images, watchFiles, browserSyncFunc));
