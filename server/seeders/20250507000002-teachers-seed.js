'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('teachers', [
      {
        names: 'Roberto',
        last_names: 'Gómez',
        email: 'roberto.gomez@chaski.edu',
        phone_number: '999111222',
        specialization: 'Matemáticas',
      },
      {
        names: 'María',
        last_names: 'Rodríguez',
        email: 'maria.rodriguez@chaski.edu',
        phone_number: '999333444',
        specialization: 'Lenguaje',
      },
      {
        names: 'Juan',
        last_names: 'Pérez',
        email: 'juan.perez@chaski.edu',
        phone_number: '999555666',
        specialization: 'Ciencias Naturales',
      },
      {
        names: 'Laura',
        last_names: 'Martínez',
        email: 'laura.martinez@chaski.edu',
        phone_number: '999777888',
        specialization: 'Historia',
      },
      {
        names: 'Carlos',
        last_names: 'Sánchez',
        email: 'carlos.sanchez@chaski.edu',
        phone_number: '999999000',
        specialization: 'Educación Física',
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('teachers', null, {});
  }
};
