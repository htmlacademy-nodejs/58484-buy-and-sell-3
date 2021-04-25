'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const {getAPI} = require(`../api`);

const api = getAPI();

const OFFERS_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;

  const offset = (page - 1) * OFFERS_PER_PAGE;
  const [
    {count, offers},
    categories
  ] = await Promise.all([
    api.getOffers({limit, offset}),
    api.getCategories(true) // опциональный аргумент
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {offers, categories, page, totalPages});
});

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`search-result`, {
      results
    });
  } catch (error) {
    res.render(`search-result`, {
      results: []
    });
  }
});

mainRouter.get(`/login`, (req, res) => {
  res.render(`login`);
});

mainRouter.get(`/register`, (req, res) => {
  res.render(`sign-up`);
});

module.exports = mainRouter;
