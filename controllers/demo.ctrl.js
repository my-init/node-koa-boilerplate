const { ApiDefinition } = require('../models'),
  {
    resolveReferenceSchema,
    isEmptyArray,
    getRandomString,
    isEmptyObj,
    CONST,
    LOG
  } = require('../utils'),
  logger = LOG(module);
const apiService = require('../services/demo.service');

// get one api / apis by group / all apis
let fn_get_api = async ctx => {
  let apis,
    { method, host, _id, group, path, version } = ctx.request.query;
  try {
    if (group) {
      apis = await apiService.getApiByGroup(group);
    } else if (_id) {
      apis = await apiService.getApiById(_id);

      !isEmptyObj(apis) &&
        ctx.request.query.isResolveRef &&
        (await resolveRefs(apis));
      ctx.body = apis;
      return;
    } else if (method && path && host) {
      version = version || '';
      apis = await apiService.getApiByHostPathMethodVersion({
        method,
        path,
        host,
        version
      });

      ctx.request.query.isResolveRef && (await resolveRefs(apis));
      ctx.body = apis;
      return;
    } else {
      // get all
      apis = await apiService.getAllApi();
    }

    if (!isEmptyArray(apis)) {
      apis.forEach(async api => {
        ctx.request.query.isResolveRef && (await resolveRefs(api));
      });
    }
    ctx.body = apis;
  } catch (e) {
    logger.error('get api: %j', e);
    ctx.response.status = 500;
    ctx.body = Object.assign({ detail: e }, CONST.EXCEPTION_API_GET);
  }
};

async function resolveRefs(api) {
  api.request && (await resolveReferenceSchema(api.request));
  api.response && (await resolveReferenceSchema(api.response));
}

let fn_create_api = async ctx => {
  try {
    let api = ctx.request.body;
    let existApi = await ApiDefinition.findAll({
      where: {
        path: api.path,
        host: api.host,
        method: api.method,
        version: api.version || ''
      }
    });
    if (!isEmptyArray(existApi)) {
      ctx.response.status = 400;
      ctx.body = {
        code: CONST.API_EXIST.code,
        msg: CONST.API_EXIST.msg.replace(
          '{0}',
          existApi[0] && existApi[0].title
        )
      };
      return;
    }

    let id = 'API_' + getRandomString();
    api._id = id;
    api.schemaUri = api.schemaUri || api.method + '/' + api.host + api.path;

    await ApiDefinition.build(api).save();

    ctx.body = Object.assign({ _id: id }, CONST.SUCCESS_API_CREATE);
  } catch (e) {
    logger.error('create api: %j', e);
    ctx.response.status = 500;
    ctx.body = Object.assign({ detail: e }, CONST.EXCEPTION_API_CREATE);
  }
};

let fn_api_delete = async ctx => {
  // TODO 自动化测试/MOCK如果有依赖，需要提示（或者自动删除）
  try {
    await ApiDefinition.destroy({
      where: {
        method: ctx.request.query.method,
        path: ctx.request.query.path,
        host: ctx.request.query.host,
        version: ctx.request.query.version || ''
      }
    });
    ctx.body = CONST.SUCCESS_API_DELETE;
  } catch (e) {
    logger.error('error: %j', e);
    ctx.status = 500;
    ctx.body = Object.assign({ detail: e }, CONST.EXCEPTION_API_DELETE);
  }
};

// edit
let fn_api_put = async ctx => {
  try {
    let api = ctx.request.body;
    api.version = api.version || '';
    let result = await apiService.updateApi(api);
    if (result) {
      ctx.body = CONST.SUCCESS_API_UPDATE;
    } else {
      ctx.response.status = 500;
      ctx.body = CONST.EXCEPTION_API_UPDATE;
    }
  } catch (e) {
    logger.error('error: %j', e);
    ctx.response.status = 500;
    ctx.body = Object.assign({ detail: e }, CONST.EXCEPTION_API_UPDATE);
  }
};

const API_BASE_URL = '/api';

module.exports = {
  get: [
    {
      url: API_BASE_URL,
      handler: fn_get_api
    }
  ],
  post: [
    {
      url: API_BASE_URL,
      handler: fn_create_api
    }
  ],
  put: [
    {
      url: API_BASE_URL,
      handler: fn_api_put
    }
  ],
  delete: [
    {
      url: API_BASE_URL,
      handler: fn_api_delete
    }
  ]
};
