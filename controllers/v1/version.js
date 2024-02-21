'use strict';

const packageJson = require('../../package.json');

module.exports = { index, };

async function index() {
  return packageJson.version;
}
