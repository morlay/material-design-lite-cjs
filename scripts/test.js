'use strict';

const requireDir = require('require-dir')
const window = require('global/window');

window.addEventListener = ()=> {
};

console.log(requireDir('../src'));
