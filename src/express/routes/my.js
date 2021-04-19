'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const {getAPI} = require(`../api`);

const api = getAPI();

const OFFERS_COUNT = 3;

myRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();

  res.render(`my-tickets`, {offers});
});

myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers({comments: true});

  res.render(`comments`, {offers: offers.slice(0, OFFERS_COUNT)});
});

module.exports = myRouter;
