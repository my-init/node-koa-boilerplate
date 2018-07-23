module.exports = {
  // response
  // ======= 200 =======
  // 0xx 基本
  SUCCESS: { code: '200000', msg: '操作成功' },

  // ======= 400 =======
  // 基本 0xx
  BAD_REQUEST: { code: '40000', msg: '' },

  // ======= 500 =======
  // 基本 0xx
  SERVER_ERROR: { code: '500000', msg: '服务器异常' },
};
