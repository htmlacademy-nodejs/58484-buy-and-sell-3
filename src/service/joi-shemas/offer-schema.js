'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
    .required(),

  description: Joi.string()
    .min(50)
    .required(),

  sum: Joi.number()
    .required(),

  picture: Joi.string(),

  typeId: Joi.number()
    .required(),

  categories: Joi.array()
    .items(Joi.number())
    .min(1)
    .required(),
});
