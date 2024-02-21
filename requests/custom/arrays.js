'use strict';

async function arrays(nameModel, where, values) {
  const model = require(`../../database/models/${nameModel}`).class;
  const modelCount = await model.count({ where, });

  if (modelCount !== values.length) {
    throw new Error('arrays');
  }
}

module.exports = arrays;
