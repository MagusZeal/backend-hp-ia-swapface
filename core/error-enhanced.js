'use strict';

class ErrorEnhanced extends Error {
  constructor(statusCode, message = undefined) {
    super();
    this.status = statusCode;
    if (message) {
      if (Array.isArray(message)) {
        message.forEach((item) => {
          if (item.msg.search('exists') > -1 && item.location === 'params') {
            this.status = 404;
          }
        });
      }
      this.message = {
        error: message,
      };
    }
  }
}

module.exports = ErrorEnhanced;
