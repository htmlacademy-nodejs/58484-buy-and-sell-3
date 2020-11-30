'use strict';

const fs = require(`fs`).promises;
const {HttpCode} = require(`../../../constants`);

class ReadFileService {
  constructor(path) {
    this.path = path;
  }

  async getJSON() {
    return JSON.parse(await this._read());
  }

  parseError(err) {
    if (err.code === `ENOENT`) {
      return {
        code: HttpCode.NOT_FOUND,
        message: `Not Found`,
      };
    } else {
      return {
        code: HttpCode.INTERNAL_SERVER_ERROR,
        message: `Server error: ${err.message}`,
      };
    }
  }

  async _read() {
    return await fs.readFile(this.path, `utf-8`);
  }
}

module.exports = ReadFileService;
