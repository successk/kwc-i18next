// Imports
const bowerConfig = require("./bower.json");
const gulp = require("gulp");
const gutil = require("gulp-util");
const watch = require("gulp-watch");
const babel = require("gulp-babel");
const webserver = require("gulp-webserver");
var uglify = require("gulp-uglify");
var minifyInline = require("gulp-minify-inline");
var htmlmin = require("gulp-htmlmin");
var inlinesource = require("gulp-inline-source");

/// Constants
const tasks = Object.freeze({
  devHTML: "compileHTML",
  devSrcHTML: "devSrcHTML",
  devDemoHTML: "devDemoHTML",
  devJS: "compileJS",
  devSrcJS: "devSrcJS",
  devDemoJS: "devDemoJS",
  devDemoJSON: "devDemoJSON",
  devDependencies: "devDependencies",
  dev: "dev",

  buildHTML: "buildHTML",
  buildJS: "buildJS",
  inline: "inline",
  build: "build",

  // used to check validity of built version
  verifyBuild: "verifyBuild",
  verifyDependencies: "verifyDependencies",
  verifyDemoHTML: "verifyDemoHTML",
  verifyDemoJS: "verifyDemoJS",
  verifyDemoJSON: "verifyDemoJSON",
  verify: "verify"
});

const paths = Object.freeze({
  srcHTML: "src/*.html",
  srcJS: "src/*.js",
  demoHTML: "demo/**/*.html",
  demoJS: "demo/**/*.js",
  demoJSON: "demo/**/*.json",

  dev: "build/dev",
  devComponent: "build/dev/" + bowerConfig.name,
  devDemo: "build/dev/demo",

  build: "build/compile",
  builtHTML: "build/compile/*.html",

  verifyDemo: "build/verify/demo",
  verify: "build/verify"
});

/// Helpers
function handleError(e) {
  gutil.log(gutil.colors.red(e));
  this.emit("end");
}

function compileJS(source, dest) {
  "use strict";
  return gulp.src(source)
    .pipe(babel({
      presets: ["es2015"]
    }))
    .on("error", handleError)
    .pipe(gulp.dest(dest));
}

function compileHTML(source, dest) {
  "use strict";
  return gulp.src(source)
    .on("error", handleError)
    .pipe(gulp.dest(dest));
}

function dependencies(dest) {
  "use strict";
  return gulp.src("bower_components/**/*")
    .on("error", handleError)
    .pipe(gulp.dest(dest));
}

/// Dev tasks
gulp.task(tasks.devSrcJS, () => compileJS(paths.srcJS, paths.devComponent));

gulp.task(tasks.devDemoJS, () => compileJS(paths.demoJS, paths.devDemo));

gulp.task(tasks.devDemoJSON, () => gulp.src(paths.demoJSON).pipe(gulp.dest(paths.devDemo)));

gulp.task(tasks.devSrcHTML, () => compileHTML(paths.srcHTML, paths.devComponent));

gulp.task(tasks.devDemoHTML, () => compileHTML(paths.demoHTML, paths.devDemo));

gulp.task(tasks.devDependencies, () => dependencies(paths.dev));

gulp.task(tasks.dev, [tasks.devSrcJS, tasks.devDemoJS, tasks.devDemoJSON, tasks.devSrcHTML, tasks.devDemoHTML, tasks.devDependencies], function () {
  gulp.watch(paths.demoJS, [tasks.devDemoJS]);
  gulp.watch(paths.demoJSON, [tasks.devDemoJSON]);
  gulp.watch(paths.srcJS, [tasks.devSrcJS]);
  gulp.watch(paths.demoHTML, [tasks.devDemoHTML]);
  gulp.watch(paths.srcHTML, [tasks.devSrcHTML]);

  gulp.src(paths.dev)
    .pipe(webserver({
      host: "localhost",
      port: 8000,
      livereload: true,
      directoryListing: true,
      open: "http://localhost:8000/demo"
    }));
});

/// Build tasks
gulp.task(tasks.buildHTML, () =>
  gulp.src(paths.srcHTML)
    .pipe(minifyInline())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.build))
);

gulp.task(tasks.buildJS, () =>
  gulp.src(paths.srcJS)
    .pipe(babel({
      presets: ["es2015"]
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.build))
);

gulp.task(tasks.inline, [tasks.buildHTML, tasks.buildJS], () =>
  gulp.src(paths.builtHTML)
    .pipe(inlinesource())
    .pipe(gulp.dest(paths.build))
);

gulp.task(tasks.build, [tasks.inline], () =>
  gulp.src(paths.builtHTML)
    .pipe(gulp.dest("."))
);

gulp.task(tasks.verifyBuild, [tasks.build], () =>
  gulp.src("./*.html")
    .pipe(gulp.dest("bower_components/" + bowerConfig.name))
);

gulp.task(tasks.verifyDependencies, [tasks.verifyBuild], () => dependencies(paths.verify));

gulp.task(tasks.verifyDemoJS, () => compileJS(paths.demoJS, paths.verifyDemo));

gulp.task(tasks.verifyDemoJSON, () => gulp.src(paths.demoJSON).pipe(gulp.dest(paths.verifyDemo)));

gulp.task(tasks.verifyDemoHTML, () => compileHTML(paths.demoHTML, paths.verifyDemo));

gulp.task(tasks.verify, [tasks.verifyDependencies, tasks.verifyDemoJS, tasks.verifyDemoJSON, tasks.verifyDemoHTML], () =>
  gulp.src(paths.verify)
    .pipe(webserver({
      host: "localhost",
      port: 8000,
      livereload: false,
      directoryListing: true,
      open: "http://localhost:8000/demo"
    }))
);