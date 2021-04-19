'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);

const mockCategories = [
  {
    id: 1,
    name: `Животные`,
  },
  {
    id: 2,
    name: `Журналы`
  },
  {
    id: 3,
    name: `Игры`
  },
  {
    id: 4,
    name: `Посуда`
  }
];

const mockOffers = [
  {
    'categories': [
      mockCategories[0].id,
      mockCategories[2].id
    ],
    'comments': [
      {
        'text': `С чем связана продажа? Почему так дешёво? Неплохо, но дорого. А где блок питания?`
      },
      {
        'text': `А где блок питания?`
      },
      {
        'text': `Оплата наличными или перевод на карту? Неплохо, но дорого. Почему в таком ужасном состоянии?`
      }
    ],
    'description': `Бонусом отдам все аксессуары. Если товар не понравится — верну всё до последней копейки. Товар в отличном состоянии. Это настоящая находка для коллекционера!`,
    'picture': `item13.jpg`,
    'title': `Куплю антиквариат`,
    'typeId': 1,
    'sum': 10030,
    'userId': 1
  },
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

describe(`service/api/category.js`, () => {
  beforeAll(async () => {
    const categoriesName = mockCategories.map(({name}) => name);
    await initDB(mockDB, {categories: categoriesName, offers: mockOffers});
    category(app, new DataService(mockDB));
  });

  describe(`API returns category list`, () => {

    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/categories`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns list of 4 categories`, () => {
      expect(response.body.length).toBe(4);
    });

    it(`Category names are "Посуда", "Игры", "Животные", "Журналы"`, () => {
      // eslint-disable-next-line max-nested-callbacks
      const categories = response.body.map((cat) => cat.name);
      expect(categories).toEqual(
          expect.arrayContaining([`Посуда`, `Игры`, `Животные`, `Журналы`])
      );
    });

  });
});

