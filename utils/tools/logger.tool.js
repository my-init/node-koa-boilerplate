/*
 * log files saved in 'logs' under application root directory
 *
 * `log.info('msg')` `log.warn('msg')` etc.
 * `log.info('obj: %j, string: %s, number: %d', {name: 'Jonge Den'}, 'string test', 'number test')`
 */

const { createLogger, format, transports } = require('winston'),
  { combine, timestamp, label, printf } = format,
  DailyRotateFile = require('winston-daily-rotate-file'),
  path = require('path'),
  appRoot = require('app-root-path'),
  { isDevelopEnvironment } = require('./common.tool');

// https://stackoverflow.com/questions/13410754/i-want-to-display-the-file-name-in-the-log-statement
// display filename
function getLabel(module) {
  var parts = module.filename.split('/');
  return parts[parts.length - 2] + '/' + parts.pop();
}

module.exports = {
  LOG: function(callingModule) {
    const myFormat = printf(info => {
        return `[${info.timestamp}] [${info.level}] ${info.label}: ${
          info.message
        }`;
      }),
      LOG_PATH = `${appRoot}/logs/`,
      transportsConfig = [
        new DailyRotateFile({
          filename: path.join(LOG_PATH, 'app.log'),
          datePattern: 'YYYY-MM-DD',
          localTime: true,
          maxDays: 180
        })
      ];

    let level = 'info';

    if (isDevelopEnvironment()) {
      level = 'debug';
      transportsConfig.push(new transports.Console());
    }

    return createLogger({
      level,
      format: combine(
        // colorize(),
        // file location
        label({ label: getLabel(callingModule) }),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS'
        }),
        format.splat(),
        myFormat
      ),
      transports: transportsConfig
    });
  }
};
