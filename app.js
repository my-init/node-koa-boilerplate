const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');

const { isDevelopEnvironment, LOG } = require('./utils'),
  logger = LOG(module);
const controller = require('./controllers');

// TODO: move to utils
const { errorHandler } = require('./error-handler');

let port = 80;
let trustedOrigin = 'https://some.domain.com';

if (isDevelopEnvironment()) {
  port = 3001;
  trustedOrigin = '*';
}

app.use(bodyParser());

// CORS and global ERROR handling
app.use(async (ctx, next) => {
  try {
    ctx.set('Access-Control-Allow-Origin', trustedOrigin);
    ctx.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    ctx.set('Access-Control-Allow-Credentials', true);
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

    if (ctx.request.method == 'OPTIONS') {
      ctx.response.status = 204;
    } else {
      await next();
    }
  } catch (err) {
    errorHandler(ctx, err);
  }
});

logger.info('server running on port: %d', port);

app.use(controller());

app.listen(port);
