'use strict';

const resolve = require('resolve');
const path = require('path');
const vinylFs = require('vinyl-fs');
const mapStream = require('map-stream');
const modularify = require('modularify');

const mdlModuleBaseDir = resolve.sync('material-design-lite/package.json').replace('/package.json', '');

buildJS();

function buildJS() {
  vinylFs.src([
      mdlModuleBaseDir + '/src/**/*.js',
      '!' + mdlModuleBaseDir + '/src/third_party/*.js',
      '!' + mdlModuleBaseDir + '/src/**/demo.js',
      '!' + mdlModuleBaseDir + '/src/mdlComponentHandler.js'
    ])
    .pipe(mapStream((file, callback) => {
      if (file.extname === '.js') {
        file.basename = 'index.js';
        file.contents = new Buffer(transformMDL(String(file.contents)));
      }
      callback(null, file);
    }))
    .pipe(vinylFs.dest(path.join(__dirname, '../src')))
    .on('finish', () => {
      console.log('build finish')

    })
}

function copyFiles() {
  new Promise((resolve, reject) => {
    vinylFs.src([
        mdlModuleBaseDir + '/src/**/*.scss'
      ])
      .pipe(vinylFs.dest(path.join(__dirname, '../src')))
      .on('finish', () => {
        resolve();
      })
  })
}


function transformMDL(code) {
  const opts = {
    plugins: [
      modularify.removeRootCallExpression,
      [modularify.removeCallExpression, {
        callers: [
          'componentHandler'
        ]
      }],
      [modularify.assignGlobalsWithRequire, {
        globals: {
          window: 'global/window',
          document: 'global/document',
          Element: ['global/window', 'Element'],
          HTMLElement: ['global/window', 'HTMLElement'],
          NodeList: ['global/window', 'NodeList'],
          Node: ['global/window', 'Node'],
          MouseEvent: ['global/window', 'MouseEvent']
        },
        ignores: [
          'componentHandler',
          'Math',
          'parseInt',
          'isNaN',
          'Date',
          'console',
          'setTimeout',
          'clearTimeout',
          'Error',
          'Array'
        ]
      }],
      [modularify.exportsReplace, {
        exports: {
          window: 'exports'
        }
      }]
    ]
  };

  return modularify.transform(code, opts)
}