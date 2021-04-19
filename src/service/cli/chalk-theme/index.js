'use strict';

const help = require(`./help`);
const filldb = require(`./filldb`);
const version = require(`./version`);
const server = require(`./server`);

const ChalkTheme = {
  filldb,
  help,
  version,
  server,
};

module.exports = {
  ChalkTheme,
};
