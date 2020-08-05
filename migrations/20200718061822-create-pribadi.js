'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pribadis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nik: {
        type: Sequelize.STRING
      },
      nama: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      tglLahir: {
        type: Sequelize.STRING
      },
      tptLahir: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {         // User belongsTo Company 1:1
          model: 'Users',
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
    await queryInterface.dropTable('Pribadis');
  }
};