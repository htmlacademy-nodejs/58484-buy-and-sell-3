'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/add`, (req, res) => {
  res.render(`new-ticket`);
});

offersRouter.get(`/:id`, (req, res) => {
  res.render(`ticket`, {id: req.params.id});
});

offersRouter.get(`/edit/:id`, (req, res) => {
  res.render(`ticket-edit`, {id: req.params.id});
});

offersRouter.get(`/category/:id`, (req, res) => {
  res.render(`category`, {id: req.params.id});
});

module.exports = offersRouter;
