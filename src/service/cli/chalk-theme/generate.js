'use strict';

const chalk = require('chalk');

const ORANGE_COLOR = `orange`;

module.exports = {
  success: chalk.green,
  error: chalk.red,
  warning: chalk.keyword(ORANGE_COLOR),
};
