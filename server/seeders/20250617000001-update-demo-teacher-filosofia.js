'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Obtener el ID del profesor demo
    const [teacherResult] = await queryInterface.sequelize.query(
      `SELECT id FROM teachers WHERE email = 'profesor@mail.com'`
    );
    if (teacherResult.length > 0) {
      const teacherId = teacherResult[0].id;
      // Actualizar la especialización del profesor a Robótica
      await queryInterface.sequelize.query(
        `UPDATE teachers SET specialization = 'Robótica' WHERE id = ${teacherId}`
      );
      // Eliminar todas las asignaciones actuales del profesor demo
      await queryInterface.bulkDelete('subjects_teachers', { teacher_id: teacherId }, {});
      await queryInterface.bulkDelete('teachers_grades', { teacher_id: teacherId }, {});
      // Obtener el ID de la materia Robótica
      const [robotica] = await queryInterface.sequelize.query(
        `SELECT id, grade_id FROM subjects WHERE name ILIKE '%robotica%' OR name ILIKE '%robótica%' ORDER BY id DESC LIMIT 1`
      );
      if (robotica.length > 0) {
        // Asignar solo la materia Robótica al profesor demo
        await queryInterface.bulkInsert('subjects_teachers', [{
          subject_id: robotica[0].id,
          teacher_id: teacherId
        }]);
        // Asignar el grado correspondiente
        await queryInterface.bulkInsert('teachers_grades', [{
          teacher_id: teacherId,
          grade_id: robotica[0].grade_id
        }]);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Obtener el ID del profesor demo
    const [teacherResult] = await queryInterface.sequelize.query(
      `SELECT id FROM teachers WHERE email = 'profesor@mail.com'`
    );
    
    if (teacherResult.length > 0) {
      const teacherId = teacherResult[0].id;
      
      // Restaurar la especialización original
      await queryInterface.sequelize.query(
        `UPDATE teachers SET specialization = 'Educación General' WHERE id = ${teacherId}`
      );
      
      // Eliminar asignaciones actuales
      await queryInterface.bulkDelete('subjects_teachers', {
        teacher_id: teacherId
      }, {});
      
      await queryInterface.bulkDelete('teachers_grades', {
        teacher_id: teacherId
      }, {});
      
      // Restaurar las asignaciones originales (las 7 materias)
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
};
