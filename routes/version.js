'use strict';

const express = require('express');
const ErrorEnhanced = require('../core/error-enhanced');
const { httpStatusCodes, } = require('../core/constants');

const baseUrl = '/';
const controller = {
  v1: require('../controllers/v1/version'),
};
const router = express.Router();

router.get(baseUrl, async (req, res, next) => {
  try {
    const response = await controller.v1.index();
    return res.status(httpStatusCodes.ok).json(response);
  } catch (error) {
    return next(
      error instanceof ErrorEnhanced
        ? error
        : new ErrorEnhanced(httpStatusCodes.internalServerError, error)
    );
  }
});

module.exports = router;
