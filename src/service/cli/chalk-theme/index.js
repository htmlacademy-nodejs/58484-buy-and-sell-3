'use strict';

const help = require(`./help`);
const generate = require(`./generate`);
const version = require(`./version`);

const ChalkTheme = {
  generate,
  help,
  version,
};

module.exports = {
  ChalkTheme,
};
