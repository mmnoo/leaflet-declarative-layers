const gulp = require("gulp");
const ts = require('gulp-typescript');
const tsProject = ts.createProject("tsconfig.json");
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const Server = require('karma').Server;
const del = require('del');
const tslint = require('gulp-tslint');


function compile() {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest('dist/compiled'));
};

function concatenate() {
  return pipeline(
    gulp.src('dist/compiled/*.js'),
    concat('bundle.js'),
    gulp.dest('./dist/concatenated')
    );
};

function minify(done) {
  let intermediateFiles = ['dist/compiled', 'dist/concatenated'];
    return pipeline(
        gulp.src('dist/concatenated/*.js'),
        sourcemaps.init(),
            uglify({
                mangle: {toplevel: true},
                output: {
                    beautify: false,
                    comments: true
                }
            }),
        sourcemaps.write(),
        gulp.dest('dist')
        .on('end', () => {
          del(intermediateFiles)
          .then(() => done())
        })
    );
  };
  gulp.task('clean', (done) =>  {
    del.sync(['dist/**']);
    done();
});



  gulp.task('karma', function (done) {
    new Server({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, done).start();
  });

  gulp.task("tslint", () =>
  tsProject.src()
        .pipe(tslint({
            formatter: 'stylish'
        }))
        .pipe(tslint.report())
  );


  gulp.task('test', gulp.series('tslint', compile, 'karma'));

  //todo: one day, figure out way to avoid intermediate files, or at least not hardcode them
  gulp.task('build', gulp.series('tslint', 'clean', compile, concatenate, minify));
    