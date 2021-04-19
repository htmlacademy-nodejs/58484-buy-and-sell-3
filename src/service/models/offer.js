'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Offer extends Model {}

const define = (sequelize) => Offer.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sum: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  picture: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: `Offer`,
  tableName: `offers`
});

module.exports = define;
