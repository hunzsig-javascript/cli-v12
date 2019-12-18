# cli-v12
A cli for js with webpack

[![NPM version](https://img.shields.io/npm/v/hunzsig-javascript-cli-v12.svg)](https://www.npmjs.com/package/hunzsig-javascript-cli-v12)
[![NPM downloads](http://img.shields.io/npm/dm/hunzsig-javascript-cli-v12.svg?style=flat-square)](http://npmjs.com/hunzsig-javascript-cli-v12)

### please run:
    cnpm install hunzsig-javascript-cli-v12@latest --save-dev

### cmd
    cliv12 dev -p 9235[port]
    cliv12 build
    cliv12 app

### buildConfig in package.json
##### dropConsole : drop console [default true]
##### primaryTheme : webpackage->options->modifyVars
##### import : demand loading [default null]
##### appHtml : html template [default {"dev": "dev.html", "prod": "index.html","app": "app.html"}]
##### publicUrl : support react-router4 BrowserRouter [default {"dev": "/", "prod": "/","app": "./"}]
##### entry : entry like webpackage [default {"dev": "src/index.js", "prod": "src/dev.js","app": "src/app.js"}]
```
"buildConfig": {
  "dropConsole": true,
  "primaryTheme": {
     "primary-color": "#6699ff",
     "brand-primary": "green",
     "color-text-base":  "#333"
  },
  "appHtml": {
    "dev": "dev.html",
    "prod": "index.html",
    "app": "app.html"
  },
  "publicUrl": {
    "dev": "/",
    "prod": "/",
    "app": "./"
  },
  "entry": {
    "dev": "src/index.js",
    "prod": "src/index.js",
    "app": "src/app.js"
  },
  "import": [
    {
      "libraryName": "antd",
      "style": true
    }
  ]
}
```

### proxyConfig in package.json
```
"proxyConfig": {
  "/api": {
    "enable": true,
    "target": "http://your address"
  },
  "/api2": {
    "enable": true,
    "target": "http://your address2"
  }
}
```

### copyConfig in package.json
##### copyConfig will copy files which hope into the dir-dist when run 'npm run build'
##### the public dir is auto copy to dist dir
```
"copyConfig": {
  "include": [],
  "except": []
}
```

