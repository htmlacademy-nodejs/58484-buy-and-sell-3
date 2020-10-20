'use strict';

const fs = require(`fs`);
const {promisify} = require(`util`);
const {ExitCode} = require(`../../constants`);
const {ChalkTheme} = require(`./chalk-theme`);

const {
  success,
  error,
  warning
} = ChalkTheme.generate;

const {
  getRandomInt,
  shuffle,
  addLeadZero,
  getRandomItem,
  getRandomItems,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT_LIMIT = 1000;
const FILE_NAME = `mocks.json`;

const MockFileName = {
  SENTENCES: `sentences.txt`,
  TITLES: `titles.txt`,
  CATEGORIES: `categories.txt`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const getPictureFileName = (int) => {
  return `item${addLeadZero(int)}.jpg`;
};

const createFile = async (content) => {
  try {
    const writeFile = promisify(fs.writeFile);

    await writeFile(FILE_NAME, content);
    console.info(success(`Operation success. File created.`));
  } catch (e) {
    console.error(error(`Can't write data to file... ${e.message}`));
    process.exit(ExitCode.ERROR);
  }
}

const readFile = async (fileName) => {
  try {
    const readFile = promisify(fs.readFile);
    const data =  await readFile(fileName, `utf8`);

    return data
      .trim()
      .split(`\n`);
  } catch (e) {
    console.error(error(`Can't read data from file... ${e.message}`))
  }
};

const getMockData = async () => {
  const sentences = await readFile(`./data/${MockFileName.SENTENCES}`);
  const titles = await readFile(`./data/${MockFileName.TITLES}`);
  const categories = await readFile(`./data/${MockFileName.CATEGORIES}`);

  return {
    sentences,
    titles,
    categories,
  }
};

const generateOffers = async (count) => {
  const {
    sentences,
    titles,
    categories,
  } = await getMockData();

  return Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(sentences).slice(0, 5).join(` `),
    type: getRandomItem(Object.values(OfferType)),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    category: getRandomItems(categories),
  }))
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;

    if (count > MAX_COUNT_LIMIT) {
      console.info(warning(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(await generateOffers(countOffer));

    await createFile(content);
  }
};
