'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const offer = require(`./offer`);
const DataService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);
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

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  const categoriesName = mockCategories.map(({name}) => name);
  await initDB(mockDB, {categories: categoriesName, offers: mockOffers});
  const app = express();
  app.use(express.json());
  offer(app, new DataService(mockDB), new CommentService(mockDB));

  return app;
};

describe(`service/api/offer.js`, () => {

  describe(`API returns a list of all offers`, () => {
    let response;

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app)
        .get(`/offers`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns a list of 5 offers`, () => {
      expect(response.body.length).toBe(2);
    });

    it(`First offer's id equals 1`, () => {
      expect(response.body[0].id).toBe(1);
    });

  });

  describe(`API returns an offer with given id`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .get(`/offers/1`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Offer's title is "Куплю антиквариат"`, () => {
      expect(response.body.title).toBe(`Куплю антиквариат`);
    });

    it(`Status code 404`, async () => {
      response = await request(app)
        .get(`/offers/999`);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

    it(`Status code 400`, async () => {
      response = await request(app)
        .get(`/offers/test`);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

  });

  describe(`API creates an offer if data is valid`, () => {
    const newOffer = {
      categories: [1, 2],
      title: `Дам погладить котика`,
      description: `Дам погладить котика. Дорого. Не гербалайф`,
      picture: `cat.jpg`,
      typeId: 1,
      sum: 100500,
    };

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .post(`/offers`)
        .send(newOffer);
    });

    it(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`Returns offer created`, () => {
      delete newOffer.categories;
      expect(response.body).toEqual(expect.objectContaining(newOffer));
    });

    it(`Offers count is changed`, async () => {
      response = await request(app)
        .get(`/offers`);

      expect(response.body.length).toBe(3);
    });

  });

  describe(`API refuses to create an offer if data is invalid`, () => {
    const newOffer = {
      categories: [1, 2],
      title: `Дам погладить котика`,
      description: `Дам погладить котика. Дорого. Не гербалайф`,
      typeId: 1,
      sum: 100500,
    };

    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    it(`Without any required property response code is 400`, async () => {
      for (const key of Object.keys(newOffer)) {
        const badOffer = {...newOffer};
        delete badOffer[key];

        const response = await request(app)
          .post(`/offers`)
          .send(badOffer);

        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      }

    });

    it(`Some new offer property is wrong type`, async () => {
      const invalidOffer = {...newOffer, sum: `100500-wrong type`};

      const response = await request(app)
          .post(`/offers`)
          .send(invalidOffer);

      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

  });

  describe(`API changes existent offer`, () => {
    const newOffer = {
      categories: [1],
      title: `Дам погладить котика!`,
      description: `Дам погладить котика. Дорого. Не гербалайф`,
      picture: `cat.jpg`,
      typeId: 1,
      sum: 100500,
    };

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .put(`/offers/1`)
        .send(newOffer);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns changed offer`, () => {
      expect(response.body).toBeTruthy();
    });

    it(`Offer have changed title equals "Дам погладить котика!"`, async () => {
      response = await request(app)
        .get(`/offers/1`);

      expect(response.body.title).toBe(`Дам погладить котика!`);
    });

  });

  it(`API returns status code 404 when trying to change non-existent offer`, async () => {
    const app = await createAPI();

    const validOffer = {
      categories: [1],
      title: `валидный`,
      description: `объект`,
      picture: `объявления`,
      typeId: 1,
      sum: 404
    };

    const response = await request(app)
      .put(`/offers/999`)
      .send(validOffer);

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  it(`API returns status code 400 when trying to change an offer with invalid data`, async () => {
    const app = await createAPI();

    const invalidOffer = {
      categories: `Это`,
      title: `невалидный`,
      description: `объект`,
      picture: `объявления`,
      typeId: 1
    };

    const response = await request(app)
      .put(`/offers/1`)
      .send(invalidOffer);

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  describe(`API correctly deletes an offer`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();
      response = await request(app)
        .delete(`/offers/1`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns deleted offer`, () => {
      expect(response.body).toBeTruthy();
    });

    it(`Offer count is 1 now`, async () => {
      response = await request(app)
        .get(`/offers`);

      expect(response.body.length).toBe(1);
    });

  });

  it(`API refuses to delete non-existent offer`, async () => {

    const app = await createAPI();

    const response = await request(app)
      .delete(`/offers/999`);

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  describe(`API returns a list of comments to given offer`, () => {

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .get(`/offers/2/comments`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns list of 3 comments`, () => {
      expect(response.body.length).toBe(3);
    });

    it(`First comment's text is "Почему в таком ужасном состоянии?"`, () => {
      expect(response.body[0].text).toBe(`Почему в таком ужасном состоянии?`);
    });

  });

  describe(`API creates a comment if data is valid`, () => {

    const newComment = {
      text: `Валидному комментарию достаточно этого поля`
    };

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .post(`/offers/1/comments`)
        .send(newComment);
    });

    it(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`Comments count is changed`, async () => {
      response = await request(app)
        .get(`/offers/1/comments`);

      expect(response.body.length).toBe(4);
    });

  });

  it(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {

    const app = await createAPI();

    const response = await request(app)
      .post(`/offers/999/comments`)
      .send({
        text: `Неважно`
      });

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);

  });

  it(`API refuses to delete non-existent comment`, async () => {

    const app = await createAPI();

    const response = await request(app)
      .delete(`/offers/1/comments/999`);

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);

  });

  it(`API refuses to delete comment and returned 400 if comment id is not numeric`, async () => {

    const app = await createAPI();

    const response = await request(app)
      .delete(`/offers/1/comments/test`);

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);

  });
});
