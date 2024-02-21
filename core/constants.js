'use strict';

const httpStatusCodes = {
  badRequest: 400,
  created: 201,
  forbidden: 403,
  internalServerError: 500,
  notFound: 404,
  ok: 200,
  unauthorized: 401,
};
const messages = {
  error: {
    invalidUUID: 'Invalid UUId',
    missingAuthorizationToken: 'Authorization token is missing',
    forbidden: 'Access denied.',
  },
};
const regex = {
  version: /(\d+)\.(\d+)\.(\d+)/,
  alpha: /^[a-zA-Z]+$/,
};

module.exports = {
  httpStatusCodes,
  messages,
  regex,
};
