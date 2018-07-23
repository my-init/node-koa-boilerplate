const Sequelize = require('sequelize');
const fs = require('fs');
const { isDevelopEnvironment, LOG } = require('../utils');
let sequelize;
const logger = LOG(module);
if (isDevelopEnvironment()) {
  logger.info('initialize mysql connection of develop ...');
  // develop
  sequelize = new Sequelize(
    'dbname', // db
    'root', // user
    '1234', // password
    {
      host: '127.0.0.1',
      port: '3307',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      logging: function(sql) {
        logger.debug(sql);
      }
    }
  );
} else {
  logger.info('initialize mysql connection of product ...');
  sequelize = new Sequelize(
    // production config
  );
}

let files = fs.readdirSync(__dirname);

files.forEach(file => {
  if (file.endsWith('.js') && file !== 'index.js') {
    let fileName = file.substr(0, file.length - 3);
    module.exports[fileName] = require('./' + fileName)(sequelize, Sequelize);
    module.exports[fileName].sync();
  }
});

module.exports.Seq = Sequelize;
module.exports.db = sequelize;
