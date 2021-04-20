'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
  }

  async findAll(query) {
    const offers = await this._Offer.findAll({
      where: {
        title: {
          [Op.substring]: query
        }
      },
      include: [Aliase.CATEGORIES],
    });

    return offers.map((offer) => offer.get());
  }
}

module.exports = SearchService;
