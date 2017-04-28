var gulp = require('gulp'),
sass = require('gulp-sass'),
compass = require('gulp-compass'),
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
cssnano = require('gulp-cssnano'),
imagemin = require('gulp-imagemin'),
runSequence = require('run-sequence'),
bower = require('gulp-bower'),
regexRename = require('gulp-regex-rename'),
concat = require('gulp-concat'),
babel = require('gulp-babel');

var config = {
  rootPath: './',
  srcPath: 'static/src/',
  distPath: 'static/dist/',
  angularPath: 'src/app/',
  bowerDir: 'static/src/components/'
};

require('gulp-stats')(gulp);

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: config.distPath,
    },
    port: 8080,
    startPath: 'index.html',
  })
});

//Sass com Compass - para bootstrap
gulp.task('compass', function() {
  gulp.src(config.srcPath+'sass/**/*.+(scss|sass)')
    .pipe(compass({
      css: config.distPath+'css/',
      sass: config.srcPath+'sass/',
      style: 'compressed',
      sourcemap: true
    }))
    .on('error', function(error) {
      // Would like to catch the error here
      console.log(error);
      this.emit('end');
    })
    //.pipe(minifyCSS())
    .pipe(gulp.dest(config.distPath+'css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//Sass com Bourbon + Neat
gulp.task('sass', function() {
  gulp.src(config.srcPath+'sass/**/*.+(scss|sass)')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [bourbon, neat],
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.distPath+'css'))
    .pipe(browserSync.reload({
      stream: true
    }));
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
  runSequence('hbs', //clean:dist e a task original aqui, removida porque deu problema no windows
    ['compass', 'js', 'js-babel', 'images', 'fonts', 'root-files', 'sample-files'],
    'clean-templates',
    callback
  );

  gulp.watch([
    config.srcPath+'templates/**/*.hbs',
    config.srcPath+'templates/data/**/*.*'
  ], ['hbs']);

  gulp.watch(config.srcPath+'sass/**/*.+(scss|sass)', ['compass']);
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
    'compass',
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
   Controles do Bower
/-------------------/*/
gulp.task('bowerInit', function() {
  return bower()
});
//Copia JS do Bower
gulp.task('jsBower', function() {
  //vendors
  gulp.src([
    config.bowerDir+'jquery/dist/jquery.js',
    config.bowerDir+'jquery/dist/jquery.min.js',
    config.bowerDir+'isMobile/isMobile.js',
    config.bowerDir+'isMobile/isMobile.min.js',
    config.bowerDir+'bootstrap/dist/js/**/*.*',
    config.bowerDir+'underscore/underscore.js',
    config.bowerDir+'underscore/underscore.min.js',
    config.bowerDir+'backbone/backbone.js',
    config.bowerDir+'backbone/backbone.min.js',
    config.bowerDir+'elevatezoom/jquery.elevatezoom.js',
    config.bowerDir+'prism/prism.js'
  ])
  .pipe(gulp.dest(config.srcPath+'js/vendor/'));

  //bootstrap 4
  gulp.src([
    config.bowerDir+'bootstrap/js/dist/*.*'
  ])
  .pipe(gulp.dest(config.srcPath+'js/vendor/bootstrap'));

  //plugins
  gulp.src([
    config.bowerDir+'owl.carousel/dist/owl.carousel.js',
    config.bowerDir+'owl.carousel/dist/owl.carousel.min.js',
    config.bowerDir+'bootstrap-select/dist/js/*.js',
    config.bowerDir+'iCheck/*.js'
  ])
  .pipe(gulp.dest(config.srcPath+'js/plugins/'));
});
gulp.task('scssBower', function() {
  //owl.carousel specifics
  gulp.src([
    config.bowerDir+'owl.carousel/src/scss/*.scss',
  ])
  .pipe(gulp.dest(config.srcPath+'sass/plugins/owl.carousel'));

  //iCheck css
  gulp.src([
    config.bowerDir+'iCheck/skins/**/*.css'
  ])
  //.pipe(gulpif(condition, rename({prefix: '_', extname: '.scss'}) ))
  .pipe(rename({prefix: '_', extname: '.scss'}))
  .pipe(gulp.dest(config.srcPath+'sass/plugins/icheck/'));

  //Font Awesome
  gulp.src([
    config.bowerDir+'components-font-awesome/scss/**/*.scss'
  ])
  //.pipe(gulpif(condition, rename({prefix: '_', extname: '.scss'}) ))
  .pipe(gulp.dest(config.srcPath+'sass/fontawesome/'));

  //Font Awesome Fonts
  gulp.src([
    config.bowerDir+'components-font-awesome/fonts/**/*.*'
  ])
  //.pipe(gulpif(condition, rename({prefix: '_', extname: '.scss'}) ))
  .pipe(gulp.dest(config.srcPath+'fonts/fontawesome/'));

  //iCheck img
  gulp.src([
    config.bowerDir+'iCheck/skins/**/*.png'
  ])
  .pipe(gulp.dest(config.srcPath+'sass/plugins/icheck/'));

  //bootstrap-select
  gulp.src([
    config.bowerDir+'bootstrap-select/sass/**/*.scss'
  ])
  //.pipe(gulpif(condition, rename({prefix: '_', extname: '.scss'}) ))
  .pipe(rename({prefix: '_' }))
  .pipe(gulp.dest(config.srcPath+'sass/plugins/bootstrap-select/'));

  //prism
  gulp.src([
    config.bowerDir+'prism/themes/**/*.css'
  ])
  .pipe(rename({prefix: '_', extname: '.scss'}))
  .pipe(gulp.dest(config.srcPath+'sass/plugins/prism/'));

  //Bootstrap 4
  //-> scss
  gulp.src([
    config.bowerDir+'bootstrap/scss/**/*.*'
  ])
  .pipe(gulp.dest(config.srcPath+'sass/bootstrap/'));
});

gulp.task('renameBower', function () {
  //rename os owl carousels padrao
  gulp.src([
    config.srcPath+'sass/plugins/owl.carousel/owl.carousel.scss',
    config.srcPath+'sass/plugins/owl.carousel/owl.theme.default.scss',
    config.srcPath+'sass/plugins/owl.carousel/owl.theme.green.scss'
  ])
  .pipe(vinylPaths(del))
  .pipe(rename({prefix: '_' }))
  .pipe(gulp.dest(config.srcPath+'sass/plugins/owl.carousel'));

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
