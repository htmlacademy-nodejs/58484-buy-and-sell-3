'use strict';

const fs = require(`fs`).promises;

const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const {ChalkTheme} = require(`./chalk-theme`);
const {
  ExitCode,
  MockFileName,
  OfferSumRestrict,
  OfferPictureRestrict,
  USERS,
  OfferType
} = require(`../../constants`);

const {
  success,
  error,
  warning,
} = ChalkTheme.filldb;

const {
  getRandomInt,
  shuffle,
  addLeadZero,
  getRandomItem,
  getRandomItems,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT_LIMIT = 1000;
const MAX_CATEGORY_LIMIT = 3;

const getPictureFileName = (int) => {
  return `item${addLeadZero(int)}.jpg`;
};

const readFile = async (fileName) => {
  try {
    const data = await fs.readFile(fileName, `utf8`);

    return data
      .trim()
      .split(`\n`);
  } catch (e) {
    console.error(error(`Can't read data from file... ${e.message}`));
    return [];
  }
};

const getMockData = async () => {
  const files = Object
    .values(MockFileName)
    .map((fileName) => readFile(`./data/${fileName}`));

  const [
    sentences,
    titles,
    categories,
    comments,
  ] = await Promise.all(files);

  return {
    sentences,
    titles,
    categories,
    comments,
  };
};

const generateCategories = (categories) => (
  categories.map((title, index) => ({
    id: index + 1,
    title
  }))
);

const generateComment = (comments, offerId, userCount) => {
  const maxRowsCount = getRandomInt(1, comments.length);

  const text = shuffle(comments)
    .slice(0, maxRowsCount)
    .join(` `);

  return {
    text,
    userId: getRandomInt(1, userCount),
    offerId,
  };
};

const generateOffers = async (count) => {
  const {
    sentences,
    titles,
    categories,
    comments,
  } = await getMockData();

  return Array(count).fill({}).map((_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(OfferPictureRestrict.MIN, OfferPictureRestrict.MAX)),
    description: shuffle(sentences).slice(0, 5).join(` `),
    typeId: getRandomItem(Object.values(OfferType)).id,
    sum: getRandomInt(OfferSumRestrict.MIN, OfferSumRestrict.MAX),
    categories: getRandomItems(generateCategories(categories), 1, MAX_CATEGORY_LIMIT).map((category) => category.id),
    comments: Array(getRandomInt(1, 5)).fill({}).map(() => generateComment(comments, index + 1, USERS.length)),
    userId: getRandomItem(USERS).id
  }));
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    // Connect to database
    try {
      console.info(success(`Trying to connect to database...`));
      await sequelize.authenticate();
    } catch (err) {
      return console.error(error(`An error occured: ${err.message}`));
    }
    console.info(success(`Connection to database established`));

    const [count] = args;

    if (count > MAX_COUNT_LIMIT) {
      console.info(warning(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const offers = await generateOffers(countOffer);
    const categories = await readFile(`./data/${MockFileName.CATEGORIES}`);

    // fill DB
    console.info(success(`Trying to fill database...`));
    await initDatabase(sequelize, {categories, offers});

    console.info(success(`Database filled!`));
    return process.exit(ExitCode.SUCCESS);
  }
};
