const fs = require('fs');

let files = fs.readdirSync(__dirname),
  CONST = {};
files.forEach(file => {
  if (file.endsWith('.js') && file !== 'index.js') {
    let fileName = file.substr(0, file.length - 3);
    Object.assign(CONST, fileName, require('./' + fileName));
  }
});

module.exports = CONST;
