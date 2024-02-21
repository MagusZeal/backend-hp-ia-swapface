'use strict';

const { name, } = require('../package.json');
const crypto = require('crypto');
const moment = require('moment');
const path = require('path');
const momentTimezone = require('moment-timezone');
const fs = require('fs');
const requestIp = require('request-ip');

function getFileName(dirName, fileName) {
  const baseName = path.basename(fileName);
  const dir = dirName.substr(dirName.indexOf(name) + name.length + 1);
  return path.join(dir, `${baseName}`);
}

function formatRutDv(input) {
  let value = '';
  let inputTemp = '';
  if (input) {
    inputTemp = input.replace(/\./g, '').replace(/-/, '');
    const div = inputTemp.substring(inputTemp.length - 1);
    const rut = inputTemp.substring(0, inputTemp.length - 1);
    value = rut + '-' + div;
  }
  return value;
}

const randomString = () => {
  return crypto.randomBytes(10).toString('hex');
};

const randomDate = (start, end) => {
  const random = new Date(start.getTime() + (Math.random() * (end.getTime() - start.getTime())));
  const date = moment(random).format(process.env.BACKEND_DATE_SHORT_FORMAT);

  return date;
};

function decrypt(secretKey) {
  const algorithm = process.env.TERMINAL_ALGORITHM;
  const key = process.env.TERMINAL_KEY;
  const iv = process.env.TERMINAL_IV;
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return decipher.update(secretKey, 'hex', 'utf8') + decipher.final('utf8');
}

function formatRut(input) {
  let value = '';
  let inputTemp = '';
  if (input) {
    inputTemp = input.replace(/\./g, '').replace(/-/, '');
    const div = inputTemp.substring(inputTemp.length - 1);
    const rut = inputTemp.substring(0, inputTemp.length - 1);
    const values = [];
    let countPointDecimal = 1;
    for (let i = rut.length -1; i >= 0; i-=1) {
      values.unshift(rut[i]);
      if (countPointDecimal === 3) {
        values.unshift('.');
        countPointDecimal = 0;
      }
      countPointDecimal+=1;
    }
    values.push('-');
    values.push(div);
    value = values.join('');
  }
  return value;
}

function getDateWithTimezone(datetime, timezone = 'America/Santiago') {
  const offset = momentTimezone.tz(timezone)
    .utcOffset();
  const date = datetime
    .utcOffset(offset);

  return date;
}

function readFileSync(fileName, options) {
  let result = null;
  if (fs.existsSync(path.join(__dirname, '..', fileName))) {
    result = fs.readFileSync(`${ path.join(__dirname, '..', fileName)}`, options);
  }

  return result;
}

const requestPaginations = (req, raw = false) => {
  const response = {
    raw,
    offset: (req.query.offset && !isNaN(req.query.offset)) ? parseInt(req.query.offset, 10) : 0,
    limit: 0,
  };

  if (req.query.limit && !isNaN(req.query.limit)) {
    response.limit = parseInt(req.query.limit, 10);
  } else if (!req.query.export) {
    response.limit = parseInt(process.env.DEFAULT_PAGE_LIMIT, 10);
  }

  if (req.query.order) {
    let order = [];
    for (const item of req.query.order.split(',')) {
      const element = item.trim();
      if (element.indexOf('.') >-1) {
        order = order.concat(element.split('.'));
      } else {
        order.push(element);
      }
    }
    response.order = [ order, ];
  }

  return response;
};

async function getIp(req) {
  return requestIp.getClientIp(req);
}

module.exports = {
  requestPaginations,
  getDateWithTimezone,
  getFileName,
  randomString,
  randomDate,
  decrypt,
  readFileSync,
  formatRutDv,
  getIp,
  formatRut,
};
