const gulp = require("gulp");
const ts = require('gulp-typescript');
const tsProject = ts.createProject("tsconfig.json");
const Server = require('karma').Server;


gulp.task("compile", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

  gulp.task('karma', function (done) {
    new Server({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, done).start();
  });

  gulp.task('test', gulp.series('compile', 'karma'));
    