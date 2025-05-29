'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPasswordSecretary = await bcrypt.hash('secretaria123', 10);
    const hashedPasswordTeacher = await bcrypt.hash('profesor123', 10);

    // Check if secretary already exists
    const [existingSecretary] = await queryInterface.sequelize.query(
      `SELECT id FROM secretaries WHERE email = 'secretaria@gmail.com'`
    );

    if (existingSecretary.length === 0) {
      await queryInterface.bulkInsert('secretaries', [{
        names: 'Secretaria',
        last_names: 'Admin',
        email: 'secretaria@gmail.com',
        password: hashedPasswordSecretary,
        phone_number: '123456789'
      }]);
    } else {
      // Update existing secretary password
      await queryInterface.sequelize.query(
        `UPDATE secretaries SET password = '${hashedPasswordSecretary}' WHERE email = 'secretaria@gmail.com'`
      );
    }

    // Check if teacher already exists
    const [existingTeacher] = await queryInterface.sequelize.query(
      `SELECT id FROM teachers WHERE email = 'profesor@mail.com'`
    );

    if (existingTeacher.length === 0) {
      await queryInterface.bulkInsert('teachers', [{
        names: 'Profesor',
        last_names: 'Demo',
        email: 'profesor@mail.com',
        password: hashedPasswordTeacher,
        phone_number: '987654321',
        specialization: 'Educación General',
        created_at: new Date(),
        updated_at: new Date()
      }]);
    } else {
      // Update existing teacher password
      await queryInterface.sequelize.query(
        `UPDATE teachers SET password = '${hashedPasswordTeacher}' WHERE email = 'profesor@mail.com'`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('secretaries', {
      email: 'secretaria@gmail.com'
    }, {});

    await queryInterface.bulkDelete('teachers', {
      email: 'profesor@mail.com'
    }, {});
  }
};
