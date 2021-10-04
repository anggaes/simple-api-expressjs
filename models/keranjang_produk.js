'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Keranjang_Produk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Keranjang_Produk.belongsTo(models.Keranjang, {foreignKey: 'keranjangId', as: 'keranjang'})
      // Keranjang_Produk.hasMany(models.Produk, {foreignKey: 'produkId', as: 'produk'})
    }
  };
  Keranjang_Produk.init({
    keranjangId: DataTypes.INTEGER,
    produkId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Keranjang_Produk',
  });
  return Keranjang_Produk;
};