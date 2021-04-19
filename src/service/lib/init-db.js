'use strict';

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);
const {OfferType, USERS} = require(`../../constants`);

module.exports = async (sequelize, {categories, offers}) => {
  const {Category, Offer, Type, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const typeModels = Type.bulkCreate(
      Object.values(OfferType).map(({title}) => ({title}))
  );

  const userModels = User.bulkCreate(
      USERS.map((user) => user)
  );

  await Promise.all([
    categoryModels,
    typeModels,
    userModels
  ]);

  const offerPromises = offers.map(async (offer) => {
    const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});
    await offerModel.addCategories(offer.categories);
  });

  await Promise.all(offerPromises);
};
