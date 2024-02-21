'use strict';

const { Sequelize, } = require('sequelize');
const moment = require('moment');

const dbDialect = process.env.DB_DIALECT;
const dbHost = process.env.DB_HOST;
const dbLogging = process.env.DB_LOGGING;
const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = parseInt(process.env.DB_PORT, 10);
const dbUser = process.env.DB_USER;
const timezone = process.env.DB_TIMEZONE;

Sequelize[dbDialect].DATEONLY.parse = function(value) {
  return moment.utc(value, 'YYYY-MM-DD').format('YYYY-MM-DD');
};

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: dbDialect,
  logging: dbLogging === 'false' ? false : console.debug, // eslint-disable-line no-console
  host: dbHost,
  port: dbPort,
  timezone,
});

module.exports = sequelize;
