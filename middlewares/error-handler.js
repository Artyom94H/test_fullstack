const { validationResult } = require("express-validator");

const validationErrorHandler = (req, res, next) => {
  try {
    validationResult(req).throw();
    next();
  } catch (e) {
    res.status(400).json(e);
  }
};

module.exports = validationErrorHandler;
