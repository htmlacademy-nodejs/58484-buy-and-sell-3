'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();
const {getAPI} = require(`../api`);
const {uploader} = require(`../services/uploader`);
const api = getAPI();

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-ticket`, {categories});
});

offersRouter.post(`/add`, uploader.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const offerData = {
    picture: file.filename,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    category: body.category
  };

  console.log(offerData);

  try {
    await api.createOffer(`/offers`, offerData);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`back`);
  }
}
);

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const offer = await api.getOffer(id);

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
