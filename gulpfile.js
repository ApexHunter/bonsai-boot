var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var dir = require('node-dir');
var del = require('del');
var htmlbeautify = require('gulp-html-beautify');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

var path = {
  root: './',
  src: {
    root: 'design/src',
    font: 'design/src/fonts',
    img: 'design/src/img',
    js: 'design/src/js',
    samples: 'design/src/samples',
    sass: 'design/src/sass',
    template:  'design/src/templates'
  },
  dist: {
    root: 'design/dist',
    font: 'design/dist/fonts',
    img: 'design/dist/img',
    js: 'design/dist/js',
    samples: 'design/dist/samples',
    css: 'design/dist/css'
  },
  app: 'app'
};

require('gulp-stats')(gulp);

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: path.dist,
    },
    port: 8080,
    startPath: 'index.html',
  })
});

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compact'
};
var autoprefixerOptions = {
  browsers: ['last 5 versions', '> 5%', 'Firefox ESR']
};
gulp.task('sass', function() {
  return gulp
    .src(path.src.sass+'/**/*.+(scss|sass)')
    .pipe(sourcemaps.init({
      largeFile: true
    }))
    .pipe(sourcemaps.identityMap())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('copy-files', function() {
  gulp.src([
    path.src.root+'/*.{ico,jpg,png,gif,txt,xml}',
    '!'+path.src.root+'/*.+(zip|rar|psd|ai|pdf)'
  ])
  .pipe(gulp.dest(path.dist.root))

  gulp.src([
    path.root+'node_modules/bootstrap/dist/js/bootstrap.js',
    path.root+'node_modules/jquery/dist/jquery.js',
    path.root+'node_modules/popper.js/dist/umd/popper.js',
    path.src.js+'/**/*.js'
  ])
  .pipe(gulp.dest(path.dist.js))

  gulp.src([
    path.src.font+'/**/*',
    path.root+'node_modules/font-awesome/fonts/*',
    '!'+path.src.font+'/**/*.+(html|css)'
  ])
  .pipe(gulp.dest(path.dist.font))

  gulp.src([
    path.src.samples+'/**/*.{png,jpg,gif,svg,ico}'
  ])
  .pipe(gulp.dest(path.dist.samples))

  gulp.src([
    path.src.img+'/**/*.{png,jpg,gif,svg,ico}'
  ])
  .pipe(gulp.dest(path.dist.img))
});

gulp.task('hbs', function() {
  var partialsDir = path.src.root+'/templates/partials';

  //options do beautify
  var beautifyOptions = {
    indentSize: 2
  };

  var subdirsList = dir.subdirs(partialsDir, function(err, subdirs) {
    if (err) {
      throw err;
    } else {
      //console.log(subdirs);
      var batchList = subdirs;
      batchList.push('./'+path.src.root+'/templates/partials/');

      var content = require('./'+path.src.root+'/templates/data/main.json');
      var helper = require('./'+path.src.root+'/templates/helpers/main-helper.js');
      var options = {
        //ignorePartials: true,
        // partials : {
        //   footer : '<footer>the end</footer>'
        // },
        batch: batchList,
        helpers : { //helper
          'raw-helper' : function(options) {
            return options.fn();
          }
        }
      }
      return gulp.src([
          path.src.root+'/templates/pages/**/*.hbs'
        ])
        .pipe(handlebars(content, options))
        .pipe(htmlbeautify(beautifyOptions))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest(path.dist.root))
        .pipe(browserSync.reload({
          stream: true
        }))
    }
  });
});

gulp.task('js', function() {
  return gulp.src(path.dist.root+'/*.html')
    .pipe(sourcemaps.init())
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.dist.root))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('clean:dist', function() {
  return del.sync(path.dist.root);
});

gulp.task('clean:js', function() {
  return del.sync([
    path.dist.js+'/main.js'
    // path.dist.js+'/**/*.js',
    // '!'+path.dist.js+'/main.min.js'
  ])
});

gulp.task('watch', function(callback) {
  runSequence('build',
    callback
  );

  gulp.watch([
    path.src.template+'/**/*.hbs',
    path.src.template+'/data/**/*.*'
  ], ['build']);

  gulp.watch(path.src.sass+'/**/*.+(scss|sass)', ['sass']);

  gulp.watch(path.src.js+'/**/*.js', ['build']);

  gulp.watch([
    path.src.root+'/*.{ico,jpg,png,gif,txt,xml}',
    '!'+path.src.root+'/*.+(zip|rar|psd|ai|pdf)'
  ], ['copy-files']);

  //global watch
  gulp.watch([
    path.src.fonts+'/**/*',
    path.dist.root+'/**/*.js',
    path.dist.root+'/**/*.[html|css]',
    '!'+path.src.root+'/fonts/**/*.+(html|css)',
    '!'+path.app+'/**/*.html',
    '!'+path.app+'/**/*.js',
    '!'+path.app+'/directives/**/*.min.js',
    '!'+path.app+'/directives/**/*.min.js',
    '!'+path.app+'/components/**/*.*'
  ], browserSync.reload);
});

gulp.task('build', function (callback) {
  runSequence(
    'clean:dist',
    ['sass',
    'hbs',
    'copy-files'],
    'js',
    'clean:js',
    callback
  )
});

//Tarefa padrão do Gulp
gulp.task('default', function (callback) {
  runSequence(
    ['browserSync', 'watch'],
    callback
  )
});
