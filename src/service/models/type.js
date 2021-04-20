'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Type extends Model {}

const define = (sequelize) => Type.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Type`,
  tableName: `types`
});

module.exports = define;
