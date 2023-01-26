const { buildCheckFunction } = require('express-validator');

const addNumberValidation = buildCheckFunction(['body']);

module.exports = addNumberValidation;
