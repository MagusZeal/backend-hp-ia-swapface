'use strict';

const cors = require('cors');
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const log = require('./logger');
const app = express();
const httpPort = parseInt(process.env.HTTP_PORT, 10);
const message = 'HTTP service started at port';
const root = process.env.API_ROOT;
const timeout = parseInt(process.env.HTTP_TIMEOUT, 10);
const Routes = require('../routes/routes');
const passport = require('passport');
const { getIp, } = require('./helper');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 20 * 1000,
  max: 1,
});
app.use(cors());
app.use(morgan(process.env.MORGAN_MODE));
app.use(root, express.json({ limit: process.env.HTTP_PAYLOAD_LIMIT, }));
app.use(passport.initialize());
app.use(limiter);

app.use('/help', bodyParser.json({extended: true, }));
app.use('/help', require('../routes/version'));

app.use(root, Routes.open);

app.use(handleError);
app.use(handleNotFound);

const server = {};

const httpServer = http.createServer(app);
httpServer.timeout = timeout;
server.start = () => {
  httpServer.listen(httpPort, async () => {
    process.stdout.write(`${ message } ${ httpPort }\n`);
  });
};

module.exports = {
  app,
  server,
};

async function handleError(err, req, res, next) { // eslint-disable-line no-unused-vars
  const ip = await getIp(req);
  const user = req.user ? req.user.identification : null;
  const url = req.url ? req.url.split('?')[0] : '';
  const method = req.method ? req.method : '';

  if (err.status >= 500) {
    log.messageError(err, ip, user, method, url);
  } else {
    log.messageInfo(err, ip, user, method, url);
  }

  res.status(err.status).json(err.message);
}

function handleNotFound(req, res) {
  res.status(404).end();
}
