'use strict'

const gulp = require('gulp4');
const ts = require('gulp-typescript');
const jest = require('gulp-jest').default;
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

function test() {
  return gulp
    .src('dist/spec/**/*.spec.js')
    .pipe(plumber())
    .pipe(jest());
}
exports.test = test;

function coverage() {
  return gulp
    .src('dist/spec/**/*.spec.js')
    .pipe(
      jest(
        { collectCoverage: true, collectCoverageFrom: ['dist/calculateTax.js'] }
      )
    );
}
exports.coverage = coverage;

function watch() {
  gulp.watch('server/**/*.ts', gulp.series(compile, test));
}
exports.watch = watch;
