'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => {
  res.send(`/`);
});

mainRouter.get(`/search`, (req, res) => {
  res.send(`/search`);
});

mainRouter.get(`/login`, (req, res) => {
  res.send(`/login`);
});

mainRouter.get(`/register`, (req, res) => {
  res.send(`/register`);
});

module.exports = mainRouter;
