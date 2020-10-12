'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Produk.belongsToMany(models.Keranjang, {through: models.Keranjang_Produk, as : 'keranjang'})
    }
  };
  Produk.init({
    nama: DataTypes.STRING,
    harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Produk',
  });
  return Produk;
};