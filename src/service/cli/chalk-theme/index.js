'use strict';

const help = require(`./help`);
const generate = require(`./generate`);
const version = require(`./version`);
const server = require(`./server`);

const ChalkTheme = {
  generate,
  help,
  version,
  server,
};

module.exports = {
  ChalkTheme,
};
