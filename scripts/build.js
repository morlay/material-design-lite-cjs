'use strict';

const resolve = require('resolve');
const path = require('path');
const vinylFs = require('vinyl-fs');
const mapStream = require('map-stream');
const transform = require('modularify').transform;

const mdlModuleBaseDir = resolve.sync('material-design-lite/package.json').replace('/package.json', '');

build();

function build() {
  return vinylFs.src([
      mdlModuleBaseDir + '/src*/**/*.js',
      '!' + mdlModuleBaseDir + '/src/third_party/*.js',
      '!' + mdlModuleBaseDir + '/src*/**/demo.js'
    ])
    .pipe(mapStream((file, callback) => {
      file.base = file.dirname;
      file.contents = new Buffer(transformMDL(String(file.contents)));
      callback(null, file);
    }))
    .pipe(vinylFs.dest(path.join(__dirname, '../src')))
    .on('finish', () => {
      console.log('build finish')
    })
}

function transformMDL(code) {
  return transform(code, {
    globals: {
      window: 'global/window',
      document: 'global/document',
      Element: ['global/window', 'Element'],
      HTMLElement: ['global/window', 'HTMLElement'],
      NodeList: ['global/window', 'NodeList'],
      Node: ['global/window', 'Node'],
      MouseEvent: ['global/window', 'MouseEvent'],
      Math: ['global', 'Math'],
      parseInt: ['global', 'parseInt'],
      isNaN: ['global', 'isNaN'],
      Date: ['global', 'Date'],
      console: ['global', 'console'],
      setTimeout: ['global', 'setTimeout'],
      clearTimeout: ['global', 'clearTimeout'],
      Error: ['global', 'Error'],
      Array: ['global', 'Array'],
      componentHandler: ['./mdlComponentHandler', 'componentHandler']
    },
    exports: {
      window: 'exports'
    }
  })
}