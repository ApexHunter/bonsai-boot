var gulp = require('gulp'),
autoprefixer = require('gulp-autoprefixer'),
sass = require('gulp-sass'),
sassdoc = require('sassdoc'),
bourbon = require('node-bourbon').includePaths,
neat = require('node-neat').includePaths,
sourcemaps = require('gulp-sourcemaps'),
handlebars = require('gulp-compile-handlebars'),
rename = require('gulp-rename'),
dir = require('node-dir'),
vinylPaths = require('vinyl-paths'),
browserSync = require('browser-sync').create(),
del = require('del'),
useref = require('gulp-useref'),
uglify = require('gulp-uglify'),
htmlbeautify = require('gulp-html-beautify'),
gulpIf = require('gulp-if'),
imagemin = require('gulp-imagemin'),
runSequence = require('run-sequence'),
// yarn = require('gulp-yarn'),
regexRename = require('gulp-regex-rename'),
concat = require('gulp-concat'),
babel = require('gulp-babel');

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

// gulp.task('yarn', function() {
//     return gulp.src(['./package.json'])
//         .pipe(yarn());
// });

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: path.dist,
    },
    port: 8080,
    startPath: 'index.html',
  })
});

//Sass com Bourbon + Neat
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed', //compressed
  includePaths: [bourbon, neat]
};
var autoprefixerOptions = {
  browsers: ['last 5 versions', '> 5%', 'Firefox ESR']
};
gulp.task('sass', function() {
  return gulp
    .src(path.src.sass+'/**/*.+(scss|sass)')
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//Minify CSS to avoid LibSass error on sourcemaps
var sassMinOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed', //compressed
  includePaths: [bourbon, neat]
};
gulp.task('sass:min', function() {
  return gulp
    .src(path.src.root+'sass/**/*.+(scss|sass)')
    .pipe(sass(sassMinOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.dist+'css'))
});

//gera doc do sass (comentário)
var sassdocOptions = {
  dest: path.dist+'sassdoc'
};
gulp.task('sassdoc', function () {
  return gulp
    .src(path.src.root+'sass/**/*.+(scss|sass)')
    .pipe(sassdoc(sassdocOptions))
    .resume();
});

gulp.task('fonts', function() {
  return gulp.src([
    path.src.root+'fonts/**/*',
    '!'+path.src.root+'fonts/**/*.+(html|css)'
  ])
  .pipe(gulp.dest(path.dist+'fonts'))
});

gulp.task('copy:root', function() {
  return gulp.src([
    path.src.root+'/*.*',
    '!'+path.src.root+'/*.+(zip|rar|psd)'
  ])
  .pipe(gulp.dest(path.dist.root))
});

gulp.task('images', function() {
  return gulp.src([
    path.src.root+'**/*.{png,jpg,gif,svg,ico}',
    '!'+path.src.root+'fonts/**/*.*',
    '!'+path.src.root+'sass/**/*.*',
    '!'+path.src.root+'components/**/*.*',
    '!'+path.app+'fonts/**/*.*'
  ])
  .pipe(gulp.dest(path.dist))
});

gulp.task('images:opt', function() {
  return gulp.src([
    path.dist+'**/*.{png,jpg,gif,svg,ico}',
    '!'+path.src.root+'fonts/**/*.*',
    '!'+path.app+'fonts/**/*.*'
  ])
  .pipe(imagemin())
  .pipe(gulp.dest(path.dist))
});

gulp.task('root-files', function() {
  return gulp.src([
    path.src.root+'*.{ico,jpg,png,gif,txt,xml}',
    '!'+path.src.root+'*.+(zip|rar|psd|ai|pdf)'
  ])
  .pipe(gulp.dest(path.dist))
});

gulp.task('sample-files', function() {
  return gulp.src([
    path.src.root+'samples/**/*.*',
    '!'+path.src.root+'**/*.md'
  ])
  .pipe(gulp.dest(path.dist))
});

gulp.task('js', function() {
  return gulp.src([
    path.src.root+'**/*.js',
    '!'+path.src.root+'templates/**/*.*',
    '!'+path.src.root+'components/**/*.*',
    '!'+path.app+'**/*.*',
    '!'+path.src.root+'js/es2015/**/*.*'
  ])
  //.pipe(print())
  //.pipe(babel({ presets: ['es2015'] }))
  .pipe(gulp.dest(path.dist))
});
gulp.task('js-babel', function() {
  return gulp.src([
    path.src.root+'js/es2015/**/*.js'
  ])
  //.pipe(print())
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(gulp.dest(path.dist+'js'))
});

gulp.task('useref', function(){
  return gulp.src(path.dist+'*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    //.pipe(rename({prefix: 'prod_'}))
    .pipe(gulp.dest(path.dist))
});

gulp.task('hbs', function() {
  //var path = require('path');
  //var partialsList = './'+path.src.root+'templates/partials'+path;
  var partialsDir = path.src.root+'/templates/partials';
  //var dirName = path.dirnamsasse(partialsList);
  //console.log(dirName);
  //options do beautify
  var beautifyOptions = {
    indentSize: 2
    //jslint_happy: true
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
      console.log(batchList);
      return gulp.src([
          path.src.root+'/templates/pages/**/*.hbs',
          //'!'+path.src.root+'templates/**/*.hbs',
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

//html wiki prettify
gulp.task('clean-templates', function() {
  var options = {
    indentSize: 2
  };
  gulp.src(path.dist+'wiki/**/*.html')
  .pipe(htmlbeautify(options))
  .pipe(gulp.dest(path.dist+'wiki/'))
});

gulp.task('clean:dist', function() {
  return del.sync(path.dist);
});

//transforma os templates em includes para serem utilizados no wiki
gulp.task('copy-templates', function() {
  //bootstrap-select
  gulp.src([
    path.src.root+'/templates/partials/**/*.hbs'
  ])
  //.pipe(gulpif(condition, rename({prefix: '_', extname: '.scss'}) ))
  .pipe(rename({extname: '.txt' }))
  .pipe(gulp.dest(path.dist+'wiki/elements'));
});

//Funciona quando usando o Compass - depende do Rails + Sass + Compass instalados e pathurados na máquina
gulp.task('watch', ['browserSync', 'clean:dist'], function(callback){
  runSequence('build',
    callback
  );

  gulp.watch([
    path.src.root+'templates/**/*.hbs',
    path.src.root+'templates/data/**/*.*'
  ], ['hbs']);

  gulp.watch(path.src.root+'sass/**/*.+(scss|sass)', ['sass']);
  gulp.watch([
    path.src.root+'fonts/**/*',
    '!'+path.src.root+'fonts/**/*.+(html|css)',
    '!'+path.src.root+'components/**/*.*'
  ], ['fonts']);
  gulp.watch([
    path.src.root+'**/*.js',
    '!'+path.src.root+'templates/**/*.*',
    '!'+path.app+'**/*.js',
    '!'+path.src.root+'components/**/*.*',
    '!'+path.src.root+'js/es2015/**/*.*'
  ], ['js']);
  gulp.watch([
    path.src.root+'js/es2015/**/*.*'
  ], ['js-babel']);
  gulp.watch([
    path.src.root+'**/*.{png,jpg,gif,svg}',
    '!'+path.src.root+'fonts/**/*.*'
  ], ['images']);
  gulp.watch([
    path.src.root+'*.{ico,jpg,png,gif,txt,xml}',
    '!'+path.src.root+'*.+(zip|rar|psd|ai|pdf)'
  ], ['root-files']);

  //global watch
  gulp.watch([
    path.src.root+'fonts/**/*',
    path.dist+'**/*.js',
    path.dist+'**/*.[html|css]',
    '!'+path.src.root+'fonts/**/*.+(html|css)',
    '!'+path.app+'**/*.html',
    '!'+path.app+'**/*.js',
    '!'+path.app+'directives/**/*.min.js',
    '!'+path.app+'directives/**/*.min.js',
    '!'+path.src.root+'components/**/*.*'
  ], browserSync.reload);
});

gulp.task('build', function (callback) {
  runSequence(
    'clean:dist',
    'hbs',
    'sass',
    // 'sass:min',
    'clean-templates',
    'js',
    'js-babel',
    'images',
    'fonts',
    'sample-files',
    'root-files',
    callback
  )
});

gulp.task('build:min', function (callback) {
  runSequence('useref',
    callback
  )
});

/*/------------------//
   Controles do Yarn
/-------------------/*/
// gulp.task('projectInit', function() {
//   return yarn()
// });
//Copia JS do Bower
// gulp.task('jsYarn', function() {
  // //vendors
  // gulp.src([
  //   path.yarnPath+'jquery/dist/jquery.js',
  //   path.yarnPath+'jquery/dist/jquery.min.js',
  //   path.yarnPath+'isMobile/isMobile.js',
  //   path.yarnPath+'isMobile/isMobile.min.js',
  //   path.yarnPath+'bootstrap/dist/js/**/*.*',
  //   path.yarnPath+'underscore/underscore.js',
  //   path.yarnPath+'underscore/underscore.min.js',
  //   path.yarnPath+'backbone/backbone.js',
  //   path.yarnPath+'backbone/backbone.min.js',
  //   path.yarnPath+'elevatezoom/jquery.elevatezoom.js',
  //   path.yarnPath+'prism/prism.js'
  // ])
  // .pipe(gulp.dest(path.src.root+'js/vendor/'));

  //bootstrap 4
  // gulp.src([
  //   path.yarnPath+'bootstrap-v4-dev/js/dist/**/*.*'
  // ])
  // .pipe(gulp.dest(path.src.root+'js/vendor/bootstrap'));

  // gulp.src([
  //   path.yarnPath+'bootstrap-v4-dev/dist/js/*.*'
  // ])
  // .pipe(gulp.dest(path.src.root+'js/vendor/'));

  //plugins
  // gulp.src([
  //   path.yarnPath+'owl.carousel/dist/owl.carousel.js',
  //   path.yarnPath+'owl.carousel/dist/owl.carousel.min.js',
  //   path.yarnPath+'bootstrap-select/dist/js/*.js',
  //   path.yarnPath+'iCheck/*.js'
  // ])
  // .pipe(gulp.dest(path.src.root+'js/plugins/'));
// });

//Copia JS do Yarn
// gulp.task('scssYarn', function() {
//   //Bootstrap 4
//   //-> scss
//   gulp.src([
//     path.yarnPath+'bootstrap-v4-dev/scss/**/*.*'
//   ])
//   .pipe(gulp.dest(path.src.root+'sass/bootstrap/'));

//   //font-awesome
//   gulp.src([
//     path.yarnPath+'font-awesome/scss/*.*'
//   ])
//   .pipe(gulp.dest(path.src.root+'sass/font-awesome'));
//   //font-awesome - copy fonts
//   gulp.src([
//     path.yarnPath+'font-awesome/fonts/*.*'
//   ])
//   .pipe(gulp.dest(path.src.root+'fonts/'));
// });

// gulp.task('renameYarn', function () {
//   //-> Bootstrap 4 scss rename
//   gulp.src([
//     path.src.root+'sass/bootstrap/bootstrap-grid.scss',
//     path.src.root+'sass/bootstrap/bootstrap-reboot.scss',
//     path.src.root+'sass/bootstrap/bootstrap.scss'
//   ])
//   .pipe(vinylPaths(del))
//   .pipe(rename({prefix: '_' }))
//   .pipe(gulp.dest(path.src.root+'sass/bootstrap'));
// });

// gulp.task('init', function (callback) {
//   runSequence('clean:dist',
//     ['bowerInit', 'jsBower', 'scssBower'],
//     'renameBower',
//     callback
//   )
// });


//Tarefa padrão do Gulp
gulp.task('default', function (callback) {
  runSequence(['browserSync', 'watch'],
    callback
  )
});
