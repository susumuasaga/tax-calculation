'use strict'

const gulp = require('gulp4');
const ts = require('gulp-typescript');
const jest = require('gulp-jest').default;
const istanbul = require('gulp-istanbul');
const isparta = require('isparta');
const plumber = require('gulp-plumber');

let tsProject = ts.createProject('server/tsconfig.json');

function compile() {
  return tsProject
    .src()
    .pipe(tsProject())
    .js
    .pipe(gulp.dest('dist'));
}
exports.compile = compile;

function preCoverage() {
  return gulp
    .src('dist/!(spec)/**/*.js')
    .pipe(istanbul({ instrumenter: isparta.Instrumenter }))
    .pipe(istanbul.hookRequire());
}

function doCoverage() {
  return gulp
    .src('dist/spec/**/*.spec.js')
    .pipe(jest())
    .pipe(istanbul.writeReports());
}

function test(done) {
  return gulp
    .src('dist/spec/**/*.spec.js')
    .pipe(plumber())
    .pipe(jest());
}
exports.test = test;

const coverage = gulp.series(preCoverage, doCoverage);
exports.coverage = coverage;

function watch() {
  gulp.watch('server/**/*.ts', gulp.series(compile, test));
}
exports.watch = watch;
