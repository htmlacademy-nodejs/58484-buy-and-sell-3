'use strict';

const fs = require(`fs`).promises;
const {MOCKS_FILE_NAME} = require(`../../constants`);

let data = null;

const getMockData = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(MOCKS_FILE_NAME, `utf-8`);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.error(`Can't read data from file... ${err.message}`);
    return Promise.reject([]);
  }

  return Promise.resolve(data);
};

module.exports = getMockData;
