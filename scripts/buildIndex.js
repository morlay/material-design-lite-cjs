'use strict';

const fs = require('fs');
const path = require('path');
const requireDir = require('require-dir');
const merge = require('lodash.merge');

function findExports(fileDir) {
  const files = requireDir(fileDir, {
    recurse: true
  });

  return Object.keys(files).reduce((exportNames, fileName) => {
    const newFileExports = Object.keys(files[fileName].index).reduce((fileExports, key) => {
      return merge({}, fileExports, {
        [key]: fileName
      })
    }, {});
    return merge({}, exportNames, newFileExports)
  }, {})
}

function buildIndex(exportMap, baseDir) {
  return Object.keys(exportMap).reduce((fileContents, key) => {
    return fileContents + '\n' + `exports['${key}'] = require('${baseDir + exportMap[key]}')['${key}'];`
  }, '')
}

function createIndexFile() {
  const fileContents = `// just show the source map, when install this file will be rebuild
${buildIndex(findExports('../src'), './src/')}`;

  fs.writeFileSync(path.join(__dirname, '../index.js'), fileContents, {
    encode: 'utf-8'
  });
}

createIndexFile();