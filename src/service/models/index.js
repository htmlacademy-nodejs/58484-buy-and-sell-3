'use strict';

const Aliase = require(`./aliase`);

const defineCategory = require(`./category`);
const defineType = require(`./type`);
const defineUser = require(`./user`);
const defineOffer = require(`./offer`);
const defineComment = require(`./comment`);
const defineOfferCategory = require(`./offer-category`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Type = defineType(sequelize);
  const User = defineUser(sequelize);
  const Offer = defineOffer(sequelize);
  const Comment = defineComment(sequelize);
  const OfferCategory = defineOfferCategory(sequelize);

  // Offer <-> Comment
  Offer.hasMany(Comment, {
    as: Aliase.COMMENTS,
    foreignKey: `offerId`
  });
  Comment.belongsTo(Offer, {
    foreignKey: `offerId`
  });

  // User <-> Offer
  User.hasMany(Offer, {
    as: Aliase.OFFERS,
    foreignKey: `userId`
  });
  Offer.belongsTo(User, {
    as: Aliase.USER,
    foreignKey: `userId`
  });

  // Offer <-> Type
  Offer.belongsTo(Type, {
    as: Aliase.TYPE,
    foreignKey: `typeId`
  });
  Type.hasMany(Offer, {
    as: Aliase.OFFERS,
    foreignKey: `typeId`
  });

  // Offer <- OfferCategory -> Category
  Offer.belongsToMany(Category, {
    through: OfferCategory,
    as: Aliase.CATEGORIES
  });
  Category.belongsToMany(Offer, {
    through: OfferCategory,
    as: Aliase.OFFERS
  });
  Category.hasMany(OfferCategory, {
    as: Aliase.OFFER_CATEGORY
  });

  return {
    Category,
    Type,
    User,
    Offer,
    Comment,
    OfferCategory
  };
};

module.exports = define;
