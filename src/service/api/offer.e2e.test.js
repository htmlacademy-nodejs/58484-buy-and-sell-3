'use strict';

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer`);
const DataService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    'id': `UOxdYn`,
    'title': `Продам коллекцию журналов «Огонёк» new.`,
    'picture': `item12.jpg`,
    'description': `Две страницы заляпаны свежим кофе. Таких предложений больше нет new! Две страницы заляпаны свежим кофе new. Таких предложений больше нет! При покупке с меня бесплатная доставка в черте города new.`,
    'type': `offer`,
    'sum': 43889,
    'category': [
      `Журналы new`,
      `Разное`,
      `Посуда new`
    ],
    'comments': [
      {
        'id': `QMjCyp`,
        'text': `А где блок питания С чем связана продажа? Почему так дешёво?`
      },
      {
        'id': `BH8jzs`,
        'text': `С чем связана продажа? Почему так дешёво? А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого Почему в таком ужасном состоянии? Совсем немного... Вы что?! В магазине дешевле.`
      }
    ]
  },
  {
    'id': `9D9EfA`,
    'title': `Продам книги Стивена Кинга.`,
    'picture': `item12.jpg`,
    'description': `Мой дед не мог её сломать. Даю недельную гарантию. Не пытайтесь торговаться. Цену вещам я знаю new. При покупке с меня бесплатная доставка в черте города new. При покупке с меня бесплатная доставка в черте города.`,
    'type': `sale`,
    'sum': 59384,
    'category': [
      `Посуда`,
      `Посуда new`,
      `Журналы new`,
      `Книги new`,
      `Разное ne`
    ],
    'comments': [
      {
        'id': `SBqT-w`,
        'text': `Продаю в связи с переездом. Отрываю от сердца. Совсем немного... Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту? Неплохо, но дорого А где блок питания`
      },
      {
        'id': `CLbUuE`,
        'text': `Совсем немного... Неплохо, но дорого Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    'id': `s7T-yb`,
    'title': `Продам новую приставку Sony Playstation 5 new.`,
    'picture': `item12.jpg`,
    'description': `Кому нужен этот новый телефон, если тут такое... Мой дед не мог её сломать new. Кажется, что это хрупкая вещь. При покупке с меня бесплатная доставка в черте города. Две страницы заляпаны свежим кофе.`,
    'type': `offer`,
    'sum': 97270,
    'category': [
      `Разное new`,
      `Животные`,
      `Игры`,
      `Журналы new`,
      `Книги new`,
      `Посуда new`,
      `Игры new`
    ],
    'comments': [
      {
        'id': `x0l-VE`,
        'text': `С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца. А где блок питания Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. Неплохо, но дорого Оплата наличными или перевод на карту? Совсем немного... А сколько игр в комплекте?`
      },
      {
        'id': `WnvzWE`,
        'text': `Оплата наличными или перевод на карту? Неплохо, но дорого`
      },
      {
        'id': `_Ylqbb`,
        'text': `С чем связана продажа? Почему так дешёво? Совсем немного... А сколько игр в комплекте? А где блок питания`
      }
    ]
  },
  {
    'id': `TujuDF`,
    'title': `Продам отличную подборку фильмов на VHS.`,
    'picture': `item11.jpg`,
    'description': `Мой дед не мог её сломать new. Кажется, что это хрупкая вещь. Две страницы заляпаны свежим кофе new. Кому нужен этот новый телефон, если тут такое new... Продаю с болью в сердце...`,
    'type': `sale`,
    'sum': 59714,
    'category': [
      `Животные new`,
      `Журналы`
    ],
    'comments': [
      {
        'id': `H9qmO_`,
        'text': `Неплохо, но дорого Оплата наличными или перевод на карту? А где блок питания Продаю в связи с переездом. Отрываю от сердца. Совсем немного... С чем связана продажа? Почему так дешёво?`
      },
      {
        'id': `a1fqN_`,
        'text': `Почему в таком ужасном состоянии? Неплохо, но дорого С чем связана продажа? Почему так дешёво? А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле. А где блок питания`
      }
    ]
  },
  {
    'id': `phwSGM`,
    'title': `Продам коллекцию журналов «Огонёк».`,
    'picture': `item15.jpg`,
    'description': `Две страницы заляпаны свежим кофе. Мой дед не мог её сломать new. Продаю с болью в сердце... При покупке с меня бесплатная доставка в черте города new. Если товар не понравится — верну всё до последней копейки.`,
    'type': `offer`,
    'sum': 57470,
    'category': [
      `Посуда`,
      `Разное new`,
      `Игры`,
      `Посуда new`,
      `Игры new`
    ],
    'comments': [
      {
        'id': `ONKM94`,
        'text': `Вы что?! В магазине дешевле. Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво? А сколько игр в комплекте?`
      },
      {
        'id': `wSnsWL`,
        'text': `А где блок питания`
      },
      {
        'id': `31bV2q`,
        'text': `Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        'id': `nXtoZD`,
        'text': `А сколько игр в комплекте? Совсем немного... С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле. А где блок питания Неплохо, но дорого Почему в таком ужасном состоянии?`
      },
      {
        'id': `2c6kDf`,
        'text': `Почему в таком ужасном состоянии?`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());

  offer(app, new DataService(cloneData), new CommentService());
  return app;
};

const newOffer = {
  category: `Котики`,
  title: `Дам погладить котика`,
  description: `Дам погладить котика. Дорого. Не гербалайф`,
  picture: `cat.jpg`,
  type: `OFFER`,
  sum: 100500
};

describe(`service/api/offer.js`, () => {

  describe(`API returns a list of all offers`, () => {
    const app = createAPI();

    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/offers`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns a list of 5 offers`, () => {
      expect(response.body.length).toBe(5);
    });

    it(`First offer's id equals "UOxdYn"`, () => {
      expect(response.body[0].id).toBe(`UOxdYn`);
    });

  });

  describe(`API returns an offer with given id`, () => {

    const app = createAPI();

    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/offers/UOxdYn`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Offer's title is "Продам коллекцию журналов «Огонёк» new."`, () => {
      expect(response.body.title).toBe(`Продам коллекцию журналов «Огонёк» new.`);
    });

    it(`Status code 404`, async () => {
      response = await request(app)
        .get(`/offers/UOxdYnTEST`);

      expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
    });

  });

  describe(`API creates an offer if data is valid`, () => {

    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/offers`)
        .send(newOffer);
    });

    it(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`Returns offer created`, () => {
      expect(response.body).toEqual(expect.objectContaining(newOffer));
    });

    it(`Offers count is changed`, async () => {
      response = await request(app)
        .get(`/offers`);

      expect(response.body.length).toBe(6);
    });

  });

  describe(`API refuses to create an offer if data is invalid`, () => {

    const app = createAPI();

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

  });

  describe(`API changes existent offer`, () => {

    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .put(`/offers/UOxdYn`)
        .send(newOffer);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns changed offer`, () => {
      expect(response.body).toEqual(expect.objectContaining(newOffer));
    });

    it(`Offer have changed title equals "Дам погладить котика"`, async () => {
      response = await request(app)
        .get(`/offers/UOxdYn`);

      expect(response.body.title).toBe(`Дам погладить котика`);
    });

  });

  it(`API returns status code 404 when trying to change non-existent offer`, async () => {
    const app = createAPI();

    const validOffer = {
      category: `Это`,
      title: `валидный`,
      description: `объект`,
      picture: `объявления`,
      type: `однако`,
      sum: 404
    };

    const response = await request(app)
      .put(`/offers/NOEXST`)
      .send(validOffer);

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  it(`API returns status code 400 when trying to change an offer with invalid data`, async () => {
    const app = createAPI();

    const invalidOffer = {
      category: `Это`,
      title: `невалидный`,
      description: `объект`,
      picture: `объявления`,
      type: `нет поля sum`
    };

    const response = await request(app)
      .put(`/offers/UOxdYn`)
      .send(invalidOffer);

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  describe(`API correctly deletes an offer`, () => {

    const app = createAPI();

    let response;

    beforeAll(async () => {
      response = await request(app)
        .delete(`/offers/UOxdYn`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns deleted offer`, () => {
      expect(response.body.id).toBe(`UOxdYn`);
    });

    it(`Offer count is 4 now`, async () => {
      response = await request(app)
        .get(`/offers`);

      expect(response.body.length).toBe(4);
    });

  });

  it(`API refuses to delete non-existent offer`, async () => {

    const app = createAPI();

    const response = await request(app)
      .delete(`/offers/NOEXST`);

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  describe(`API returns a list of comments to given offer`, () => {

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .get(`/offers/UOxdYn/comments`);
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`Returns list of 3 comments`, () => {
      expect(response.body.length).toBe(2);
    });

    it(`First comment's text is "А где блок питания С чем связана продажа? Почему так дешёво?"`, () => {
      expect(response.body[0].text).toBe(`А где блок питания С чем связана продажа? Почему так дешёво?`);
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
        .post(`/offers/UOxdYn/comments`)
        .send(newComment);
    });

    it(`Status code 201`, () => {
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    it(`Comments count is changed`, async () => {
      response = await request(app)
        .get(`/offers/UOxdYn/comments`);

      expect(response.body.length).toBe(3);
    });

  });

  it(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {

    const app = createAPI();

    const response = await request(app)
      .post(`/offers/NOEXST/comments`)
      .send({
        text: `Неважно`
      });

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);

  });

  it(`API refuses to delete non-existent comment`, async () => {

    const app = createAPI();

    const response = await request(app)
      .delete(`/offers/UOxdYn/comments/NOEXST`);

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);

  });
});
