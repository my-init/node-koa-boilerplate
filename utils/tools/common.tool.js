/**
 * deep copy base `JSON.stringify`
 * @param {*} obj
 */
function deepCopy(obj) {
  let result = null;
  try {
    result = JSON.parse(JSON.stringify(obj));
  } catch (e) {
    result = null;
  }
  return result;
}

/**
 * random string [a-zA-Z0-9]
 * @param {*} len default 8
 */
function getRandomString(len = 8) {
  let text = '';
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * is in developping environment, whether `'env'` is in the running script
 */
function isDevelopEnvironment() {
  return process.env.NODE_ENV === 'dev';
}

module.exports = {
  getRandomString,
  deepCopy,
  isDevelopEnvironment,
};
