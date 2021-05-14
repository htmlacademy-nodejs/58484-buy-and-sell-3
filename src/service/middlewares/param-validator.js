'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (schema, param) => (
  async (req, res, next) => {
    const paramToValidate = req.params[param];

    if (!paramToValidate) {
      return res.status(HttpCode.BAD_REQUEST).json({
        message: `${param} not found in request params`,
        data: param
      });
    }

    try {
      await schema.validateAsync(paramToValidate);
    } catch (err) {
      const {details} = err;

      return res.status(HttpCode.BAD_REQUEST).json({
        message: details.map((errorDescription) => errorDescription.message),
        data: paramToValidate
      });
    }

    return next();
  }
);
