'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('teachers', [
      {
        id: 1,
        names: 'Roberto',
        last_names: 'Gómez',
        email: 'roberto.gomez@chaski.edu',
        phone_number: '999111222',
        specialization: 'Matemáticas',
      },
      {
        id: 2,
        names: 'María',
        last_names: 'Rodríguez',
        email: 'maria.rodriguez@chaski.edu',
        phone_number: '999333444',
        specialization: 'Lenguaje',
      },
      {
        id: 3,
        names: 'Juan',
        last_names: 'Pérez',
        email: 'juan.perez@chaski.edu',
        phone_number: '999555666',
        specialization: 'Ciencias Naturales',
      },
      {
        id: 4,
        names: 'Laura',
        last_names: 'Martínez',
        email: 'laura.martinez@chaski.edu',
        phone_number: '999777888',
        specialization: 'Historia',
      },
      {
        id: 5,
        names: 'Carlos',
        last_names: 'Sánchez',
        email: 'carlos.sanchez@chaski.edu',
        phone_number: '999999000',
        specialization: 'Educación Física',
      },
      {
        id: 6,
        names: 'Andrea',
        last_names: 'López',
        email: 'andrea.lopez@chaski.edu',
        phone_number: '999111333',
        specialization: 'Ciencias',
      },
      {
        id: 7,
        names: 'Miguel',
        last_names: 'Torres',
        email: 'miguel.torres@chaski.edu',
        phone_number: '999222444',
        specialization: 'Lenguaje',
      },
      {
        id: 8,
        names: 'Paula',
        last_names: 'Ramírez',
        email: 'paula.ramirez@chaski.edu',
        phone_number: '999333555',
        specialization: 'Matemáticas',
      },
      {
        id: 9,
        names: 'Javier',
        last_names: 'Díaz',
        email: 'javier.diaz@chaski.edu',
        phone_number: '999444666',
        specialization: 'Historia',
      },
      {
        id: 10,
        names: 'Lucía',
        last_names: 'Castro',
        email: 'lucia.castro@chaski.edu',
        phone_number: '999555777',
        specialization: 'Educación Física',
      },
      {
        id: 11,
        names: 'Sofía',
        last_names: 'Mendoza',
        email: 'sofia.mendoza@chaski.edu',
        phone_number: '999666111',
        specialization: 'Matemáticas',
      },
      {
        id: 12,
        names: 'Diego',
        last_names: 'Vargas',
        email: 'diego.vargas@chaski.edu',
        phone_number: '999777222',
        specialization: 'Ciencias',
      },
      {
        id: 13,
        names: 'Valeria',
        last_names: 'Paredes',
        email: 'valeria.paredes@chaski.edu',
        phone_number: '999888333',
        specialization: 'Lenguaje',
      },
      {
        id: 99,
        names: 'Profesor',
        last_names: 'Demo',
        email: 'profesor@mail.com',
        phone_number: '999000999',
        specialization: 'Robótica',
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('teachers', null, {});
  }
};
