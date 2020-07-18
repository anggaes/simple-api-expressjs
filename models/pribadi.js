'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pribadi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.User, {foreignKey: 'userId', as: 'company'})
    }
  };
  Pribadi.init({
    nik: DataTypes.STRING,
    nama: DataTypes.STRING,
    gender: DataTypes.STRING,
    tglLahir: DataTypes.STRING,
    tptLahir: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pribadi',
  });
  return Pribadi;
};