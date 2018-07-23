const { CONST, LOG } = require('./utils'),
  logger = LOG(module);

async function errorHandler(ctx, err) {
  logger.error('get an error: %j', err);
  ctx.body = CONST.SERVER_ERROR;
}

module.exports = {
  errorHandler
};
