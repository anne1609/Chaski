'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'citacion',
        description: 'Citación para quien corresponda',
      },
      {
        name: 'aviso',
        description: 'Aviso para quien corresponda',
      },
      {
        name: 'mensaje',
        description: 'Mensaje para quien corresponda',
      },
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
