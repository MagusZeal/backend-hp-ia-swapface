'use strict';

async function exists(nameModel, where, include = []) {
  const model = require(`../../database/models/${nameModel}`).class;
  const modelFind = await model.findOne({ include, where, });

  if (!modelFind) {
    throw new Error('exists');
  }
}

module.exports = exists;
