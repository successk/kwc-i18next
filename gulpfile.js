// Imports
const bowerConfig = require("./bower.json");
const gulp = require("gulp");
const gutil = require("gulp-util");
const watch = require("gulp-watch");
const babel = require("gulp-babel");
const webserver = require("gulp-webserver");
const uglify = require("gulp-uglify");
const minifyInline = require("gulp-minify-inline");
const htmlmin = require("gulp-htmlmin");
const inlinesource = require("gulp-inline-source");
const wct = require("web-component-tester");

/// Constants
const tasks = Object.freeze({
  // Build
  compileHtml: "compileHtml",
  compileJs: "compileJs",
  inline: "inline",

  // Minify
  minify: "minify",
  minifyInline: "minifyInline",
  build: "build",

  // Manual test
  copyTestToTest: "copyTestToTest",
  copyDependenciesToTest: "copyDependenciesToTest",
  copyToTest: "copyToTest",

  // Demo
  copyToDemo: "copyToDemo",
  copyDependenciesToDemo: "copyDependenciesToDemo",
  copyDemoToDemo: "copyDemoToDemo",
  demo: "demo",

  // Tests
  manualTest: "manualTest"
});

const paths = Object.freeze({
  src: "src/**",
  srcHTML: "src/*.html",
  srcJS: "src/*.js",

  build: "build/compile",
  buildHTML: "build/compile/*.html",
  buildFiles: "build/compile/**",

  // Manual test files
  testSrc: "test/**",
  test: "build/test",
  testComponent: "build/test/" + bowerConfig.name,
  testTest: "build/test/test",

  // Demo files
  demoSrc: "demo/**",
  demo: "build/demo",
  demoComponent: "build/demo/" + bowerConfig.name,
  demoDemo: "build/demo/demo"
});

/// Helpers
function handleError(e) {
  gutil.log(gutil.colors.red(e));
  this.emit("end");
}

/// Demo tasks
gulp.task(tasks.compileJs, () =>
  gulp.src(paths.srcJS)
    .pipe(babel({
      presets: ["es2015"]
    }))
    .on("error", handleError)
    .pipe(gulp.dest(paths.build))
);

gulp.task(tasks.compileHtml, () =>
  gulp.src(paths.srcHTML)
    .on("error", handleError)
    .pipe(gulp.dest(paths.build))
);

gulp.task(tasks.inline, [tasks.compileHtml, tasks.compileJs], () =>
  gulp.src(paths.buildHTML)
    .pipe(inlinesource())
    .pipe(gulp.dest(paths.build))
);

gulp.task(tasks.minifyInline, [tasks.inline], () =>
  gulp.src(paths.buildHTML)
    .pipe(minifyInline())
    .pipe(gulp.dest(paths.build))
);

gulp.task(tasks.minify, [tasks.minifyInline], () =>
  gulp.src(paths.buildHTML)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.build))
);

gulp.task(tasks.build, [tasks.minify], () =>
  gulp.src(paths.buildHTML)
    .pipe(gulp.dest("."))
);

// Automatic tests
wct.gulp.init(gulp, [tasks.build]);

// Manual tests
gulp.task(tasks.manualTest, [tasks.build], () => {
  gulp.watch(paths.demoJS, [tasks.build]);
  gulp.watch(paths.srcJS, [tasks.build]);
  gulp.watch(paths.demoHTML, [tasks.build]);
  gulp.watch(paths.srcHTML, [tasks.build]);

  gulp.src(".")
    .pipe(webserver({
      host: "localhost",
      port: 8000,
      livereload: true,
      directoryListing: true,
      open: "http://localhost:8000/test/manual"
    }));
});

// Manual tests
gulp.task(tasks.copyTestToTest, () => {
  return gulp.src(paths.testSrc)
    .on("error", handleError)
    .pipe(gulp.dest(paths.testTest));
});

gulp.task(tasks.copyDependenciesToTest, () =>
  gulp.src("bower_components/**/*")
    .on("error", handleError)
    .pipe(gulp.dest(paths.test))
);

gulp.task(tasks.copyToTest, [tasks.compileHtml, tasks.compileJs], () =>
  gulp.src(paths.buildFiles)
    .on("error", handleError)
    .pipe(gulp.dest(paths.testComponent))
);

gulp.task(tasks.manualTest, [tasks.copyToTest, tasks.copyTestToTest, tasks.copyDependenciesToTest], () => {
  const dep = [tasks.copyToTest, tasks.copyTestToTest, tasks.copyDependenciesToTest];
  gulp.watch(paths.src, dep);
  gulp.watch(paths.testSrc, dep);

  gulp.src(paths.test)
    .pipe(webserver({
      host: "localhost",
      port: 8000,
      livereload: true,
      directoryListing: true,
      open: "http://localhost:8000/test/manual"
    }));
});

// Demo
gulp.task(tasks.copyDemoToDemo, () => {
  return gulp.src(paths.demoSrc)
    .on("error", handleError)
    .pipe(gulp.dest(paths.demoDemo));
});

gulp.task(tasks.copyDependenciesToDemo, () =>
  gulp.src("bower_components/**/*")
    .on("error", handleError)
    .pipe(gulp.dest(paths.demo))
);

gulp.task(tasks.copyToDemo, [tasks.build], () =>
  gulp.src(paths.buildHTML)
    .on("error", handleError)
    .pipe(gulp.dest(paths.demoComponent))
);

gulp.task(tasks.demo, [tasks.copyToDemo, tasks.copyDemoToDemo, tasks.copyDependenciesToDemo], () => {
  const dep = [tasks.copyToDemo, tasks.copyDemoToDemo, tasks.copyDependenciesToDemo]
  gulp.watch(paths.src, dep);
  gulp.watch(paths.demoSrc, dep);

  gulp.src(paths.demo)
    .pipe(webserver({
      host: "localhost",
      port: 8000,
      livereload: true,
      directoryListing: true,
      open: "http://localhost:8000/demo"
    }));
});