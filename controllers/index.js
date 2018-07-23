const fs = require('fs'),
  { LOG } = require('../utils'),
  logger = LOG(module);

function registerMapper(router, method, mapper) {
  router[method](mapper.url, mapper.handler);
  logger.debug(
    `register URL mapping: ${method.toUpperCase()} ${
      typeof mapper.url === 'object' ? 'regExp:' : 'string:'
    } ${mapper.url}`
  );
}

function addMapping(router, mapping) {
  for (var method in mapping) {
    if (Array.isArray(mapping[method])) {
      mapping[method].forEach(function(mapper) {
        registerMapper(router, method, mapper);
      });
    } else {
      registerMapper(router, method, mapping[method]);
    }
  }
}

function addControllers(router, dir) {
  let path = '/' + dir;
  var files = fs.readdirSync(__dirname + path);
  var js_files = files.filter(f => {
    return f.endsWith('.js') && f !== 'index.js';
  });

  for (var f of js_files) {
    logger.debug(`process controller: ${f}...`);
    let mapping = require(__dirname + path + '/' + f);
    addMapping(router, mapping);
  }
}

module.exports = function(dir) {
  let controllers_dir = dir || '',
    router = require('koa-router')();

  addControllers(router, controllers_dir);
  // default page to add mock data
  router.get('*', async (ctx) => {
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, anybody here?</h1>';
  });
  return router.routes();
};
