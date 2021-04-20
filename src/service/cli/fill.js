'use strict';

const fs = require(`fs`).promises;
const {ChalkTheme} = require(`./chalk-theme`);
const {
  ExitCode,
  MOCKS_DB_FILE_NAME,
  MockFileName,
  OfferSumRestrict,
  OfferPictureRestrict,
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

const OfferType = {
  OFFER: {
    id: 1,
    title: `offer`
  },
  SALE: {
    id: 2,
    title: `sale`
  },
};

const USERS = [
  {
    id: 1,
    email: `ivanov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`
  },
  {
    id: 2,
    email: `petrov@example.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`
  }
];

const getPictureFileName = (int) => {
  return `item${addLeadZero(int)}.jpg`;
};

const createFile = async (content) => {
  try {
    await fs.writeFile(MOCKS_DB_FILE_NAME, content);
    console.info(success(`Operation success. File created.`));
  } catch (e) {
    console.error(error(`Can't write data to file... ${e.message}`));
    process.exit(ExitCode.ERROR);
  }
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
    categories: getRandomItems(generateCategories(categories), 1, MAX_CATEGORY_LIMIT),
    comments: Array(getRandomInt(1, 5)).fill({}).map(() => generateComment(comments, index + 1, USERS.length)),
    userId: getRandomItem(USERS).id
  }));
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const [count] = args;

    if (count > MAX_COUNT_LIMIT) {
      console.info(warning(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const offers = await generateOffers(countOffer);
    const categories = await readFile(`./data/${MockFileName.CATEGORIES}`);
    const comments = offers.flatMap((offer) => offer.comments);

    const offerCategories = offers.flatMap((offer, index) => {
      return offer.categories.map((category) => ({
        offerId: index + 1,
        categoryId: category.id
      }));
    });

    const userValues = USERS.map(
        ({email, passwordHash, firstName, lastName, avatar}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map(
        (name) =>
          `('${name}')`)
      .join(`,\n`);

    const offerValues = offers.map(
        ({title, description, typeId, sum, picture, userId}) =>
          `('${title}', '${description}', '${typeId}', ${sum}, '${picture}', ${userId})`
    ).join(`,\n`);

    const offerCategoryValues = offerCategories.map(
        ({offerId, categoryId}) =>
          `(${offerId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, userId, offerId}) =>
          `('${text}', ${userId}, ${offerId})`
    ).join(`,\n`);

    const typeValues = Object.values(OfferType).map(
        ({title}) => `('${title}')`
    ).join(`,\n`);

    const content = `
      INSERT INTO types(title) VALUES
        ${typeValues};
      INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
        ${userValues};
      INSERT INTO categories(name) VALUES
        ${categoryValues};
      ALTER TABLE offers DISABLE TRIGGER ALL;
      INSERT INTO offers(title, description, type_id, sum, picture, user_id) VALUES
        ${offerValues};
      ALTER TABLE offers ENABLE TRIGGER ALL;
      ALTER TABLE offer_categories DISABLE TRIGGER ALL;
      INSERT INTO offer_categories(offer_id, category_id) VALUES
        ${offerCategoryValues};
      ALTER TABLE offer_categories ENABLE TRIGGER ALL;
      ALTER TABLE comments DISABLE TRIGGER ALL;
      INSERT INTO COMMENTS(text, user_id, offer_id) VALUES
        ${commentValues};
      ALTER TABLE comments ENABLE TRIGGER ALL;
    `;

    await createFile(content);
  }
};
