## Material Design Lite CommonJS Version

[![NPM](https://img.shields.io/npm/v/material-design-lite-cjs.svg?style=flat-square)](https://npmjs.org/package/material-design-lite-cjs)
[![Dependencies](https://img.shields.io/david/morlay/material-design-lite-cjs.svg?style=flat-square)](https://david-dm.org/morlay/material-design-lite-cjs)
[![License](https://img.shields.io/npm/l/material-design-lite-cjs.svg?style=flat-square)](https://npmjs.org/package/material-design-lite-cjs)

Automatic wrapper CommonJS from https://github.com/google/material-design-lite

Just want to make server render happy :(


```
npm i material-design-lite-cjs -S
```

and

```js
import { MaterialButton } from 'material-design-lite-cjs/src/button'
```

Notice:

* This lib only includes MaterialClass files, MaterialButton, MaterialTooltip and ..;

* `componentHandler` is not necessary, so remove it in each file.

in most usage with component way, React or Angular or other ui framework which have life cycle.

```js
// when component mount
this._materialInstance = new MaterialButton(findDOMNode(this));
// when component unmount
this._materialInstance.mdlDowngrade();
```

* sass files need to import from original one;

```
@import '~material-design-lite/src/button/button'
```

* don't forget `material-design-lite/src/third_party/*.js` as polyfill for cross-browser support