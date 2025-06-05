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

      // Get the teacher ID that was just created
      const [teacherResult] = await queryInterface.sequelize.query(
        `SELECT id FROM teachers WHERE email = 'profesor@mail.com'`
      );
      const teacherId = teacherResult[0].id;

      // Assign 4 subjects to the demo teacher
      // We'll assign subjects that exist (IDs 1, 2, 3, 4 from the subjects seed)
      await queryInterface.bulkInsert('subjects_teachers', [
        {
          subject_id: 1, // Matemáticas Básicas
          teacher_id: teacherId
        },
        {
          subject_id: 2, // Lenguaje y Comunicación
          teacher_id: teacherId
        },
        {
          subject_id: 3, // Ciencias Naturales
          teacher_id: teacherId
        },
        {
          subject_id: 4, // Historia del Perú
          teacher_id: teacherId
        },
       {
          subject_id: 5, // Historia del Perú
          teacher_id: teacherId
        }, {
          subject_id: 6, // Historia del Perú
          teacher_id: teacherId
        }, {
          subject_id: 7, // Historia del Perú
          teacher_id: teacherId
        },
      ]);
    } else {
      // Update existing teacher password
      await queryInterface.sequelize.query(
        `UPDATE teachers SET password = '${hashedPasswordTeacher}' WHERE email = 'profesor@mail.com'`
      );

      // Check if teacher already has subjects assigned, if not, assign them
      const [teacherResult] = await queryInterface.sequelize.query(
        `SELECT id FROM teachers WHERE email = 'profesor@mail.com'`
      );
      const teacherId = teacherResult[0].id;

      const [existingAssignments] = await queryInterface.sequelize.query(
        `SELECT * FROM subjects_teachers WHERE teacher_id = ${teacherId}`
      );

      if (existingAssignments.length === 0) {
        // Assign 4 subjects to the demo teacher
        await queryInterface.bulkInsert('subjects_teachers', [
          {
            subject_id: 1, // Matemáticas Básicas
            teacher_id: teacherId
          },
          {
            subject_id: 2, // Lenguaje y Comunicación
            teacher_id: teacherId
          },
          {
            subject_id: 3, // Ciencias Naturales
            teacher_id: teacherId
          },
          {
            subject_id: 4, // Historia del Perú
            teacher_id: teacherId
          },
          {
            subject_id: 5, // Educación Física
            teacher_id: teacherId
          },
          {
            subject_id: 6, // Álgebra
            teacher_id: teacherId
          },
          {
            subject_id: 7, // Literatura Universal
            teacher_id: teacherId
          }
        ]);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Get teacher ID before deleting
    const [teacherResult] = await queryInterface.sequelize.query(
      `SELECT id FROM teachers WHERE email = 'profesor@mail.com'`
    );
    
    if (teacherResult.length > 0) {
      const teacherId = teacherResult[0].id;
      
      // Remove subject assignments for the demo teacher
      await queryInterface.bulkDelete('subjects_teachers', {
        teacher_id: teacherId
      }, {});
    }

    await queryInterface.bulkDelete('secretaries', {
      email: 'secretaria@gmail.com'
    }, {});

    await queryInterface.bulkDelete('teachers', {
      email: 'profesor@mail.com'
    }, {});
  }
};
