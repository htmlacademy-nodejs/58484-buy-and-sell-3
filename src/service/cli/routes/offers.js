'use strict';

const {Router} = require(`express`);
const offersController = require(`../controllers/offer-controller`);
const offersRouter = new Router();

offersRouter.get(`/`, offersController.index);

module.exports = offersRouter;
