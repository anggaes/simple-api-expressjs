'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Keranjang_Produks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      keranjangId: {
        type: Sequelize.INTEGER,
        references: {         
          model: 'Keranjangs',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      produkId: {
        type: Sequelize.INTEGER,
        references: {      
          model: 'Produks',
          key: 'id'
        },
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Keranjang_Produks');
  }
};