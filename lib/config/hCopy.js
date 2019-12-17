const fs = require('fs');
const path = require('path');

function hCopy() {}
hCopy.prototype.run = (copyConfig) => {
  console.log('H-CLI COPY START');
  if (copyConfig === undefined) {
    copyConfig = {
      "include": [],
      "except": [],
    };
  }
  let include = copyConfig.include || [];
  include.push({
    "src": "public",
    "dist": "/public"
  });
  if (include.length <= 0) {
    console.log('H-CLI COPY NOTHING TODO');
    return
  }
  let except = copyConfig.except || [];
  let paths = (dir, callback) => {
    fs.readdirSync(dir).forEach((file) => {
      const pathname = path.join(dir, file);
      if(fs.statSync(pathname).isDirectory()) {
        paths(pathname, callback);
      }else {
        callback(dir,file);
      }
    });
  };
  include.forEach((dir) => {
    paths(dir.src, (d, f) => {
      let dst = 'dist' + (dir.dist || '');
      if (except.includes(dir.src+'/'+f) === false) {
        const nd = d.replace(/\\/g,'/').replace(dir.src, dst);
        const nds = nd.split('/');
        let s = '';
        nds.forEach((n) => {
          s += (s === '') ? n : `/${n}`;
          if (!fs.existsSync(s)) {
            fs.mkdirSync(s);
          }
        });
        if (f.indexOf('.html') === -1) { // not copy index.html
          const df = `${d}/${f}`;
          const nf = `${nd}/${f}`;
          console.log(`>> cp ${df} -> ${nf}`);
          fs.createReadStream(df).pipe(fs.createWriteStream(nf));
        }
      }
    });
  });
  console.log('H-CLI COPY FINISHED');
};

var c = new hCopy();
module.exports = c;
