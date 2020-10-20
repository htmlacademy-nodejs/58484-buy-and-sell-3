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
  makeUniqueArray,
  getRandomItem,
} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT_LIMIT = 1000;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Продам книги Стивена Кинга.`,
  `Продам новую приставку Sony Playstation 5.`,
  `Продам отличную подборку фильмов на VHS.`,
  `Куплю антиквариат.`,
  `Куплю породистого кота.`,
  `Продам коллекцию журналов «Огонёк».`,
  `Отдам в хорошие руки подшивку «Мурзилка».`,
  `Продам советскую посуду. Почти не разбита.`,
  `Куплю детские санки.`,
];

const SENTENCES = [
  `Товар в отличном состоянии.`,
  `Пользовались бережно и только по большим праздникам.,`,
  `Продаю с болью в сердце...`,
  `Бонусом отдам все аксессуары.`,
  `Даю недельную гарантию.`,
  `Если товар не понравится — верну всё до последней копейки.`,
  `Это настоящая находка для коллекционера!`,
  `Если найдёте дешевле — сброшу цену.`,
  `Таких предложений больше нет!`,
  `Две страницы заляпаны свежим кофе.`,
  `При покупке с меня бесплатная доставка в черте города.`,
  `Кажется, что это хрупкая вещь.`,
  `Мой дед не мог её сломать.`,
  `Кому нужен этот новый телефон, если тут такое...`,
  `Не пытайтесь торговаться. Цену вещам я знаю.`,
];

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const CATEGORIES = [
  `Книги`,
  `Разное`,
  `Посуда`,
  `Игры`,
  `Животные`,
  `Журналы`,
];

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

const getCategories = (min, max) => {
  const categories = Array(getRandomInt(min, max))
    .fill(``)
    .map(() => CATEGORIES[getRandomInt(min, max)]);

  return makeUniqueArray(categories);
};

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(SENTENCES).slice(1, 5).join(` `),
    type: getRandomItem(Object.values(OfferType)),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    category: getCategories(1, CATEGORIES.length - 1),
  }))
);

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

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;

    if (count > MAX_COUNT_LIMIT) {
      console.info(warning(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer));

    await createFile(content);
  }
};
