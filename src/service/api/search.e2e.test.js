'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
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
  {
    'categories': [
      mockCategories[1].id
    ],
    'comments': [
      {
        'text': `Почему в таком ужасном состоянии?`
      },
      {
        'text': `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        'text': `С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле. Оплата наличными или перевод на карту?`
      }
    ],
    'description': `Если товар не понравится — верну всё до последней копейки. Если найдёте дешевле — сброшу цену. При покупке с меня бесплатная доставка в черте города. Бонусом отдам все аксессуары.`,
    'picture': `item12.jpg`,
    'title': `Продам слона`,
    'typeId': 1,
    'sum': 96693,
    'userId': 1
  },
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  const categoriesName = mockCategories.map(({name}) => name);
  await initDB(mockDB, {categories: categoriesName, offers: mockOffers});
  search(app, new DataService(mockDB));
});

describe(`service/api/search.js`, () => {

  describe(`API returns offer based on search query`, () => {

    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/search`)
        .query({
          query: `Куплю антиквариат`
        });
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`1 offer found`, () => {
      expect(response.body.length).toBe(1);
    });

    it(`Offer has correct title`, () => {
      expect(response.body[0].title).toBe(`Куплю антиквариат`);
    });

  });

  it(`API returns code 404 if nothing is found`, async () => {
    const response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`
      });

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  it(`API returns code 400 if query is not pass`, async () => {
    const response = await request(app)
      .get(`/search`);

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});
