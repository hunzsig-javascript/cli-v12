const fs = require('fs');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());

function entryWithApp(item) {
  if (typeof item === 'string') {
    // 绝对路径直接返回
    if (path.isAbsolute(item)) {
      return item;
    }
    return path.resolve(appDirectory, item);
  } else if (Array.isArray(item)) {
    return item.map((file) => entryWithApp(file));
  }
}

module.exports = (entry) => {
  let entries = {};
  if (Array.isArray(entry) || typeof entry === 'string') {
    entries = {
      index: entryWithApp(entry),
    };
  } else {
    Object.keys(entry).forEach((key) => {
      entries[key] = entryWithApp(entry[key]);
    });
  }
  return entries;
};
