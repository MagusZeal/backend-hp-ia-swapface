'use strict';

const dotenv = require('dotenv');

dotenv.config();

const { server, } = require('./core/server');

server.start();

if (process.env.SSL_ENABLED === 'true') {
  server.startHttps();
}
