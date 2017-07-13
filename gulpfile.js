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
yarn = require('gulp-yarn'),
regexRename = require('gulp-regex-rename'),
concat = require('gulp-concat'),
babel = require('gulp-babel');

var config = {
  rootPath: './',
  srcPath: 'static/src/',
  distPath: 'static/dist/',
  angularPath: 'src/app/',
  yarnPath: 'node_modules/'
};

require('gulp-stats')(gulp);

gulp.task('yarn', function() {
    return gulp.src(['./package.json'])
        .pipe(yarn());
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: config.distPath,
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
    .src(config.srcPath+'sass/**/*.+(scss|sass)')
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(config.distPath+'css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//gera doc do sass (comentário)
var sassdocOptions = {
  dest: config.distPath+'sassdoc'
};
gulp.task('sassdoc', function () {
  return gulp
    .src(config.srcPath+'sass/**/*.+(scss|sass)')
    .pipe(sassdoc(sassdocOptions))
    .resume();
});

gulp.task('fonts', function() {
  return gulp.src([
    config.srcPath+'fonts/**/*',
    '!'+config.srcPath+'fonts/**/*.+(html|css)'
  ])
  .pipe(gulp.dest(config.distPath+'fonts'))
});

gulp.task('copy:root', function() {
  return gulp.src([
    config.srcPath+'/*.*',
    '!'+config.srcPath+'/*.+(zip|rar|psd)'
  ])
  .pipe(gulp.dest(config.distPath))
});

gulp.task('images', function() {
  return gulp.src([
    config.srcPath+'**/*.{png,jpg,gif,svg,ico}',
    '!'+config.srcPath+'fonts/**/*.*',
    '!'+config.srcPath+'sass/**/*.*',
    '!'+config.srcPath+'components/**/*.*',
    '!'+config.angularPath+'fonts/**/*.*'
  ])
  .pipe(gulp.dest(config.distPath))
});

gulp.task('images:opt', function() {
  return gulp.src([
    config.distPath+'**/*.{png,jpg,gif,svg,ico}',
    '!'+config.srcPath+'fonts/**/*.*',
    '!'+config.angularPath+'fonts/**/*.*'
  ])
  .pipe(imagemin())
  .pipe(gulp.dest(config.distPath))
});

gulp.task('root-files', function() {
  return gulp.src([
    config.srcPath+'*.{ico,jpg,png,gif,txt,xml}',
    '!'+config.srcPath+'*.+(zip|rar|psd|ai|pdf)'
  ])
  .pipe(gulp.dest(config.distPath))
});

gulp.task('sample-files', function() {
  return gulp.src([
    config.srcPath+'samples/**/*.*',
    '!'+config.srcPath+'**/*.md'
  ])
  .pipe(gulp.dest(config.distPath))
});

gulp.task('js', function() {
  return gulp.src([
    config.srcPath+'**/*.js',
    '!'+config.srcPath+'templates/**/*.*',
    '!'+config.srcPath+'components/**/*.*',
    '!'+config.angularPath+'**/*.*',
    '!'+config.srcPath+'js/es2015/**/*.*'
  ])
  //.pipe(print())
  //.pipe(babel({ presets: ['es2015'] }))
  .pipe(gulp.dest(config.distPath))
});
gulp.task('js-babel', function() {
  return gulp.src([
    config.srcPath+'js/es2015/**/*.js'
  ])
  //.pipe(print())
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(gulp.dest(config.distPath+'js'))
});

gulp.task('useref', function(){
  return gulp.src(config.distPath+'*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    //.pipe(rename({prefix: 'prod_'}))
    .pipe(gulp.dest(config.distPath))
});

gulp.task('hbs', function() {
  //var path = require('path');
  //var partialsList = './'+config.srcPath+'templates/partials'+path;
  var partialsDir = config.srcPath+'templates/partials';
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
      batchList.push('./'+config.srcPath+'templates/partials/');

      var content = require('./'+config.srcPath+'templates/data/main.json');
      var helper = require('./'+config.srcPath+'templates/helpers/main-helper.js');
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
          config.srcPath+'templates/pages/**/*.hbs',
          //'!'+config.srcPath+'templates/**/*.hbs',
        ])
        .pipe(handlebars(content, options))
        .pipe(htmlbeautify(beautifyOptions))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest(config.distPath))
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
  gulp.src(config.distPath+'wiki/**/*.html')
  .pipe(htmlbeautify(options))
  .pipe(gulp.dest(config.distPath+'wiki/'))
});

gulp.task('clean:dist', function() {
  console.log('deleta');
  return del.sync(config.distPath);
});

//transforma os templates em includes para serem utilizados no wiki
gulp.task('copy-templates', function() {
  //bootstrap-select
  gulp.src([
    config.srcPath+'/templates/partials/**/*.hbs'
  ])
  //.pipe(gulpif(condition, rename({prefix: '_', extname: '.scss'}) ))
  .pipe(rename({extname: '.txt' }))
  .pipe(gulp.dest(config.distPath+'wiki/elements'));
});

//Funciona quando usando o Compass - depende do Rails + Sass + Compass instalados e configurados na máquina
gulp.task('watch', ['browserSync', 'clean:dist'], function(callback){
  runSequence('build',
    callback
  );

  gulp.watch([
    config.srcPath+'templates/**/*.hbs',
    config.srcPath+'templates/data/**/*.*'
  ], ['hbs']);

  gulp.watch(config.srcPath+'sass/**/*.+(scss|sass)', ['sass']);
  gulp.watch([
    config.srcPath+'fonts/**/*',
    '!'+config.srcPath+'fonts/**/*.+(html|css)',
    '!'+config.srcPath+'components/**/*.*'
  ], ['fonts']);
  gulp.watch([
    config.srcPath+'**/*.js',
    '!'+config.srcPath+'templates/**/*.*',
    '!'+config.angularPath+'**/*.js',
    '!'+config.srcPath+'components/**/*.*',
    '!'+config.srcPath+'js/es2015/**/*.*'
  ], ['js']);
  gulp.watch([
    config.srcPath+'js/es2015/**/*.*'
  ], ['js-babel']);
  gulp.watch([
    config.srcPath+'**/*.{png,jpg,gif,svg}',
    '!'+config.srcPath+'fonts/**/*.*'
  ], ['images']);
  gulp.watch([
    config.srcPath+'*.{ico,jpg,png,gif,txt,xml}',
    '!'+config.srcPath+'*.+(zip|rar|psd|ai|pdf)'
  ], ['root-files']);

  //Global
  // gulp.watch([
  //   config.rootPath+'*.html'
  // ], ['useref']);


  //global watch
  gulp.watch([
    config.srcPath+'fonts/**/*',
    config.distPath+'**/*.js',
    config.distPath+'**/*.[html|css]',
    '!'+config.srcPath+'fonts/**/*.+(html|css)',
    '!'+config.angularPath+'**/*.html',
    '!'+config.angularPath+'**/*.js',
    '!'+config.angularPath+'directives/**/*.min.js',
    '!'+config.angularPath+'directives/**/*.min.js',
    '!'+config.srcPath+'components/**/*.*'
  ], browserSync.reload);
});

gulp.task('build', function (callback) {
  runSequence(
    'clean:dist',
    'hbs',
    'sass',
    'clean-templates',
    'js',
    'js-babel',
    'images',
    'fonts',
    'sample-files',
    'root-files',
    //['compass', 'js', 'clean-templates', 'images', 'fonts', 'angular-components', 'angular-controllers', 'angular-directives'],
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
gulp.task('projectInit', function() {
  return yarn()
});
//Copia JS do Bower
gulp.task('jsYarn', function() {
  // //vendors
  // gulp.src([
  //   config.yarnPath+'jquery/dist/jquery.js',
  //   config.yarnPath+'jquery/dist/jquery.min.js',
  //   config.yarnPath+'isMobile/isMobile.js',
  //   config.yarnPath+'isMobile/isMobile.min.js',
  //   config.yarnPath+'bootstrap/dist/js/**/*.*',
  //   config.yarnPath+'underscore/underscore.js',
  //   config.yarnPath+'underscore/underscore.min.js',
  //   config.yarnPath+'backbone/backbone.js',
  //   config.yarnPath+'backbone/backbone.min.js',
  //   config.yarnPath+'elevatezoom/jquery.elevatezoom.js',
  //   config.yarnPath+'prism/prism.js'
  // ])
  // .pipe(gulp.dest(config.srcPath+'js/vendor/'));

  //bootstrap 4
  gulp.src([
    config.yarnPath+'bootstrap-v4-dev/js/dist/**/*.*'
  ])
  .pipe(gulp.dest(config.srcPath+'js/vendor/bootstrap'));

  gulp.src([
    config.yarnPath+'bootstrap-v4-dev/dist/js/*.*'
  ])
  .pipe(gulp.dest(config.srcPath+'js/vendor/'));

  //plugins
  // gulp.src([
  //   config.yarnPath+'owl.carousel/dist/owl.carousel.js',
  //   config.yarnPath+'owl.carousel/dist/owl.carousel.min.js',
  //   config.yarnPath+'bootstrap-select/dist/js/*.js',
  //   config.yarnPath+'iCheck/*.js'
  // ])
  // .pipe(gulp.dest(config.srcPath+'js/plugins/'));
});

//Copia JS do Yarn
gulp.task('scssYarn', function() {
  //Bootstrap 4
  //-> scss
  gulp.src([
    config.yarnPath+'bootstrap-v4-dev/scss/**/*.*'
  ])
  .pipe(gulp.dest(config.srcPath+'sass/bootstrap/'));
});

gulp.task('renameYarn', function () {
  //-> Bootstrap 4 scss rename
  gulp.src([
    config.srcPath+'sass/bootstrap/bootstrap-grid.scss',
    config.srcPath+'sass/bootstrap/bootstrap-reboot.scss',
    config.srcPath+'sass/bootstrap/bootstrap.scss'
  ])
  .pipe(vinylPaths(del))
  .pipe(rename({prefix: '_' }))
  .pipe(gulp.dest(config.srcPath+'sass/bootstrap'));
});

gulp.task('init', function (callback) {
  runSequence('clean:dist',
    ['bowerInit', 'jsBower', 'scssBower'],
    'renameBower',
    callback
  )
});


//Tarefa padrão do Gulp
gulp.task('default', function (callback) {
  runSequence(['browserSync', 'watch'],
    callback
  )
});
