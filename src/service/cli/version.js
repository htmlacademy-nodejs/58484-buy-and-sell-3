'use strict';

const {ChalkTheme} = require(`./chalk-theme`);
const {success} = ChalkTheme.version;
const packageJsonFile = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJsonFile.version;
    console.info(success(version));
  }
};
