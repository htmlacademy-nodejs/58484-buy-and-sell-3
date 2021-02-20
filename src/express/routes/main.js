'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const {getAPI} = require(`../api`);

const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`main`, {offers});
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
