'use strict';

const log4js = require('log4js');
const moment = require('moment');
const path = require('path');

const log = {};
let logg = null;

log4js.addLayout('timezone', () => {
  return (event) => {
    return `[${moment.tz('UTC')
      .format('YYYY-MM-DDTHH:mm:ss')}] [${event.level.levelStr}] ${event.categoryName} - ${event.data.join(' ')}`;
  };
});

async function logger() {
  const dateLog = moment().format('YYYY-MM-DD');
  const fileName = `${process.env.LOG_FILE }${dateLog}`;
  const file = path.join(__dirname, '..', 'log/', `${fileName}.log`);
  log4js.configure({
    appenders: {
      default: {
        type: 'file',
        filename: file,
        layout: {
          type: 'timezone',
        },
      },
    },
    categories: {
      default: { appenders: ['default', ], level: 'info', },
    },
  });
}

log.messageInfo = (message = null, ip = null, user = null, method = null, url = null) => {
  logger();
  const _level = `[${ip}] [${user}] [${method}] [${url}]`;
  logg = log4js.getLogger(_level);
  logg.info(JSON.stringify(message));
};

log.messageError = (message = null, ip = null, user = null, method = null, url = null) => {
  logger();
  const _level = `[${ip}] [${user}] [${method}] [${url}]`;
  logg = log4js.getLogger(_level);
  logg.info(JSON.stringify(message));
};

module.exports = log;
