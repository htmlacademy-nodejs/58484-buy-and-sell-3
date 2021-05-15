'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();
const {OfferType} = require(`../../constants`);
const {getAPI} = require(`../api`);
const {uploader} = require(`../services/uploader`);
const api = getAPI();

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  const {error = null} = req.session;
  delete req.session.error;

  res.render(`new-ticket`, {categories, error});
});

offersRouter.post(`/add`, uploader.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const typeId = OfferType[body.action] && OfferType[body.action].id;

  const offerData = {
    sum: body.price,
    typeId,
    description: body.comment,
    title: body[`ticket-name`],
    categories: body.categories
  };

  if (file) {
    offerData.picture = file.filename;
  }

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (err) {
    req.session.error = err.response.data;
    res.redirect(`back`);
  }
}
);

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const offer = await api.getOffer(id, true);

  res.render(`ticket`, {offer});
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);

  res.render(`ticket-edit`, {offer, categories});
});

offersRouter.get(`/category/:id`, (req, res) => {
  res.render(`category`, {id: req.params.id});
});

module.exports = offersRouter;
