/*
 * export all the tools/consts?
 * data structure:
 * {
 *   method_1,
 *   method_2,
 *   ...
 *   CONST
 * }
 * 
 * @Author: Jonge Den 
 * @Date: 2018-07-09 15:41:39 
 * @Last Modified by: Jonge Den
 * @Last Modified time: 2018-07-17 09:58:38
 */

const fs = require('fs');

let toolsDir = __dirname + '/tools/',
  constantsDir = __dirname + '/consts/',
  files = fs.readdirSync(toolsDir);
files.forEach(file => {
  if (file.endsWith('.js') && file !== 'index.js') {
    let fileName = file.substr(0, file.length - 3);
    Object.assign(module.exports, require(toolsDir + fileName));
  }
});

module.exports.CONST = require(constantsDir);
module.exports.fetch = require('./fetch');
